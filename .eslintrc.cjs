const { defineConfig } = require('eslint-define-config');

/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = defineConfig({
  ignorePatterns: ['dev-dist/*'],
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
  ],
  plugins: [
    'import',
  ],
  rules: {
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': ['error', 'always'],
    'vue/require-default-prop': 'off',
    'sort-imports': ['error', {
        'ignoreCase': true,
        'ignoreDeclarationSort': true,
        'ignoreMemberSort': true,
        'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single'],
        'allowSeparatedGroups': false,
    }],
    'import/order': [
      'error',
      {
        'newlines-between': 'never',
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
});
