const rollup = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const template = require('rollup-plugin-html-literals');

module.exports = async () => {
    // eslint-disable-next-line no-console
  console.log('Building js..');

  try {
    const bundle = await rollup.rollup({
        input: `${process.cwd()}/site/src_assets/js/main.js`,
        plugins: [
          template(),
          nodeResolve(),
          terser()
        ]
      });

    const { output } = await bundle.generate({
        format: 'es',
        sourcemap: false,
      });

    return output[0].code;
    // await bundle.write({
    //     format: 'es',
    //     sourcemap: false,
    //     dir: `${process.cwd()}/docs/assets`,
    //     chunkFileNames: '[name].[hash].js',
    //   });

    // closes the bundle
    await bundle.close();

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
}
