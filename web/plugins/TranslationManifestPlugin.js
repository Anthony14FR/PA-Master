const fs = require('fs');
const path = require('path');

class TranslationManifestPlugin {
    constructor(options = {}) {
        this.messagesPath = options.messagesPath || path.join(process.cwd(), 'messages');
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync('TranslationManifestPlugin', (compilation, callback) => {
            try {
                const manifest = this.generateManifest();
                const manifestCode = `window.__TRANSLATION_MANIFEST__ = ${JSON.stringify(manifest, null, 2)};`;

                // Add the manifest as a separate asset
                compilation.assets['translation-manifest.js'] = {
                    source: () => manifestCode,
                    size: () => manifestCode.length
                };

                // Also inject it into the main bundle
                const mainAsset = compilation.assets['static/js/main.js'] ||
                    Object.keys(compilation.assets).find(name => name.includes('main') && name.endsWith('.js'));

                if (mainAsset) {
                    const originalSource = compilation.assets[mainAsset].source();
                    const newSource = manifestCode + '\n' + originalSource;

                    compilation.assets[mainAsset] = {
                        source: () => newSource,
                        size: () => newSource.length
                    };
                }

                callback();
            } catch (error) {
                callback(error);
            }
        });
    }

    generateManifest() {
        const manifest = {};

        if (!fs.existsSync(this.messagesPath)) {
            console.warn('Messages directory not found:', this.messagesPath);
            return manifest;
        }

        const locales = fs.readdirSync(this.messagesPath).filter(item =>
            fs.statSync(path.join(this.messagesPath, item)).isDirectory()
        );

        for (const locale of locales) {
            const localeDir = path.join(this.messagesPath, locale);
            manifest[locale] = this.scanDirectory(localeDir, '');
        }

        return manifest;
    }

    scanDirectory(dir, relativePath) {
        const files = [];

        if (!fs.existsSync(dir)) {
            return files;
        }

        const items = fs.readdirSync(dir);

        for (const item of items) {
            const itemPath = path.join(dir, item);
            const itemRelativePath = path.join(relativePath, item).replace(/\\/g, '/');

            if (fs.statSync(itemPath).isDirectory()) {
                // Recursively scan subdirectories
                const subFiles = this.scanDirectory(itemPath, itemRelativePath);
                files.push(...subFiles);
            } else if (item.endsWith('.json')) {
                files.push(itemRelativePath);
            }
        }

        return files;
    }
}

module.exports = TranslationManifestPlugin;