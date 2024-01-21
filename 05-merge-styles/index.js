const { readdir, readFile, writeFile } = require('fs/promises');
const path = require('path');

const distFolderPath = path.join(__dirname, 'project-dist');

// I choosed recursive because i didn't understand whether i have to bundle all styles folders in project
readdir(__dirname, { withFileTypes: true, recursive: true })
  .then((files) => {
    const filteredFiles = files.filter(
      (file) =>
        file.isFile() &&
        path.extname(file.name) === '.css' &&
        file.name !== 'bundle.css',
    );
    const fileReadPromises = filteredFiles.map((style) => {
      return readFile(path.join(style.path, style.name), 'utf8');
    });

    return Promise.all(fileReadPromises);
  })
  .then((fileContents) => {
    const accum = fileContents.join('\n');
    return writeFile(path.join(distFolderPath, 'bundle.css'), accum);
  });
