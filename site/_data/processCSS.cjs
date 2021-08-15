const { readFile } = require('fs').promises;
const postcss  = require('postcss')

module.exports = async () => {
  try {
    const result = await postcss(
      [
        require('postcss-import')({ path: ['site/assets/css'] }),
      ]
    ).process((await readFile(`${process.cwd()}/site/src_assets/css/main.css`, {encoding: 'utf8'})), { from: undefined, to: undefined });

    if (result) {
      return result;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
  return '';
}
