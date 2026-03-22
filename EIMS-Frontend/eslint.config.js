import vue from 'eslint-plugin-vue';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import vueEslintParser from 'vue-eslint-parser';

export default [
  {
    files: ['**/*.vue'],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      parser: vueEslintParser,
      parserOptions: {
        parser: typescriptParser
      }
    },
    plugins: {
      vue,
      '@typescript-eslint': typescriptPlugin
    },
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      parser: typescriptParser
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin
    },
    rules: {}
  }
];