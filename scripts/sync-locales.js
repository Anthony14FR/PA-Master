const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

/**
 * Manage traductions manifest in packages/locales
 */
function generateLocalesManifest() {
    const LOCALES_DIR = path.join(ROOT_DIR, 'packages', 'locales');
    const MANIFEST_PATH = path.join(LOCALES_DIR, 'manifest.json');
    const manifest = {};

    try {
        const localeDirs = fs.readdirSync(LOCALES_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        console.log(`📦 Generation du manifest pour ${localeDirs.length} locales: ${localeDirs.join(', ')}`);

        for (const locale of localeDirs) {
            const localePath = path.join(LOCALES_DIR, locale);
            const files = [];

            function scanDirectory(dir, relativePath = '') {
                const items = fs.readdirSync(dir, { withFileTypes: true });

                for (const item of items) {
                    const itemPath = path.join(dir, item.name);
                    const itemRelativePath = relativePath ? `${relativePath}/${item.name}` : item.name;

                    if (item.isDirectory()) {
                        scanDirectory(itemPath, itemRelativePath);
                    } else if (item.name.endsWith('.json')) {
                        files.push(itemRelativePath);
                    }
                }
            }

            scanDirectory(localePath);
            manifest[locale] = files.sort();
        }

        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
        console.log(`✅ Manifest généré: ${Object.values(manifest).reduce((sum, files) => sum + files.length, 0)} fichiers dans ${Object.keys(manifest).length} locales`);

        return manifest;
    } catch (error) {
        console.error('❌ Erreur lors de la génération du manifest:', error);
        process.exit(1);
    }
}

function main() {
    console.log('🔄 Génération du manifest des traductions...\n');
    generateLocalesManifest();
    console.log('\n✅ Synchronisation terminée - Les apps utilisent maintenant directement packages/locales');
}

if (require.main === module) {
    main();
}

module.exports = { generateLocalesManifest };