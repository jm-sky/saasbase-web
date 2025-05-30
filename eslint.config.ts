import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import perfectionist from 'eslint-plugin-perfectionist'
import pluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '.docs/**'],
  },

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.strictTypeChecked,
  vueTsConfigs.stylisticTypeChecked,
  perfectionist.configs['recommended-natural'],

  // add your custom rules here
  {
    rules: {
      'semi': ['error', 'never'],
      'quotes': ['error', 'single', { avoidEscape: true }],

      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      'vue/max-attributes-per-line': ['error', {
        'singleline': {
          'max': 3,
        },
        'multiline': {
          'max': 1,
        },
      }],
      // ----------------------------------------
      'vue/require-default-prop': 'off',
      'vue/multi-word-component-names': 'off',
      // ----------------------------------------
      'perfectionist/sort-classes': 'off',
      'perfectionist/sort-interfaces': 'off',
      'perfectionist/sort-object-types': 'off',
      'perfectionist/sort-union-types': 'off',
      'perfectionist/sort-modules': 'off',
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'alphabetical',
          order: 'asc',
          fallbackSort: { type: 'alphabetical', order: 'asc' },
          newlinesBetween: 'never',
          internalPattern: ['^~/.*', '^@/.*'],
          groups: [
            ['builtin', 'external'],
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
            'type',
            'internal-type',
          ],
        }
      ],
      'perfectionist/sort-objects': [
        'error',
        {
          type: 'unsorted',
        },
      ],
      // ----------------------------------------
    }
  },
)
