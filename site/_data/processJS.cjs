const rollup = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const replace = require('@rollup/plugin-replace');
const template = require('rollup-plugin-html-literals');

module.exports = async () => {
  const final = {};
    // eslint-disable-next-line no-console
  console.log('Building js..');

  try {
    const bundle1 = await rollup.rollup({
        input: `${process.cwd()}/site/src_assets/js/main.js`,
        plugins: [
          template(),
          nodeResolve(),
          terser()
        ]
      });

    const bundle1Out = await bundle1.generate({
        format: 'es',
        sourcemap: false,
      });

    final.main = bundle1Out.output[0].code;

    await bundle1.write({
      format: 'es',
      sourcemap: false,
      dir: `${process.cwd()}/docs/assets/js`,
    });
    // closes the bundle
    await bundle1.close();

    const bundle2 = await rollup.rollup({
        input: `${process.cwd()}/site/src_assets/js/archive.js`,
        plugins: [
          replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify('production'),
          }),
          nodeResolve(),
          terser()
        ]
      });

    const bundle2Out = await bundle2.generate({
        format: 'es',
        sourcemap: false,
      });

    final.archive = bundle2Out.output[0].code;
    await bundle2.write({
      format: 'es',
      sourcemap: false,
      dir: `${process.cwd()}/docs/assets/js`,
    });

    // closes the bundle
    await bundle2.close();

    return final;

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
}
