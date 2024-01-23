const { readdir, readFile, writeFile, mkdir } = require('fs/promises');
const path = require('path');

const distFolderPath = path.join(__dirname, 'project-dist');

// I choosed recursive because i didn't understand whether i have to bundle all styles folders in project
readdir(path.join(__dirname, 'styles'), {
  withFileTypes: true,
  recursive: true,
})
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
    mkdir(distFolderPath, { recursive: true });
    return writeFile(path.join(distFolderPath, 'bundle.css'), accum);
  });
