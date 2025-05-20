const Neocities = require('neocities');
const fs = require('fs');
const path = require('path');

const username = process.env.NEOCITIES_USERNAME;
const apiKey = process.env.NEOCITIES_API_KEY;
const site = new Neocities(username, apiKey);

console.log('Username:', username);
console.log('API Key:', apiKey ? '[set]' : '[missing]');

function getFiles(dir, fileList = []) {
  const skip = ['node_modules', '.git', '.github', '.vscode', 'deploy.js', 'package.json', 'package-lock.json'];
  fs.readdirSync(dir).forEach(file => {
    if (skip.includes(file)) return;
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      fileList.push({ name: filePath.replace(/^\.\/|\\/g, ''), path: filePath });
    }
  });
  return fileList;
}

const files = getFiles('.');

site.upload(files, function(resp) {
  console.log(resp);
});