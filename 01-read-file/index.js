const fs = require('fs');
const path = require('path');
const { stdout, stderr } = require('process');
const input = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

input.on('data', (chunk) => {
  stdout.writable
    ? stdout.write(chunk)
    : stderr.write('error: something went wrong');
});
