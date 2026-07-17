import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import boundaries from 'eslint-plugin-boundaries'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  prettier,
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
      boundaries,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    settings: {
      react: { version: '19.0' },
      'import/resolver': { typescript: true },
      boundaries: {
        default: 'disallow',
        elements: [
          { type: 'app', pattern: 'app/*' },
          { type: 'pages', pattern: 'pages/*' },
          { type: 'features', pattern: 'features/*' },
          { type: 'widgets', pattern: 'widgets/*' },
          { type: 'entities', pattern: 'entities/*' },
          { type: 'shared', pattern: 'shared/*' },
        ],
        rules: [
          { from: 'app', allow: ['pages', 'features', 'widgets', 'entities', 'shared'] },
          { from: 'pages', allow: ['features', 'widgets', 'entities', 'shared'] },
          { from: 'features', allow: ['entities', 'shared', 'widgets'] },
          { from: 'widgets', allow: ['features', 'entities', 'shared'] },
          { from: 'entities', allow: ['shared', 'entities'] },
          { from: 'shared', allow: ['shared'] },
        ],
      },
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**'],
    rules: {
      'boundaries/element-types': 'off',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '*.config.*'],
  },
]
