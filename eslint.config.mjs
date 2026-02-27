import * as mdx from 'eslint-plugin-mdx';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['node_modules/**', 'build/**', '.docusaurus/**', 'scripts/**'],
  },
  {
    ...mdx.flat,
  },
  {
    ...mdx.flatCodeBlocks,
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['src/**/*.ts', 'src/**/*.tsx'],
  })),
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
