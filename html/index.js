const MIN_QUALITY=1;
const MAX_QUALITY=100;
var quality = 10;
var dots, newDotsFill, circles;

document.getElementById('min-quality').innerHTML = MIN_QUALITY;
document.getElementById('max-quality').innerHTML = MAX_QUALITY;

async function getJsonBitmap() {
  const quality = document.getElementById('quality-input').value;
  return await fetch(`http://localhost:3000/api/vader?quality=${quality}`);
  document.getElementById('play-btn').removeAttribute("disabled");
  document.getElementById('reset-btn').removeAttribute("disabled");
}

function play() {
  document.getElementById('play-btn').setAttribute("disabled","disabled");
  document.getElementById('reset-btn').setAttribute("disabled","disabled");
  circles
    .transition()
    .delay(function() { return Math.random() * 1000 + 1000; })
    .duration(function() { return Math.random() * 2000; })
    .attr('fill', function(n, i) { return newDotsFill[i]; })
    .attr('cx', function({cx}) { return cx; });
  document.getElementById('reset-btn').removeAttribute("disabled");
}

function reset() {
  document.getElementById('play-btn').setAttribute("disabled","disabled");
  document.getElementById('reset-btn').setAttribute("disabled","disabled");
  circles
    .transition()
    .delay(function() { return Math.random() * 1000 + 1000; })
    .duration(function() { return Math.random() * 2000; })
    .attr('fill', function(n, i) { return dots[i].fill; })
    .attr('cx', function({cx}, i) { return dots[i].cx; });
  document.getElementById('play-btn').removeAttribute("disabled");
}

function onQualityChange(value) {
  if (value < MIN_QUALITY) {
    document.getElementById('quality-input').value = 1;
  }
  else if (value > MAX_QUALITY) {
    document.getElementById('quality-input').value = 10;
  }
  else if (value*10%10 !== 0) {
    document.getElementById('quality-input').value = Math.floor(value);
  }

  d3.select("svg").selectAll("*").remove();
  fetchAndPrep();
  document.getElementById('play-btn').removeAttribute("disabled");
  document.getElementById('reset-btn').removeAttribute("disabled");
}

function prepAnimation(img) {
  const dotsInRow = img[0].length;
  const dotConf = {
    N: dotsInRow * img.length,
    r: (window.innerWidth / 4) / dotsInRow,
    dotsInRow,
    cpadding: 1,
    trimRow: true
  };

  dots = function(N, r, dotsInRow, trimRow) {
    const { innerWidth, innerHeight } = window;
    const dotsInRowFloat = innerWidth / (r * 2);
    const margin = (dotsInRowFloat - dotsInRow) * r;
    let total = N;

    total = trimRow ? total - total%dotsInRow : total;
    let result = [];
    for(let i = 0; i < total; i++) {
      const row = Math.floor(i / dotsInRow);
      const offsetWidth = dotsInRow * r * 2 * row - margin;
      const offsetHeight = 0;

      const perc = i / (N - 1);
      const color = Math.floor(perc * 255);
      const dot = {
        "cx": i * r * 2 + r - offsetWidth,
        "cy": r + r * row * 2 + offsetHeight,
        "r": r,
        "fill": `rgb(${color},${color},${color})`
      };
      result.push(dot);
    }
    return result;
  }(dotConf.N, dotConf.r, dotConf.dotsInRow, dotConf.trimRow);

  circles = function (N, r, cpadding, trimRow) {
    const svg = d3.select('svg').append('g');
    return svg.selectAll()
      .data(dots)
      .enter()
      .append('circle')
      .attr('cx', function({cx}) { return cx + Math.random() * 10; })
      .attr('cy', function({cy}) { return cy; })
      .attr('r', function({r}) { return r - cpadding; })
      .attr('fill', function({fill}) { return fill; })
  }(
    dotConf.N,
    dotConf.r,
    dotConf.cpadding,
    dotConf.trimRow
  );

  const flatPixelMap = img.flatMap(x => x);

  newDotsFill = dots.map((dot, i) => {
    const newColor = Math.floor(255 * flatPixelMap[i]);
    return `rgb(${newColor},${newColor},${newColor})`;
  });
}

function fetchAndPrep() {
  getJsonBitmap()
  .then(res => {
    res.json().then(img => {
      prepAnimation(img);
    });
  })
  .catch(err => {
    console.error(err);
  });
}

fetchAndPrep();
