const bmp2string = require('./build/Release/bmp2json.node');
const Jimp = require('jimp');

function getBrightPixelMatrix(src, divisor, targetColour) {
  return JSON.parse(bmp2string.convert(src, divisor, targetColour));
}


// Duct taped feature for getting all colours, it should be done in C++ instead.
function getColourPixelMatrix(src, divisor) {
  const redPixels = getBrightPixelMatrix(src, divisor, 'red');
  const bluePixels = getBrightPixelMatrix(src, divisor, 'blue');
  const greenPixels = getBrightPixelMatrix(src, divisor, 'green');

  let colourPixelMatrix = [];

  redPixels.forEach((row, y) => {
    let newRow = [];
    row.forEach((red, x) => {
      newRow.push({
        red,
        green: greenPixels[y][x],
        blue: bluePixels[y][x]
      });
    });
    colourPixelMatrix.push(newRow);
  });

  return colourPixelMatrix;
}

module.exports = { getBrightPixelMatrix, getColourPixelMatrix };
