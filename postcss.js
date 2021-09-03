import { readFile, mkdir, writeFile } from 'fs/promises';
import postcss  from 'postcss'
import postcssImport from 'postcss-import'

(async () => {
  try {
    const result = await postcss(
      [
        postcssImport({ path: ['src_assets/css'] }),
      ]
    ).process((await readFile(`${process.cwd()}/src_assets/css/main.css`, {encoding: 'utf8'})), { from: undefined, to: undefined });

    if (result) {
      if (!(await mkdir(`${process.cwd()}/docs/assets/css`, {recursive: true}))) {
        await writeFile(`${process.cwd()}/docs/assets/css/main.css`, result.css);
      } else {
        await writeFile(`${process.cwd()}/docs/assets/css/main.css`, result.css);
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
})();
