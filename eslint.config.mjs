import typescriptEslint from '@typescript-eslint/eslint-plugin';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: ['eslint.config.mjs']
  },
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'eslint:recommended',
    'prettier'
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha
      },

      parser: tsParser,
      ecmaVersion: 9,
      sourceType: 'commonjs',

      parserOptions: {
        project: './tsconfig.json'
      }
    },

    rules: {
      'no-console': 'error'
    }
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended
];
