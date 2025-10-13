const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SHARED_LOCALES_DIR = path.join(ROOT_DIR, 'shared', 'locales');
const API_LANG_DIR = path.join(ROOT_DIR, 'api', 'lang');
const WEB_MESSAGES_DIR = path.join(ROOT_DIR, 'web', 'messages');

console.log('🔄 Synchronizing locale files...');

function copyDirectory(sourceDir, destDir, relativePath = '') {
    const items = fs.readdirSync(sourceDir);

    for (const item of items) {
        const sourcePath = path.join(sourceDir, item);
        const destPath = path.join(destDir, item);
        const itemRelativePath = path.join(relativePath, item);

        if (fs.statSync(sourcePath).isDirectory()) {
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }
            copyDirectory(sourcePath, destPath, itemRelativePath);
        } else if (item.endsWith('.json')) {
            try {
                const content = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
                fs.writeFileSync(destPath, JSON.stringify(content, null, 2));
                console.log(`✅ ${itemRelativePath} → Synced`);
            } catch (error) {
                console.error(`❌ Invalid JSON in ${itemRelativePath}:`, error.message);
                process.exit(1);
            }
        }
    }
}

function syncLocales() {
    try {
        if (!fs.existsSync(SHARED_LOCALES_DIR)) {
            console.error('❌ Shared locales directory not found:', SHARED_LOCALES_DIR);
            process.exit(1);
        }

        if (!fs.existsSync(API_LANG_DIR)) {
            fs.mkdirSync(API_LANG_DIR, { recursive: true });
        }
        if (!fs.existsSync(WEB_MESSAGES_DIR)) {
            fs.mkdirSync(WEB_MESSAGES_DIR, { recursive: true });
        }

        const locales = fs.readdirSync(SHARED_LOCALES_DIR).filter(item =>
            fs.statSync(path.join(SHARED_LOCALES_DIR, item)).isDirectory()
        );

        for (const locale of locales) {
            const sourceDir = path.join(SHARED_LOCALES_DIR, locale);
            const apiDestDir = path.join(API_LANG_DIR, locale);
            const webDestDir = path.join(WEB_MESSAGES_DIR, locale);

            if (!fs.existsSync(apiDestDir)) {
                fs.mkdirSync(apiDestDir, { recursive: true });
            }
            if (!fs.existsSync(webDestDir)) {
                fs.mkdirSync(webDestDir, { recursive: true });
            }

            console.log(`📁 Processing locale: ${locale}`);
            copyDirectory(sourceDir, apiDestDir, locale);
            copyDirectory(sourceDir, webDestDir, locale);
        }

        console.log('🎉 Locale synchronization completed!');
        console.log(`📁 Synced ${locales.length} locales to:`);
        console.log(`   - ${API_LANG_DIR}`);
        console.log(`   - ${WEB_MESSAGES_DIR}`);

        // Generate i18n manifest for automatic file discovery
        console.log('\n🔍 Generating i18n manifest...');
        const { generateI18nManifest } = require('./generate-i18n-manifest');

        // Change to web directory to generate manifest correctly
        const originalCwd = process.cwd();
        process.chdir(path.join(ROOT_DIR, 'web'));

        try {
            generateI18nManifest();
        } finally {
            process.chdir(originalCwd);
        }

    } catch (error) {
        console.error('❌ Synchronization failed:', error.message);
        process.exit(1);
    }
}

syncLocales();