import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import template from 'rollup-plugin-html-literals';

export default [
  {
    input: `${process.cwd()}/src_assets/js/main.js`,
    output: {
      file: './docs/assets/js/main.js',
      format: 'es',
      sourcemap: false,
    },
    plugins: [
      template(),
      nodeResolve({
        browser: true,
        modulesOnly: true,
        mainFields: ['module']
      }),
      terser()
    ]
  },
  {
    input: `${process.cwd()}/src_assets/js/archive.js`,
    output: {
      format: 'es',
      sourcemap: false,
      dir: `${process.cwd()}/docs/assets/js`,
    },
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      nodeResolve(),
      terser()
    ]
  }
];
