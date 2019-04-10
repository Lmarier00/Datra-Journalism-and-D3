// Scatter plot that represents the relationships between poverty and obesity
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var padding = 25;
var formatPercent = d3.format('.2%');

// Select chart (from d3Style), append SVG area to it, and set the dimensions
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)
  .append ("g")
  .attr("transform","translate(" + margin.right + ", " + margin.top + ")");//append group to SVG and shift right and to the bottom

var chart = svg.append("g")      
    
// Append a div to the body to create tooltips, assign it a class
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);   
    
// Load data from .csv file
d3.csv("../assets/data/healthData.csv", function(error, healthData) {
    for (var i = 0; i < healthData.length; i++) {
        console.log(healthData[i].abbr)
    }

    if (error) throw error;
        healthData.forEach(function(d) {

    // parse data and cast numeric fields
    
        d.poverty = +d.poverty;
        d.obesity = +d.obesity;
    });

    // Scale the range of the data
    var x = d3.scaleLinear().range([0, width]);

    // Create a linear scale, with a range between the Height and 0.
    var y= d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);



    var xValue = function(d) { return x(d.poverty);};
    var yValue = function(d) { return y(d.obesity);};


    function findMinAndMax(i) {
        xMin = d3.min(healthData, function(d) {
            return +d[i] * 0.9;
        });

        xMax =  d3.max(healthData, function(d) {
            return +d[i] * 1.0;
        });

        yMax = d3.max(healthData, function(d) {
            return +d.obesity * 1.1
        });
    };
    
    var currentAxisXLabel = "poverty";

    // Call findMinAndMax() with 'poverty' as default
    findMinAndMax(currentAxisXLabel);

    // Set the domain of an axis to extend from the min to the max value of the data column
    xScale=x.domain([xMin, xMax]);
    yScale=y.domain([0, yMax]);
      
    // Add the scatterplot
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .html(function(d) {
            var stname = d.state;
            var abbr = d.abbr;
            var poverty = +d.poverty;
            var obesity = +d.obesity;
            return (d.state + "<br> In Poverty: " + poverty + "%<br> Obesity: " + obesity + "%");
        });

    chart.call(toolTip);
                


    // Circles
    circles = chart.selectAll('circle')
        .data(healthData)
        .enter().append('circle')
        .attr("class", "circle")
        .attr("cx", function(d, index) {
            return x(+d[currentAxisXLabel]);
        })
        .attr("cy", function(d, index) {
            return y(d.obesity);
        })   
        .attr('r','25')
        .attr('stroke','black')
        .attr('stroke-width',1)
        .style('fill', "lightblue")
        .attr("class", "circleText")
        // add listeners on text too since it is on top of circle
            .on("mouseover", function(d) {
                toolTip.show(d);
        })
        // onmouseout event
            .on("mouseout", function(d, index) {
                toolTip.hide(d);
        });              
     
  
    // Add Text Labels to appear within the circles - state abbreviatons
    texts = chart.selectAll('text')
        .data(healthData)
        .enter().append('text')
        .attr("x", function(d, index) {
            return x(+d[currentAxisXLabel]);
        })
        .attr("y", function(d, index) {
            return y(d.obesity);
        })
        .text(function(d){
            return d.abbr})
        .attr("text-anchor", "middle")
        .attr('alignment-baseline', 'middle')
        .attr('fill', 'dark-blue')
        .attr('font-size', 20);

    // X-AXIS
    chart.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);
    
    //Label for X-AXIS       
    chart.append("text")
       .attr("class", "label")
       .attr("transform", "translate(" + (width / 2) + " ," + (height - margin.top+ 60) + ")")
       .style("text-anchor", "middle")
       .attr('font-size', 20)
       .text('In Poverty (%) ');

    // Y-axis
    yAxis = d3.axisLeft(y);
            
    chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);       
                
   //Label for Y-AXIS   
  chart.append("text")
       .attr("class", "label")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - (margin.left + 4))
       .attr("x", 0 - (height/ 2))
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .attr('font-size', 22)
       .text('Obesity (%)');
});

  

