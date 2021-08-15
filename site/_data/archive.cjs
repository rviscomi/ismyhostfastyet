const { promises: fs } = require("fs");

const getFiles = async (path = "./") => {
  const entries = await fs.readdir(path, { withFileTypes: true });

  // Get files within the current directory and add a path key to the file objects
  const files = entries
    .filter(file => !file.isDirectory())
    .map(file => ({ ...file, path: path + file.name }));

  // Get folders within the current directory
  const folders = entries.filter(folder => folder.isDirectory());

  for (const folder of folders)
  /*
   * Add the found files within the subdirectory to the files array by calling the
   * current function itself
   */
    files.push(...await getFiles(`${path}${folder.name}/`));

  return files;
}

module.exports = async () => {
  let output = {};

  const files = await getFiles('./archive/');

  for (const file of files) {
  /*
   * Add the found files within the subdirectory to the files array by calling the
   * current function itself
   */
   const year = file.name.split("-")[0];
   const month = file.name.split("-")[1].replace('.json', '');

   if (!output[year]) {
     output[year] = {};
   }

   let data = JSON.parse(await fs.readFile(file.path, 'utf8'));
   data = data.map(item => {
     item.fast = Math.round((item.fast * 100) * 100) / 100;
     item.avg = Math.round((item.avg * 100) * 100) / 100;
     item.slow = Math.round((item.slow * 100) * 100) / 100;
     return item;
    });

   output[year][month] = data;
  }

  return output;
}
