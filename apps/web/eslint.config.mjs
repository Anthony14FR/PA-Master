import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import sonarjs from "eslint-plugin-sonarjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals"),
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
        ],
    },
    {
        plugins: {
            sonarjs,
        },
        rules: {
            "indent": ["error", 4],
            "no-console": "warn",
            "react/jsx-indent": ["error", 4],
            "react/jsx-indent-props": ["error", 4],

            "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
            "no-undef": "error",
            "eqeqeq": ["error", "always", { "null": "ignore" }],
            "no-constant-condition": "error",
            "consistent-return": "error",

            "sonarjs/no-identical-functions": "warn",
            "sonarjs/cognitive-complexity": ["warn", 20],
            "sonarjs/no-duplicate-string": ["warn", { "threshold": 5 }],
            "sonarjs/prefer-immediate-return": "warn",

            "no-var": "warn",
            "prefer-const": "warn",
            "prefer-template": "warn",
            "no-useless-return": "warn",
            "no-else-return": "warn",
            "no-lonely-if": "warn",
            "yoda": "warn",
        },
    },
];

export default eslintConfig;
