import i18nConfig from '@kennelo/config/i18n.config.json';

/**
 * Domain Service - Handles domain and subdomain operations
 * Centralized logic for domain validation, extraction, and manipulation
 */
class DomainService {
    constructor() {
        this.allowedDomains = this._getAllowedDomains();
        this.rootDomain = i18nConfig.defaultDomaine;
        this.rootBaseName = this._getBaseName(this.rootDomain);
    }

    /**
     * Get all allowed domains from i18n config
     * @private
     * @returns {string[]} Array of allowed domains
     */
    _getAllowedDomains() {
        const domains = [];
        i18nConfig.locales.forEach(locale => {
            if (locale.domains) {
                locale.domains.forEach(domainConfig => {
                    domains.push(domainConfig.domain);
                });
            }
        });
        return domains;
    }

    /**
     * Extract base domain name (first part before TLD)
     * @private
     * @param {string} domain - Domain to extract from
     * @returns {string|null} Base name or null
     */
    _getBaseName(domain) {
        if (!domain) return null;
        const parts = domain.split('.');
        return parts.length >= 2 ? parts[0] : domain;
    }

    /**
     * Get base domain (domain without subdomain)
     * @param {string} host - Host to extract from
     * @returns {string|null} Base domain or null
     */
    getBaseDomain(host) {
        if (!host) return null;
        const parts = host.split('.');
        return parts.length >= 2 ? parts.slice(-2).join('.') : host;
    }

    /**
     * Extract subdomain from request
     * @param {NextRequest} request - Next.js request
     * @returns {string|null} Subdomain or null
     */
    extractSubdomain(request) {
        const host = request.headers.get('host') || '';
        const hostname = host.split(':')[0];

        if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
            return this._extractLocalSubdomain(hostname);
        }

        if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
            const parts = hostname.split('---');
            return parts.length > 0 ? parts[0] : null;
        }

        return this._extractProductionSubdomain(hostname);
    }

    /**
     * Extract subdomain for localhost environment
     * @private
     * @param {string} hostname - Hostname
     * @returns {string|null} Subdomain or null
     */
    _extractLocalSubdomain(hostname) {
        if (hostname.includes('.localhost')) {
            return hostname.split('.')[0];
        }

        if (hostname.includes('.127.0.0.1')) {
            return hostname.split('.')[0];
        }

        return null;
    }

    /**
     * Extract subdomain for production environment
     * @private
     * @param {string} hostname - Hostname
     * @returns {string|null} Subdomain or null
     */
    _extractProductionSubdomain(hostname) {
        for (const allowedDomain of this.allowedDomains) {
            const domainFormatted = allowedDomain.split(':')[0];
            
            const isSubdomain =
                hostname !== domainFormatted &&
                hostname !== `www.${domainFormatted}` &&
                hostname.endsWith(`.${domainFormatted}`);

            if (isSubdomain) {
                return hostname.replace(`.${domainFormatted}`, '');
            }
        }
        
        return null;
    }

    /**
     * Validate if a URL is allowed for redirects
     * @param {string} urlString - URL to validate
     * @returns {boolean} True if valid
     */
    isValidReturnUrl(urlString) {
        try {
            const url = new URL(urlString);
            const hostname = url.hostname;
            const baseDomain = this.getBaseDomain(hostname);

            if (this.allowedDomains.includes(baseDomain)) {
                return true;
            }

            for (const allowedDomain of this.allowedDomains) {
                if (hostname === allowedDomain || hostname.endsWith(`.${allowedDomain}`)) {
                    return true;
                }
            }

            const hostnameBaseName = this._getBaseName(baseDomain);
            return hostnameBaseName === this.rootBaseName;
        } catch {
            return false;
        }
    }

    /**
     * Check if current domain is the default domain
     * @param {string} currentHost - Current host
     * @returns {boolean} True if default domain
     */
    isDefaultDomain(currentHost) {
        const currentBaseDomain = this.getBaseDomain(currentHost);
        const defaultBaseDomain = this.getBaseDomain(this.rootDomain);
        return currentBaseDomain === defaultBaseDomain;
    }

    /**
     * Get root domain
     * @returns {string} Root domain
     */
    getRootDomain() {
        return this.rootDomain;
    }

    /**
     * Get all allowed domains
     * @returns {string[]} Array of allowed domains
     */
    getAllowedDomains() {
        return this.allowedDomains;
    }
}

export const domainService = new DomainService();
