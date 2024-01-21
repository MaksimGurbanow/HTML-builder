const { copyFile, mkdir, readdir } = require('fs/promises');
const path = require('path');

mkdir(path.join(__dirname, 'files-copy'), { recursive: true }).then(() => {
  readdir(path.join(__dirname, 'files'), {
    withFileTypes: true,
    recursive: true,
  }).then((files) => {
    files.forEach((file) => {
      copyFile(
        path.join(__dirname, 'files', file.name),
        path.join(__dirname, 'files-copy', file.name),
      );
    });
  });
});
