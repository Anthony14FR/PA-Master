const fs = require('fs');
const path = require('path');

function scanTranslationFiles(dir, basePath = '') {
    const files = [];

    if (!fs.existsSync(dir)) {
        return files;
    }

    const items = fs.readdirSync(dir);

    for (const item of items) {
        const itemPath = path.join(dir, item);
        const relativePath = path.join(basePath, item).replace(/\\/g, '/');

        if (fs.statSync(itemPath).isDirectory()) {
            // Recursively scan subdirectories
            files.push(...scanTranslationFiles(itemPath, relativePath));
        } else if (item.endsWith('.json')) {
            files.push(relativePath);
        }
    }

    return files;
}

function generateI18nManifest() {
    const messagesDir = path.join(process.cwd(), 'messages');
    const outputPath = path.join(process.cwd(), 'src/lib/translation-manifest.json');

    const manifest = {};

    if (!fs.existsSync(messagesDir)) {
        console.warn('Messages directory not found:', messagesDir);
        fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
        return manifest;
    }

    const locales = fs.readdirSync(messagesDir).filter(item =>
        fs.statSync(path.join(messagesDir, item)).isDirectory()
    );

    for (const locale of locales) {
        const localeDir = path.join(messagesDir, locale);
        manifest[locale] = scanTranslationFiles(localeDir);
    }

    // Write manifest to file
    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));

    console.log('📄 Generated translation manifest:', outputPath);
    console.log('📁 Locales found:', Object.keys(manifest));

    for (const [locale, files] of Object.entries(manifest)) {
        console.log(`  ${locale}: ${files.length} files`);
    }

    return manifest;
}

if (require.main === module) {
    generateI18nManifest();
}

module.exports = { generateI18nManifest, scanTranslationFiles };