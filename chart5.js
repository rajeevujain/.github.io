async function init4() {
  var margin = { top: 50, right: 100, bottom: 80, left: 50 },
    width = 960 - margin.left - margin.right,
    //width = 960  - margin.left,
    height = 650 - margin.top - margin.bottom;

  var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");



  const data = await d3.csv("https://raw.githubusercontent.com/rajeevujain/DV/master/All_Countries_pivot.csv");
  //const data = d3.csv("https://raw.githubusercontent.com/rajeevujain/DV/master/world.csv");

  var allGroup = d3.map(data, function(d){return(d.country)}).keys()

  // add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // A color scale: one color for each group
  var myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(d3.schemeSet2);

  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    //.domain(d3.extent(data, function (d) { return d.date; }))
    .domain([1962,2018])
    .range([0, width ]);

    svg.append("g")
      .attr("transform", "translate(10," + height + ")")
      .call(d3.axisBottom(x).tickValues([1962,1966,1970,1974,1978,1982,1986,1990,1994,1998,2002,2006,2010,2014,2018]))
      .style("font-size","12px");

      // text label for the x axis
 svg.append("text")
   .attr("transform",
         "translate(" + (width/2) + " ," +
                        (height + margin.top ) + ")")
   .style("text-anchor", "middle")
   .text("Year");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([25, d3.max(data, function(d) { return +d.value; })])
    .range([ height, 0 ]);

    svg.append("g")
      .attr("transform", "translate(10,0 )")
      .call(d3.axisLeft(y))
      .style("font-size","12px");

      // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Life Expectancy");

  // Initialize line with first group of the list
  var line = svg
    .append('g')
    .append("path")
    .attr("transform", "translate(10,0 )")
      .datum(data.filter(function(d){return d.country==allGroup[0]}))
      .attr("d", d3.line()
        .x(function(d) { return x(d.year) })
        .y(function(d) { return y(+d.value) })
      )
      .attr("stroke", function(d){ return myColor("valueA") })
      .style("stroke-width", 2.5)
      .style("fill", "none")

  // A function that update the chart
  function update(selectedGroup) {

    // Create new data with the selection?
    var dataFilter = data.filter(function(d){return d.country==selectedGroup})


    // Give these new data to update line
    line
        .datum(dataFilter)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function(d) { return x(d.year) })
          .y(function(d) { return y(+d.value) })
        )
        .attr("stroke", function(d){ return myColor(selectedGroup) })
  }

  // When the button is changed, run the updateChart function
  d3.select("#selectButton").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value")
      // run the updateChart function with this selected option
      update(selectedOption)
  })

  //Below code is for world line chart
    const data1 = await d3.csv("https://raw.githubusercontent.com/rajeevujain/DV/master/world.csv");
    //const data = d3.csv("https://raw.githubusercontent.com/rajeevujain/DV/master/world.csv");

    data1.forEach(function (d) {
      date = d.date;
      value = d.value;
    })


    svg.append("path")
    .attr("transform", "translate(10,0 )")
      .datum(data1)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5)
      .attr("d", d3.line()
        .x(function (d) { return x(d.date) })
        .y(function (d) { return y(d.value) })
      )


}
