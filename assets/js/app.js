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
  const stateData = await d3.csv("assets/data/data.csv");

  stateData.forEach(function(data) {
    data.poverty    = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age        = +data.age;
    data.smokes     = +data.smokes;
    data.obesity    = +data.obesity;
    data.income     = +data.income;
  });
// This time we're updating scale and axis functions.

  let xLinearScale = xScale(stateData, chosenXAxis);
  let yLinearScale = yScale(stateData, chosenYAxis);
  
  let bottomAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale);

  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

  function renderCircles(circlesGroup, newXScale, PovXAxis, newYScale, HealthYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[PovXAxis]))
      .attr("cy", d => newYScale(d[HealthYAxis]));
  
    return circlesGroup;
  }
  
  function renderText(circlesGroupText, newXScale, PovXAxis, newYScale, HealthYAxis) {
    circlesGroupText.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[PovXAxis]))
      .attr("y", d => newYScale(d[HealthYAxis]));
    return circlesGroupText;
  }

  function updateToolTip(PovXAxis, HealthYAxis, circlesGroup, textGroup) {

    var xlabel;
    var ylabel;

    if (PovXAxis === "poverty") {
      var xlabel = "Poverty :";
    }
    else if (PovXAxis === "income") {
      var xlabel = "Income";
    }
    else {
      var xlabel = "Age:";
}
    if (HealthYAxis === "healthcare") {
      ylabel = "Healthcare"
  }
    else if (HealthYAxis === "obesity") {
      ylabel = "Obesity"
  }
    else {
      ylabel = "Smokes"
    }

    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      if (PovXAxis === "age") {
      return (`${d.abbr}<br>${ylabel}: ${d[HealthYAxis]}% <br>${xlabel} ${d[PovXAxis]}`);
    } else if (PovXAxis === "income") {
      return (`${d.abbr}<br>${ylabel}: ${d[HealthYAxis]}% <br>${xlabel} $${d[PovXAxis]}`);
    }
    else {
      return (`${d.abbr}<br>${ylabel}: ${d[HealthYAxis]}% <br>${xlabel} ${d[PovXAxis]}%`);
    }
  });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(Data) {
      toolTip.show(Data, this);
    })
      // onmouseout event
      .on("mouseout", function(Data) {
        toolTip.hide(Data);
      });
      textGroup
      .on("mouseover", function(Data) {
          toolTip.show(Data, this);
      })
      .on("mouseout", function(Data) {
          toolTip.hide(Data);
      });
    return circlesGroup;
  }


  d3.csv("assets/data/data.csv").then(function (Data, err) {
  console.log(Data);
  if (err) throw err;

  Data.forEach(function (data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;

    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.healthcare = +data.healthcare;
  });

  var xLinearScale = xScale(Data, PovXAxis);
  var yLinearScale = yScale(Data, HealthYAxis);


  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
    .data(Data).enter()

  var circles = circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d[PovXAxis]))
    .attr("cy", d => yLinearScale(d[HealthYAxis]))
    .attr("r", "15")
    .classed("stateCircle", true);


  var circlesText = circlesGroup.append("text")
    .attr("x", d => xLinearScale(d[PovXAxis]))
    .attr("y", d => yLinearScale(d[HealthYAxis]))
    .attr("dy", ".35em")
    .text(d => d.abbr)
    .classed("stateText", true);


  var circlesGroup = updateToolTip(PovXAxis, HealthYAxis, circles, circlesText);

  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty (%)");

  var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income (median)");

  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (median)");

  // Y labels

  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var healthcareLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(0)")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare")
    .classed("active", true)
    .text("Lacks HealthCare (%)");

  var smokesLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(0)")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "smokes")
    .classed("inactive", true)
    .text("Smokes (%)");

    var obesityLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(0)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "obesity")
    .classed("inactive", true)
    .text("Obesity (%)");

  xLabelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== PovXAxis) {

      //   // replaces PovXAxis with value
      PovXAxis = value;
      console.log(PovXAxis)

      // Update xLinearScale.
      xLinearScale = xScale(Data, PovXAxis);

      // Render xAxis.
      xAxis = renderXAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circles = renderCircles(circlesGroup, xLinearScale, PovXAxis, yLinearScale, HealthYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(PovXAxis, HealthYAxis, circles, circlesText);

      circlesText = renderText(circlesText, xLinearScale, PovXAxis, yLinearScale, HealthYAxis);

      // Switch active/inactive labels.
      // changes classes to change bold text
      if (PovXAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (PovXAxis === "income") {
        povertyLabel
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
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
    }
  });

  yLabelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== HealthYAxis) {

      //   // replaces HealthYAxis with value
        HealthYAxis = value;
        console.log(HealthYAxis)

      // //   // updates y scale for new data
        yLinearScale = yScale(Data, HealthYAxis);

      // //   // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);


      // updates circles with new y values
      circles = renderCircles(circlesGroup, xLinearScale, PovXAxis, yLinearScale, HealthYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(PovXAxis, HealthYAxis, circles, circlesText);

      circlesText = renderText(circlesText, xLinearScale, PovXAxis, yLinearScale, HealthYAxis);

      // changes classes to change bold text
      if (HealthYAxis === "healthcare") {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityLabel
        .classed("active", false)
        .classed("inactive", true);
      }
      else if (HealthYAxis === "obesity") {
        healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityLabel
        .classed("active", true)
        .classed("inactive", false);
      }
      else {
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);

      }

    }
    });

}).catch(function (error) {
  console.log(error);
});

