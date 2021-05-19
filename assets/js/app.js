var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 90,
    left: 100
  };

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

//Let's make a space for our chart.

const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 20);

const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

let PovXAxis = "poverty";
let HealthYAxis = "healthcare";

(async function(){

  // Import Data
  const HealthData = await d3.csv("assets/data/data.csv");

  HealthData.forEach(function(data) {
    data.poverty    = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age        = +data.age;
    data.smokes     = +data.smokes;
    data.obesity    = +data.obesity;
    data.income     = +data.income;
  });
// This time we're updating scale and axis functions.

  let xLinearScale = xScale(HealthData, PovXAxis);
  let yLinearScale = yScale(HealthData, HealthYAxis);
  
  let lowerAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale);

  let xAxis = chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(lowerAxis);

  let yAxis = chartGroup.append("g")
    .call(leftAxis);

  // Create scatterplot and append initial circles
  let circlesGroup = chartGroup.selectAll("g circle")
    .data(HealthData)
    .enter()
    .append("g");

  let circlesXY = circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d[PovXAxis]))
    .attr("cy", d => yLinearScale(d[HealthYAxis]))
    .attr("r", 15)
    .classed("stateCircle", true);
  
  let circlesText = circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d[PovXAxis]))
    .attr("dy", d => yLinearScale(d[HealthYAxis]) + 5)
    .classed("stateText", true);
  
    const xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height})`);

  const povertyLabel = PovlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty")
    .text("In Poverty (%)")
    .classed("active", true);