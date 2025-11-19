import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, '../locales');
const OUTPUT_DIR = path.join(__dirname, '../dist');

function mergeDeep(target, source) {
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            target[key] = target[key] || {};
            mergeDeep(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

function buildNestedObject(relativePath, content) {
    const parts = relativePath.replace('.json', '').split(path.sep);

    if (parts[0] === 'common') {
        return content;
    }

    const result = {};
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = {};
        current = current[parts[i]];
    }

    const lastKey = parts[parts.length - 1];
    current[lastKey] = content;

    return result;
}

function loadLocaleFiles(localeDir, basePath = '') {
    const messages = {};
    const entries = fs.readdirSync(localeDir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(localeDir, entry.name);
        const relativePath = path.join(basePath, entry.name);

        if (entry.isDirectory()) {
            const nested = loadLocaleFiles(fullPath, relativePath);
            mergeDeep(messages, nested);
        } else if (entry.name.endsWith('.json')) {
            const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            const nested = buildNestedObject(relativePath, content);
            mergeDeep(messages, nested);
        }
    }

    return messages;
}

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const locales = fs.readdirSync(LOCALES_DIR).filter(name => {
    const stat = fs.statSync(path.join(LOCALES_DIR, name));
    return stat.isDirectory();
});

console.log(`Building translations for ${locales.length} locales...`);

for (const locale of locales) {
    const localeDir = path.join(LOCALES_DIR, locale);
    const messages = loadLocaleFiles(localeDir);

    const outputPath = path.join(OUTPUT_DIR, `${locale}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(messages, null, 2));

    console.log(`✓ Built ${locale}.json`);
}

console.log(`\n✨ Successfully built ${locales.length} translation files`);
