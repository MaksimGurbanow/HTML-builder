const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');
const input = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Please enter the text: ');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exit();
  } else {
    input.write(data, (err) => {
      try {
        stdout.write('The text was added: ' + data);
      } catch {
        throw err;
      }
    });
  }
});
process.on('exit', () => {
  stdout.write('The program finished! Bye!');
});

process.on('SIGINT', () => {
  exit();
});
