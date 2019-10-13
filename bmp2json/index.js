const bmp2string = require('./build/Release/bmp2json.node');

function bmp2json(src, divisor) {
  return JSON.parse(bmp2string.convert(src, divisor));
}

module.exports = { bmp2json };
