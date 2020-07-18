async function init1() {
  var margin = { top: 75, right: 100, bottom: 200, left: 150 },
    width = 960 - margin.left - margin.right,
    //width = 960  - margin.left,
    height = 960 - margin.top - margin.bottom;

  var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


  const data = await d3.csv("https://raw.githubusercontent.com/rajeevujain/DV/master/female_world.csv");
  //const data = d3.csv("https://raw.githubusercontent.com/rajeevujain/DV/master/world.csv");

  data.forEach(function (d) {
    date = d.date;
    value = d.value;
  })



  var x = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return d.date; }))
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  var y = d3.scaleLinear()
    .domain([50, d3.max(data, function (d) { return +d.value; })])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y(d.value) })
    )

}
