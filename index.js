const bmp2json = require('./build/Release/bmp2json.node');

console.log(typeof bmp2json.convert('cpp/input.bmp', 6))

module.exports = bmp2json;
