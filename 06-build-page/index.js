const {
  readdir,
  mkdir,
  access,
  copyFile,
  readFile,
  writeFile,
} = require('fs/promises');
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');

const copyDirectory = (src, dest) => {
  return mkdir(dest, { recursive: true })
    .then(() => readdir(src, { withFileTypes: true }))
    .then((files) => {
      const copyPromises = files.map((file) => {
        const sourcePath = path.join(src, file.name);
        const destPath = path.join(dest, file.name);

        return file.isFile()
          ? copyFile(sourcePath, destPath)
          : copyDirectory(sourcePath, destPath);
      });

      return Promise.all(copyPromises);
    });
};

const bundleCSS = (src, dest) => {
  return readdir(src, { withFileTypes: true, recursive: true })
    .then((files) => {
      const cssFiles = files.filter(
        (file) => file.isFile() && path.extname(file.name) === '.css',
      );

      const fileReadPromises = cssFiles.map((style) =>
        readFile(path.join(style.path, style.name), 'utf8'),
      );

      return Promise.all(fileReadPromises);
    })
    .then((fileContents) => {
      const accum = fileContents.join('\n');
      return writeFile(dest, accum);
    });
};

const bundleHTML = (src, dest, template) => {
  return readdir(src, { withFileTypes: true, recursive: true })
    .then((files) =>
      files.filter(
        (file) => file.isFile() && path.extname(file.name) === '.html',
      ),
    )
    .then((htmlFiles) => {
      return readFile(template, 'utf8').then((templateContent) => {
        const filePromises = htmlFiles.map((file) => {
          const filePath = path.join(src, file.name);
          return readFile(filePath, 'utf8').then((fileValue) => {
            const componentName = path.basename(file.name, '.html');
            const componentPlaceholder = new RegExp(
              `{{${componentName}}}`,
              'g',
            );
            templateContent = templateContent.replaceAll(
              componentPlaceholder,
              fileValue,
            );

            return writeFile(dest, templateContent, {
              encoding: 'utf8',
            });
          });
        });

        return Promise.all(filePromises);
      });
    });
};

access(distPath)
  .catch(() => mkdir(distPath))
  .then(() => readdir(__dirname, { withFileTypes: true }))
  .then((files) => {
    const assetDir = files.find(
      (file) => file.name === 'assets' && file.isDirectory(),
    );

    if (assetDir) {
      const sourcePath = path.join(__dirname, assetDir.name);
      const destPath = path.join(distPath, assetDir.name);
      copyDirectory(sourcePath, destPath).then(() =>
        console.log('Assets copied successfully.'),
      );
    }

    const styleDir = files.find(
      (file) => file.name === 'styles' && file.isDirectory(),
    );

    if (styleDir) {
      const sourcePath = path.join(__dirname, styleDir.name);
      const destPath = path.join(distPath, 'style.css');
      bundleCSS(sourcePath, destPath).then(() => {
        console.log('Styles are created');
      });
    }

    const htmlDir = files.find(
      (file) => file.isDirectory() && file.name === 'components',
    );

    if (htmlDir) {
      const sourcePath = path.join(__dirname, htmlDir.name);
      const destPath = path.join(distPath, 'index.html');
      const templatePath = path.join(__dirname, 'template.html');

      return bundleHTML(sourcePath, destPath, templatePath).then(() =>
        console.log('HTML file processed successfully.'),
      );
    }
  });
