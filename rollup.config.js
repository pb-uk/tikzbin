import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';

import pkg from './package.json';

// Human timestamp for banner.
const datetime = new Date().toISOString().substring(0, 19).replace('T', ' ');

const pkgName = pkg.name.replace(/@.*\//, '');

// Main banner.
const banner = `/*! ${pkgName} v${pkg.version} ${datetime}
 *! ${pkg.homepage}
 *! Copyright ${pkg.author} ${pkg.license} license.
 */
`;

export default {
  input: './src/index.ts',
  output: {
    file: './docs/index.min.js',
    format: 'iife',
    banner,
    sourcemap: true,
  },
  plugins: [nodeResolve(), typescript(), json(), terser()],
};
