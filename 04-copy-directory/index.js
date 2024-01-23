const { copyFile, mkdir, readdir, rm, access } = require('fs/promises');
const path = require('path');

const copyPath = path.join(__dirname, 'files-copy');

access(copyPath)
  .catch(() => mkdir(copyPath))
  .then(() =>
    rm(copyPath, { recursive: true }, (err) => console.log(err)).then(() => {
      mkdir(copyPath, { recursive: true }).then(() => {
        readdir(path.join(__dirname, 'files'), {
          withFileTypes: true,
          recursive: true,
        }).then((files) => {
          files.forEach((file) => {
            copyFile(
              path.join(__dirname, 'files', file.name),
              path.join(copyPath, file.name),
            );
          });
        });
      });
    }),
  );
