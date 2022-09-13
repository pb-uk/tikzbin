import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/index.ts',
  output: {
    file: './docs/index.min.js',
    format: 'iife',
  },
  plugins: [nodeResolve(), typescript()],
};
