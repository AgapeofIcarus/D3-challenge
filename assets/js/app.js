const svgWidth = 960;
const svgHeight = 500;

const margin = {
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
  
    const PovlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height})`);

  const PovLabel = PovlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty")
    .text("In Poverty (%)")
    .classed("active", true);

    const AgeLabel = PovlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age") 
    .text("Age (Median)")
    .classed("inactive", true);

  const IncomeLabel = PovlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("value", "income") 
    .text("Household Income (Median)")
    .classed("inactive", true);

    const HealthYlabelsGroup = chartGroup.append("g");

    const healthLabel = HealthYlabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", -40)
      .attr("value", "healthcare") 
      .text("Lacks Healthcare (%)")
      .classed("active", true);
  
    const smokesLabel = HealthYlabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", -60)
      .attr("value", "smokes")
      .text("Smokes (%)")
      .classed("inactive", true);
    
    const obeseLabel = HealthYlabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", -80)
      .attr("value", "obesity") 
      .text("Obese (%)")
      .classed("inactive", true);
  
    circlesGroup = updateToolTip(circlesGroup, PovXAxis, HealthYAxis);

    PovlabelsGroup.selectAll("text")
      .on("click", function() {
      const value = d3.select(this).attr("value");
      if (value !== PovXAxis) {
        PovXAxis = value;

        xLinearScale = xScale(HealthData, PovXAxis);

        xAxis = renderXAxes(xLinearScale, xAxis);

        circlesXY = renderXCircles(circlesXY, xLinearScale, PoxXAxis);

        circlesText = renderXText(circlesText, xLinearScale, PovXAxis);

        circlesGroup = updateToolTip(circlesGroup, PovXAxis, HealthYAxis);

        if (PovXAxis === "age") {
          PovLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (PovXAxis === "income") {
          PovLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else {
          PovLabel
            .classed("active", true)
            .classed("inactive", false);
          AgeLabel
            .classed("active", false)
            .classed("inactive", true);
          IncomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });

    HealthYlabelsGroup.selectAll("text")
    .on("click", function() {

    const value = d3.select(this).attr("value");
    if (value !== HealthYAxis) {

      HealthYAxis = value;

      yLinearScale = yScale(stateData, HealthYAxis);

      yAxis = renderYAxes(yLinearScale, yAxis);

      circlesXY = renderYCircles(circlesXY, yLinearScale, HealthYAxis);

      circlesText = renderYText(circlesText, yLinearScale, HealthYAxis);

      circlesGroup = updateToolTip(circlesGroup, PovXAxis, HealthYAxis);

      if (HealthYAxis === "smokes") {
        healthLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (HealthYAxis === "obesity"){
        healthLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
          .classed("active", true)
          .classed("inactive", false);
      }
      else {
        healthLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
      }
    }
  });

})()