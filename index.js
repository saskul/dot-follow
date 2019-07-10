const dotsInRow = IMG[0].length;
const dotConf = {
  N: dotsInRow * IMG.length,
  r: (window.innerWidth / 4) / dotsInRow,
  dotsInRow,
  cpadding: 1,
  trimRow: true
};

const dots = function(N, r, dotsInRow, trimRow) {
  const { innerWidth, innerHeight } = window;
  const dotsInRowFloat = innerWidth / (r * 2);
  const margin = 0;//(dotsInRowFloat - dotsInRow) * r;
  let total = N;

  /*  TO-DO: function to get maximum number of dots
  const totalArea = (innerWidth - margin * 2) * (innerHeight - margin * 2);
  const circleArea = Math.pow(r * 2, 2);
  const maxDots = totalArea / circleArea;
  let total = N > maxDots ? maxDots : N;
  */

  total = trimRow ? total - total%dotsInRow : total;
  let result = [];
  for(let i = 0; i < total; i++) {
    const row = Math.floor(i / dotsInRow);
    const offsetWidth = dotsInRow * r * 2 * row - margin;
    const offsetHeight = margin;
    const perc = i / (N - 1);
    const color = Math.floor(perc * 255);
    const dot = {
      "cx": i * r * 2 + r - offsetWidth,
      "cy": r + r * row * 2 + offsetHeight,
      "r": r,
      "fill": `rgb(${color},${color},${color})`//`rgba(0,0,${perc * 255},${perc})`
    };
    result.push(dot);
  }
  return result;
}(dotConf.N, dotConf.r, dotConf.dotsInRow, dotConf.trimRow);

const circles = function (N, r, cpadding, trimRow) {
  const svg = d3.select('svg').append('g');
  return svg.selectAll()
    .data(dots)
    .enter()
    .append('circle')
    .attr('cx', function({cx}) { return cx; })
    .attr('cy', function({cy}) { return cy; })
    .attr('r', function({r}) { return r - cpadding; })
    .attr('fill', function({fill}) { return fill; })
}(
  dotConf.N,
  dotConf.r,
  dotConf.cpadding,
  dotConf.trimRow
);

const flatPixelMap = IMG.flatMap(x => x);
const newDotsFill = dots.map((dot, i) => {
  const newColor = Math.floor(255 * flatPixelMap[i]);
  return `rgb(${newColor},${newColor},${newColor})`;
});

circles
  .transition()
  .delay(function() { return Math.random() * 1000; })
  .duration(function() { return Math.random() * 2000; })
  .attr('fill', function(n, i) {
    return newDotsFill[i];
  });
