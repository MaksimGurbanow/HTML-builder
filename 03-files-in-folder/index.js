const path = require('path');
const { readdir, stat } = require('fs/promises');
const { stdout } = require('process');

readdir(path.join(__dirname, 'secret-folder'), {
  withFileTypes: true,
}).then((files) => {
  files.forEach((file) => {
    const filePath = path.join(__dirname, 'secret-folder', file.name);

    stat(filePath).then((stats) => {
      const fileInfo = path.parse(filePath);

      if (stats.isFile()) {
        stdout.write(
          `${fileInfo.name} - ${fileInfo.ext} - ${(stats.size / 1024).toFixed(
            2,
          )}kb\n`,
        );
      }
    });
  });
});
