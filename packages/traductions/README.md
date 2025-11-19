# @kennelo/translations

Shared translation files for Kennelo web and mobile applications.

## Structure

```
src/locales/
  ├── en/          # English translations
  ├── fr/          # French translations
  ├── de/          # German translations
  └── it/          # Italian translations
```

Each locale folder can contain:

- `common.json` - Common translations merged at root level
- Other JSON files organized by feature (e.g., `auth/login.json`)

## Build

The build process aggregates all JSON files per locale into single files:

```bash
pnpm build
```

Output: `dist/en.json`, `dist/fr.json`, etc.

## Usage

### Web (Next.js)

Translations are copied to `public/locales/` during build and loaded via HTTP.

### Mobile

Import directly from package:

```javascript
import translations from "@kennelo/translations/dist/en.json";
```

## Adding Translations

1. Edit files in `locales/{locale}/`
2. Run `pnpm build` to regenerate aggregated files
3. Commit both source and dist files
