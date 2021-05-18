d3.csv("./data/data.csv").then(function(Data) {

    console.log(Data);

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 120,
    left: 100
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Let's make a space for our chart.

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var PovXAxis = "poverty";
var chosenYAxis = "healthcare";

// This time we're updating x-scale and xAxis var.

function xScale(Data, PovXAxis) {
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(Data, d => d[PovXAxis]) * 0.8,
      d3.max(Data, d => d[PovXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  }
  
  function yScale(Data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(Data, d => d[chosenYAxis]) * 0.7,
      d3.max(Data, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  }

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

  function renderCircles(circlesGroup, newXScale, PovXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[PovXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }
  
  function renderText(circlesGroupText, newXScale, PovXAxis, newYScale, chosenYAxis) {
    circlesGroupText.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[PovXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
    return circlesGroupText;
  }

  function updateToolTip(PovXAxis, chosenYAxis, circlesGroup, textGroup) {

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
    if (chosenYAxis === "healthcare") {
      ylabel = "Healthcare"
  }
    else if (chosenYAxis === "obesity") {
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
      return (`${d.abbr}<br>${ylabel}: ${d[chosenYAxis]}% <br>${xlabel} ${d[PovXAxis]}`);
    } else if (PovXAxis === "income") {
      return (`${d.abbr}<br>${ylabel}: ${d[chosenYAxis]}% <br>${xlabel} $${d[PovXAxis]}`);
    }
    else {
      return (`${d.abbr}<br>${ylabel}: ${d[chosenYAxis]}% <br>${xlabel} ${d[PovXAxis]}%`);
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
  var yLinearScale = yScale(Data, chosenYAxis);


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
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "15")
    .classed("stateCircle", true);


  var circlesText = circlesGroup.append("text")
    .attr("x", d => xLinearScale(d[PovXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("dy", ".35em")
    .text(d => d.abbr)
    .classed("stateText", true);


  var circlesGroup = updateToolTip(PovXAxis, chosenYAxis, circles, circlesText);

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
      circles = renderCircles(circlesGroup, xLinearScale, PovXAxis, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(PovXAxis, chosenYAxis, circles, circlesText);

      circlesText = renderText(circlesText, xLinearScale, PovXAxis, yLinearScale, chosenYAxis);

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
      if (value !== chosenYAxis) {

      //   // replaces chosenYAxis with value
        chosenYAxis = value;
        console.log(chosenYAxis)

      // //   // updates y scale for new data
        yLinearScale = yScale(Data, chosenYAxis);

      // //   // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);


      // updates circles with new y values
      circles = renderCircles(circlesGroup, xLinearScale, PovXAxis, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(PovXAxis, chosenYAxis, circles, circlesText);

      circlesText = renderText(circlesText, xLinearScale, PovXAxis, yLinearScale, chosenYAxis);

      // changes classes to change bold text
      if (chosenYAxis === "healthcare") {
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
      else if (chosenYAxis === "obesity") {
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
});

