const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const tfIdf = require("tf-idf");

const tokens = String(fs.readFileSync('./tokens.txt'));

console.log(tokens);