//---------------------------------------------------------------------
// Crossstitch SVG renderer
//---------------------------------------------------------------------

function csRender(data1) {
  // Convert data to stitch list
  var data = [];
  for (var y=0; y<data1.length; y++) {
    for (var x=0; x<data1[y].length; x++) {
      if (data1[y][x] != " ") {
        data.push([x+4,y+4]);
      }
    }
  }

  var px_per_stitch = 12;
  var margin = {top: 15.5, right: px_per_stitch+15, bottom: 15, left: 15.5};
  var xMin = 0;//d3.min(data, function (d) {return d[0];});
  var xMax = d3.max(data, function (d) {return d[0];})+5;
  var yMin = 0;//d3.min(data, function (d) {return d[1];});
  var yMax = d3.max(data, function (d) {return d[1];})+5;
  var width = (xMax-xMin+3)*px_per_stitch - margin.left - margin.right;
  var height = (yMax-yMin+3)*px_per_stitch - margin.top - margin.bottom;
  d3.select("body").selectAll("svg").remove();
  var svg = d3.select("#qr")
      .append("svg")
      .attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
      })
      .append("g")
      .attr({
        transform: "translate(" + margin.left + "," + margin.top +"), scale("+px_per_stitch+")"
      });
  var defs = svg.append("defs");
  defs.append("marker").attr({
      id: "triangle-end",
      viewBox: "0 0 12 12",
      refX: 10, refY: 10,
      markerWidth: 8, markerHeight: 20,
      orient: "auto"
    })
    .append("path")
    .attr("d","M 0 0 L 10 10 L 0 20 z");
  svg.append("rect").attr({
    x:xMin, y:yMin,
    width: xMax-yMin, height:yMax-yMin,
    fill:"none",
    stroke:"black", "stroke-width":0.1
  });
  for (var i=xMin; i<=xMax; i++) {
    svg.append("line").attr({
      x1: i, x2: i,
      y1: yMin, y2: yMax,
      stroke: i%5 ? "#ccf" : "#66c",
      "stroke-width": 0.05
    });
  }
  for (var i=yMin; i<=yMax; i++) {
    svg.append("line").attr({
      x1: xMin, x2: xMax,
      y1: i, y2: i,
      stroke: i%5 ? "#ccf":"#66c",
      "stroke-width": 0.05
    });
  }
  var xCentre = Math.floor(xMax/2);
  var yCentre = Math.floor(yMax/2);
  svg.append("line").attr({
    x1: xCentre+.5, x2: xCentre+.5,
    y1: -.5, y2: 0,
    stroke: "black", "stroke-width": 0.1,
    "marker-end": "url(#triangle-end)"
  });
  svg.append("line").attr({
    x1: xCentre+.5, x2: xCentre+.5,
    y1: yMax+.5, y2: yMax,
    stroke: "black", "stroke-width": 0.1,
    "marker-end": "url(#triangle-end)"
  });
  svg.append("line").attr({
    x1: -.5, x2: 0,
    y1: yCentre+.5, y2: yCentre+.5,
    stroke: "black", "stroke-width": 0.1,
    "marker-end": "url(#triangle-end)"
  });
  svg.append("line").attr({
    x1: xMax+.5, x2: xMax,
    y1: xCentre+.5, y2: xCentre+.5,
    stroke: "black", "stroke-width": 0.1,
    "marker-end": "url(#triangle-end)"
  });
  svg.append("g").selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr({
      x: function(d) {return d[0]+.1;},
      y: function(d) {return d[1]+.1;},
      width: .8,
      height: .8,
      fill: "darkblue"
    });
}
