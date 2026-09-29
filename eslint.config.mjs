import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  {
    ignores: ['src/_components/ui/**'],
    rules: {
      'max-lines-per-function': ['warn', 50],
      'max-params': ['warn', 3],
      'max-depth': ['warn', 2],
      'max-nested-callbacks': ['warn', 2],
    },
  },
];

export default eslintConfig;
