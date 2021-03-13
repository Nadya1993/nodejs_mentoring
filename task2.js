const csvtojson = require("csvtojson");
const fs = require('fs');
const inputFile = './csv/book.csv';
const outputFile = './txt/file.txt';
const readable = fs.createReadStream(inputFile, 'utf8');
const writable = fs.createWriteStream(outputFile, 'utf8');

csvtojson()
.fromStream(readable)
.subscribe(
  (jsonItem) => (writable.write(JSON.stringify(jsonItem).concat('\n'), 'utf8')),
  (error) => (error && console.log(error))
);