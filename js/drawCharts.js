/*
 * drawCharts.js
 *
 * by Justin Ratra
 */



// #######################
//   Bar Chart Functions 
// #######################

function DateToString(d) {
    return ((d.getMonth() + 1) + "/" + d.getFullYear());
}

function DateToString2(d) {
    return ((d.getMonth() + 1) + "/1/" + d.getFullYear());
}

function drawBarChart(barData, titles, width, height, selector) {
    var data = barData.data;
    var max = barData.max;
    var dateLabels = barData.dateLabels;
    var hospitalLabels = barData.hospitalLabels;
    var numHospitals = hospitalLabels.length;

    var tooltip = d3.select('body').append('div')
                                .attr('class', 'tooltip')
                                .style('opacity', 1e-6);

    var x0 = d3.scale.ordinal()
                       .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
			          .range([height, 0]);

    // Need to randomly generate colors based on number of hospitals
    // Also differentiate My Hospital vs others
    var color = d3.scale.ordinal()
	                      .range(randomColor({ count: numHospitals, hue: 'random', luminosity: 'bright' }));
    //var color = d3.interpolateRgb("#ffd", "#056");
    //var color = d3.scale.ordinal()
    //              .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var xAxis = d3.svg.axis()
			              .scale(x0)
			    	      .orient("bottom");

    var yAxis = d3.svg.axis()
			              .scale(y)
			    		  .orient("left");
    //.tickFormat(d3.format(".2s"));
    //.tickFormat(d3.format(function (d) { return d + "%"; }));

    var svg = d3.select(selector).append("svg")
			            .attr("width", width + margin.left + margin.right)
			    		.attr("height", height + margin.top + margin.bottom)
			    		.append("g")
			    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x0.domain(dateLabels);
    x1.domain(hospitalLabels).rangeRoundBands([0, x0.rangeBand()]);
    //y.domain([0, d3.max(data, function (d) { return d3.max(d.hospitals, function (d) { return d.value; }); })]);
    y.domain([0, max]);

    // draw x-axis
    svg.append("g")
    		    .attr("class", "x axis")
    		    .attr("transform", "translate(0," + height + ")")
    		    .call(xAxis)
                .append("text")
                .attr("x", width / 2)
                .attr('y', 30)
                .attr('dy', '.71em')
                .style('text-anchor', 'middle')
                .style('font-size', '14px')
                .text(titles.xAxis);

    // draw y-axis
    svg.append("g")
    		    .attr("class", "y axis")
    		    .call(yAxis)
    		    .append("text")
    		    .attr("transform", "rotate(-90)")
    		    .attr("y", "-50")
    		    .attr("x", -(height / 4))
    		    .attr("dy", ".71em")
    		    .style("text-anchor", "end")
    		    .style("font-size", "14px")
    		    .text(titles.yAxis);

    var state = svg.selectAll(".state")
    		    .data(data)
    		    .enter().append("g")
    		    .attr("class", "g")
    		    .attr("transform", function (d) { return "translate(" + x0(d.date) + ",0)"; });

    state.selectAll("rect")
	            .data(function (d) { return d.hospitals; })
    		    .enter().append("rect")
    		    .attr("width", x1.rangeBand())
	            .attr("x", function (d) { return x1(d.hid); })
	            .attr("y", function (d) { return y(d.ratio); })
	            .attr("height", function (d) { return height - y(d.ratio); })
	            .style("fill", function (d, i) { return color(i / (numHospitals - 1)); })
                .on("mouseover", function (d, i) {
                    $("div.tooltop").show();
                    tooltip.transition().duration(100).style("opacity", 1);
                }).on("mousemove", function (d, i) {
                    //var divHtml = '<h5>' + d['date'] + '</h5>';
                    var divHtml = '<strong>Date: </strong>' + d['date'] + '<br/>';
                    divHtml += '<strong>Hospital ID: </strong> ' + d['hid'] + '<br/>';
                    //divHtml += '<strong>Ratio: </strong> ' + (d['ratio'] * 100).toFixed(2) + '%' + '<br/>';
                    divHtml += '<strong>Ratio: </strong> ' + (d['ratio']).toFixed(2) + '%' + '<br/>';
                    divHtml += '<strong>Sample Size: </strong> ' + d['sample_size'];

                    if ($(window).width() - d3.event.pageX < 160) {
                        var left_position = (d3.event.pageX - 155) + "px";
                    } else {
                        var left_position = (d3.event.pageX - 2) + "px";
                    }
                    tooltip.html(divHtml).style("left", left_position).style("top", (d3.event.pageY - 80) + "px");
                }).on("mouseout", function (d, i) {
                    tooltip.transition().duration(100).style("opacity", 1e-6);
                });

    // draw title
    svg.append('text')
	            .attr("x", width / 2)
	            .attr("y", 0 - (margin.top / 2))
	            .attr("text-anchor", "middle")
	            .style("font-size", '18px')
	            .text(titles.chartTitle);

    var legend = svg.selectAll(".legend")
    		    .data(hospitalLabels.slice())
    		    .enter().append("g")
    		    .attr("class", "legend")
    		    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
    		    .attr("x", width - 18)
    		    .attr("width", 18)
    		    .attr("height", 18)
    		    .style("fill", color);

    legend.append("text")
    		    .attr("x", width - 24)
    		    .attr("y", 9)
    		    .attr("dy", ".35em")
    		    .style("text-anchor", "end")
    		    .text(function (d) { return d; });
}

// #######################
//   Run Chart Functions 
// #######################

function drawRunChart(dataObj, label, width, height, selector) {
    var data = dataObj.data;
    var avg = dataObj.avg;
    var min = dataObj.min;
    var max = dataObj.max;
    var avg_line_bool = dataObj.avg_line;
    var avg_single_data = [];
    var ucl = dataObj.ucl;
    var lcl = dataObj.lcl;
    var hids = dataObj.hids;
    
    //var X_DATA_PARSE = d3.time.format("%Y-%m-%d").parse;
    //var X_DATA_PARSE = d3.time.format("%B/%Y").parse;
    var X_DATA_PARSE = d3.time.format("%m/%d/%Y").parse;
    
    _.each(data, function (item) {
           _.each(item, function (o) {
                 o.date = X_DATA_PARSE(o.date);
           });
    });

    //var Y_DATA_PARSE = 0;

    // This is the key in the data object passed to draw function
    var X_AXIS_COLUMN = "date";

    // This is the key in the data object passed to draw function
    var Y_AXIS_COLUMN = "ratio";

    var x = d3.time.scale()
	     	             .range([0, width]);

    var y = d3.scale.linear()
	     	             .range([height, 0]);

    var xAxis = d3.svg.axis()
	     	                 .scale(x)
	     	   			     .orient("bottom");

    var yAxis = d3.svg.axis()
	     	                 .scale(y)
	     	   			     .orient("left");
    
    //var color = d3.scale.ordinal()
	//                      .range(randomColor({ count: data.length, hue: 'blue' }));
    var color = data.length;
    if (color == 1)
        color = d3.scale.ordinal().range(randomColor({ count: data.length, hue: 'blue' }));
    else if (color == 2)
        color = d3.scale.ordinal().range(["#ec7a08", "#2b39b5"]);
    else
        color = d3.scale.ordinal().range(randomColor({ count: data.length }));

    
    var svg = d3.select(selector).append("svg")
	     	                .attr("width", width + margin.left + margin.right)
	     	   	    		.attr("height", height + margin.top + margin.bottom)
	     	   				.append("g")
	     	   				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var line = d3.svg.line()
                 .interpolate("linear")
                 .x(function (d) { return x(d.date); })
                 .y(function (d) { return y(d.ratio); });
    

    var tooltip = d3.select('body').append('div')
                                .attr('class', 'tooltip')
                                .style('opacity', 1e-6);

    // Set X Domain
    x.domain([data[0][0].date, data[0][data[0].length-1].date]);

    // Set Y Domain (including Control Limits)
    var max = d3.max(data, function (d) { return (d3.max(d, function (d) { return d.ratio; })); });
    if (ucl > max) max = ucl;
    y.domain([0, max]);
    //y.domain(d3.extent(data, function (d) { return d.y_axis; }));     // Y-AXIS-Range = [Min, Max]
    //y.domain([0, d3.max(data, function (d) { return d.y_axis; })]);     // Y-AXIS-Range = [0, Max]
    
    // draw line(s)
    svg.selectAll(".run-line")
       .data(data)
       .enter().append("path")
       .attr("class", "line")
       .style("fill", "none")
       .style("stroke-width", "1.5px")
       .style("stroke", function (d, i) { return color(i / (data.length - 1)); })
       .attr("d", line);
    

    // draw x-axis
    svg.append("g")
	               .attr("class", "x axis")
	        	   .attr("transform", "translate(0," + height + ")")
	        	   .call(xAxis)
                   .append('text')
                   .attr('x', width / 2)
                   .attr('y', 30)
                   .attr('dy', '.71em')
                   .style('text-anchor', 'middle')
                   .style('font-size', '14px')
                   .text(label.xAxis);

    // draw y-axis
    svg.append("g")
	               .attr("class", "y axis")
	      		   .call(yAxis)
	               .append("text")
	               .attr("transform", "rotate(-90)")
	      		   .attr("y", "-50")
	      		   .attr("x", -(height / 4))
	      		   .attr("dy", ".71em")
	      		   .style("text-anchor", "end")
                   .style('font-size', '14px')
	      		   .text(label.yAxis);
    
    // Draw center line to indicate mean.
    svg.append("svg:line")
       .attr("x1", x(data[0][0].date))
       .attr("y1", y(avg))
       .attr("x2", x(data[0][data[0].length-1].date))
       .attr("y2", y(avg))
       .style("stroke", "rgba(0, 165, 46, 0.6)")
       .style("stroke-width", 2)
       .on("mouseover", function (d, i) {
           $('div.tooltip').show();
           tooltip.transition().duration(100).style("opacity", 1);
       }).on("mousemove", function () {
           var divHtml = '<h4>Mean Value</h4>';
               divHtml += avg.toFixed(2);
           var left_position = (d3.event.pageX - 2) + "px";
           tooltip.html(divHtml).style("left", left_position).style('top', (d3.event.pageY - 80) + "px");
       }).on("mouseout", function (d, i) {
           tooltip.transition().duration(100).style("opacity", 1e-6);
       });

    // draw data points on line
    for (var i = 0; i < data.length; i++) {
        //console.log("data i = ", data[i]);
        //console.log("data.length = ", data.length);
        
        svg.selectAll('.circle-' + i)
           .data(data[i])
           .enter()
           .append("circle")
           .attr("fill", function (d) { return ((d.ratio > ucl || d.ratio < lcl) ? "rgba(220, 55, 41, 0.8)" : color (i / (data.length-1)) ); })
           .attr("cx", function (d) { return x(d.date); })
           .attr("cy", function (d) { return y(d.ratio); })
           .attr("r", 3)
           .on("mouseover", function (d, i) {
               $("div.tooltip").show();
               tooltip.transition().duration(100).style("opacity", 1);
           }).on("mousemove", function (d, i) {
               //var divHtml = '<h5><strong>Date:</strong>&emsp;' + DateToString(d.date) + '</h5>';
               //divHtml += '<h5><strong>Value:</strong>&emsp;' + d.ratio.toFixed(2) + '%</h5>';
               var divHtml = '<strong>Date:</strong>&emsp;' + DateToString(d.date) + '<br/>';
                   divHtml += '<strong>Hospital ID: </strong> ' + d['hid'] + '<br/>';
                   divHtml += '<strong>Ratio: </strong> ' + (d['ratio']).toFixed(2) + '%' + '<br/>';
                   divHtml += '<strong>Sample Size: </strong> ' + d['sample_size'];

               if ($(window).width() - d3.event.pageX < 160) {
                   var left_position = (d3.event.pageX - 155) + "px";
               } else {
                   var left_position = (d3.event.pageX - 2) + "px";
               }
               tooltip.html(divHtml).style("left", left_position).style("top", (d3.event.pageY - 80) + "px");
           }).on("mouseout", function (d, i) {
                 tooltip.transition().duration(100).style("opacity", 1e-6);
           });
    }

    // upper limit line
    svg.append("line")
	               .attr("class", "limit-line")
	    		   .attr({ x1: 0, y1: y(ucl), x2: width, y2: y(ucl) });
    svg.append("text")
	               .attr({ x: width + 5, y: y(ucl) + 4 })
	    		   .text("Upper Limit: " + ucl.toFixed(2));

    // lower limit line
    svg.append("line")
	               .attr("class", "limit-line")
	    		   .attr({ x1: 0, y1: y(lcl), x2: width, y2: y(lcl) });
    svg.append("text")
	               .attr({ x: width + 5, y: y(lcl) + 4 })
	    		   .text("Lower Limit: " + lcl.toFixed(2));

    // draw title
    svg.append('text')
	                    .attr("x", width / 2)
	                    .attr("y", 0 - (margin.top / 2))
	                    .attr("text-anchor", "middle")
	                    .style("font-size", '18px')
	                    .text(label.chartTitle);
    
    if (data.length >= 2) {
        var legend = svg;
        
        if (data.length > 2) {
            legend = svg.selectAll(".legend")
    	    		    .data(hids)
    	    		    .enter().append("g")
    	    		    .attr("class", "legend")
    	    		    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });
            
            legend.append("rect")
    	    		    .attr("x", width - 18)
    	    		    .attr("y", 11)
    	    		    .attr("width", 18)
    	    		    .attr("height", 18)
            .style("fill", function (d, i) { console.log("color(i / (hids.length - 1))"); return color(i / (hids.length - 1)); });
                        //.style("fill", color(i / (data.length - 1)));
    	    		    //.style("fill", ["#4682b4", "#dc1e50"]);
    	    		    //.style("fill", ["rgba(70, 130, 180, 1.0)", "rgba(220, 30, 80, 0.4)"]);
        } else {
            legend = svg.selectAll(".legend")
    	    		    .data(["My Hospital", "All Hospital's Average"])
    	    		    .enter().append("g")
    	    		    .attr("class", "legend")
    	    		    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });
            
            legend.append("rect")
    	    		    .attr("x", width - 18)
    	    		    .attr("y", 11)
    	    		    .attr("width", 18)
    	    		    .attr("height", 18)
                        .style("fill", color);
    	    		    //.style("fill", ["#4682b4", "#dc1e50"]);
    	    		    //.style("fill", ["rgba(70, 130, 180, 1.0)", "rgba(220, 30, 80, 0.4)"]);
        }

        legend.append("text")
                    //.attr("x", width - 24)
                    // Translation Formula = y = 1.0982x + 4.1833
    			    .attr("x", function (d) { return (width + ($("#hidden-span").text(d).width() * 1.0982 + 4.1833)) })
    			    .attr("y", 20)
    			    .attr("dy", ".35em")
    			    .style("text-anchor", "end")
    			    .text(function (d) { return d; });
    }

    $(selector + " g.x g.tick text").map(function () {
        // translation formula 1:
        // y = 0.4932x + 11.422
        // translation formula 2:
        // y = 0.3961x + 14.865
        var text = $("#hidden-span").text($(this).text());

        var translation = text.width() * 0.4932 + 11.422;
        //var translation = text.width() * 0.3961 + 14.865;
        $(this).attr("transform", "rotate(-90), translate(" + "-" + translation + ", -14)");
        return;
    });
}

// #######################
//    Box Plot Functions
// #######################

// Function to Calculate Error Bars for Box and Whisker Plot
function iqr(k) {
    return function (d, i) {
        var q1 = d.quartiles[0];
        var q3 = d.quartiles[2];
        var iqr = (q3 - q1) * k;
        var i = -1;
        var j = d.length;

        while (d[++i] < q1 - iqr);
        while (d[--j] > q3 + iqr);
        return [i, j];
    }
}

function drawBoxPlot(boxData, title, width, height, selector) {
    var data = boxData.data;
    var min = boxData.min;
    var max = boxData.max;

    var labels = true;

    var chart = d3.box()
                  .whiskers(iqr(1.5))
        	      .height(height)
        		  .domain([0, max])
        		  .showLabels(labels);

    var svg = d3.select(selector)
                .append("svg")
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .attr('class', 'box')
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3.scale.ordinal()
                    .domain(data.map(function (d) { return d[0] }))
                    .rangeRoundBands([0, width], 0.7, 0.3);

    var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient('bottom')

    var y = d3.scale.linear()
                    .domain([0, max])
                    .range([height + margin.top, 0 + margin.top]);

    var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient('left');

    // draw box plots
    svg.selectAll('.box')
            .data(data)
            .enter()
            .append('g')
            .attr("transform", function (d) { return "translate(" + x(d[0]) + "," + margin.top + ")"; })
            .call(chart.width(x.rangeBand()));

    // draw title
    svg.append('text')
            .attr("x", width / 2)
            .attr("y", 0 + (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", '18px')
            .text(title.chartTitle);

    // draw y-axis
    svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -50)
            .attr('x', -(height / 4))
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .style('font-size', '14px')
            .text(title.yAxis);

    // draw x-axis
    svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + (height + margin.top + 15) + ')')
            .call(xAxis)
            .append('text')
            .attr('x', width / 2)
            .attr('y', 85)
            .attr('dy', '.71em')
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .text(title.xAxis);


    //$(selector + " g.x g.tick text").map(function () {
    $("g.x g.tick text").map(function () {
        // translation formula 1:
        // y = 0.4932x + 11.422
        // translation formula 2:
        // y = 0.3961x + 14.865
        var text = $("#hidden-span").text($(this).text());

        //var translation = text.width() * 0.4932 + 11.422;
        var translation = text.width() * 0.3961 + 14.865;
        $(this).attr("transform", "rotate(90), translate(" + translation + ", -14)");
        return;
    });

    //var chartHeight = $chartDiv.height();
    //$body.height(bodyHeight + (chartHeight / 2));
}

// #######################
//  Funnel Plot Functions
// #######################

//  --- Sorts dataset by population size
function compare(a, b) {
    if (a.sample_size < b.sample_size)
        return -1;
    if (a.sample_size > b.sample_size)
        return 1;
    return 0;
}

// Sort By Multiple Attributes helper functions
function dynamicSort(property) {
    return function (obj1, obj2) {
        return obj1[property] > obj2[property] ? 1
                        : obj1[property] < obj2[property] ? -1 : 0;
    }
}

function dynamicSortMultiple(props) {
    return function (obj1, obj2) {
        var i = 0, result = 0, numProps = props.length;

        while (result === 0 && i < numProps) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

function drawFunnelPlot(data, title, width, height, selector) {
    var dataset = data.data;
    var sorted_names = data.names;
    var mean_incidence_rate = data.rate;

    var padding = 30;

    var svg = d3.select(selector).append("svg")
            	            .attr("width", width)
            	            .attr("height", height)
    var tooltip = d3.select('body').append('div')
            	            .attr('class', 'tooltip')
            	            .style('opacity', 1e-6);
    var max_x = d3.max(dataset, function (d) {
        return d['sample_size'];
    });
    var min_x = d3.min(dataset, function (d) {
        return d['sample_size'];
    });

    // Create scale functions
    var xScale = d3.scale.linear()
            	               .domain([0, max_x])
            	               .range([padding, width - padding * 2]);
    var yScale = d3.scale.linear()
            	               .domain([0, d3.max(dataset, function (d) { return d3.max([d['ratio'], d['plus_3sd']]); })])
            	               .range([height - padding, padding]);

    // Set up axes format
    var formatAsPercentage = d3.format("%");
    var xAxis = d3.svg.axis()
            	  .scale(xScale)
            	  .orient("bottom")
            	  .ticks(5)
            	  .tickSize(4, 0, 0);
    var yAxis = d3.svg.axis()
            	  .scale(yScale)
            	  .orient("left")
            	  .ticks(5)
            	  .tickSize(4, 0, 0)
            	  .tickFormat(formatAsPercentage);

    // draw x-axis
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0," + (height - padding) + ")")
       .call(xAxis)
       .append('text')
       .attr('x', width / 2)
       .attr('y', 30)
       .attr('dy', '.71em')
       .style('text-anchor', 'middle')
       .style('font-size', '14px')
       .text(title.xAxis);

    // draw y-axis
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + padding + ", 0)")
       .call(yAxis)
       .append('text')
       .attr('transform', 'rotate(-90)')
       .attr('y', '-50')
       .attr('x', -(height / 4))
       .attr('dy', '.71em')
       .style('text-anchor', 'end')
       .style('font-size', '14px')
       .text(title.yAxis);

    // draw title
    svg.append('text')
	   .attr("x", width / 2)
	   .attr("y", 0 + (margin.top / 2))
	   .attr("text-anchor", "middle")
	   .style("font-size", '18px')
	   .text(title.chartTitle);


    // Draw Confidence Intervals
    var confidence3sd_lower = d3.svg.line()
            	                .x(function (d) { return xScale(d['sample_size']); })
            	                .y(function (d) {
            	                    if (d['minus_3sd'] < 0.0) {
            	                        return yScale(0);
            	                    } else {
            	                        return yScale(d['minus_3sd']);
            	                    }
            	                })
            	                .interpolate("linear");
    var confidence3sd_upper = d3.svg.line()
            	                .x(function (d) {
            	                    return xScale(d['sample_size']);
            	                })
            	                .y(function (d) {
            	                    return yScale(d['plus_3sd']);
            	                })
            	                .interpolate("linear");
    var confidence2sd_lower = d3.svg.line()
            	                .x(function (d) {
            	                    return xScale(d['sample_size']);
            	                })
            	                .y(function (d) {
            	                    if (d['minus_2sd'] < 0.0) {
            	                        return yScale(0);
            	                    } else {
            	                        return yScale(d['minus_2sd']);
            	                    }
            	                })
            	                .interpolate("linear");
    var confidence2sd_upper = d3.svg.line()
            	                .x(function (d) {
            	                    return xScale(d['sample_size']);
            	                })
            	                .y(function (d) {
            	                    return yScale(d['plus_2sd']);
            	                })
            	                .interpolate("linear");
    svg.append("svg:path")
       .attr("d", confidence2sd_upper(dataset))
       .attr("class", "confidence95");
    svg.append("svg:path")
       .attr("d", confidence2sd_lower(dataset))
       .attr("class", "confidence95");
    svg.append("svg:path")
       .attr("d", confidence3sd_upper(dataset))
       .attr("class", "confidence99");
    svg.append("svg:path")
       .attr("d", confidence3sd_lower(dataset))
       .attr("class", "confidence99");

    // Draw center line to indicate mean.
    svg.append("svg:line")
       .attr("x1", xScale(min_x))
       .attr("y1", yScale(mean_incidence_rate))
       .attr("x2", xScale(max_x))
       .attr("y2", yScale(mean_incidence_rate))
       .style("stroke", "rgba(6, 120, 155, 0.6)")
       .style("stroke-width", 2)
       .on("mouseover", function (d, i) {
           $('div.tooltip').show();
           tooltip.transition().duration(100).style("opacity", 1);
       }).on("mousemove", function () {
           var divHtml = '<h4>Mean Value</h4>';
               divHtml += (mean_incidence_rate * 100).toFixed(2) + '%';
           var left_position = (d3.event.pageX - 2) + "px";
           tooltip.html(divHtml).style("left", left_position).style('top', (d3.event.pageY - 80) + "px");
       }).on("mouseout", function (d, i) {
           tooltip.transition().duration(100).style("opacity", 1e-6);
       });

    // Create Circles
    svg.selectAll("circle")
       .data(dataset)
       .enter()
       .append("circle")
       //.attr("fill", function (d) { return (d['hid'] == global_hid ? "rgba(236, 122, 8, 0.75)" : "rgba(22, 68, 81, 0.6)"); })
       .attr("fill", function (d) {
             var val = d['ratio'];
             if (d['hid'] == global_hid) return "rgba(236, 122, 8, 0.75)";
             else if (val > d['plus_3sd'] || val < d['minus_3sd']) return "rgba(255, 0, 0, 0.75)";
             else if (val > d['plus_2sd'] || val < d['minus_2sd']) return "rgba(205, 0, 0, 0.75)";
             else return "rgba(22, 68, 81, 0.6)";
       })
       .attr("cx", function (d) {
           return xScale(d['sample_size']);
       })
       .attr("cy", function (d) {
           return yScale(d['ratio']);
       })
       .attr("name", function (d) {
           return $.inArray(d['hid'], sorted_names);
       })
       .attr("r", 5)
       .on("mouseover", function (d, i) {
           $("div.tooltip").show();
           tooltip.transition().duration(100).style("opacity", 1);
       }).on("mousemove", function (d, i) {
           var divHtml = '<strong>Hospital ID: ' + d['hid'] + '</strong><br/>';
           //divHtml += '<strong>Incidences: </strong> ' + d['indicator'] + '<br/>';
           //divHtml += '<strong>Population: </strong> ' + d['sample_size'] + '<br/>';
           //divHtml += '<strong>Percentage: </strong> ' + (d['ratio'] * 100).toFixed(2) + '%';
           divHtml += 'Incidences: ' + d['indicator'] + '<br/>';
           divHtml += 'Population: ' + d['sample_size'] + '<br/>';
           divHtml += 'Percentage: ' + (d['ratio'] * 100).toFixed(2) + '%';

           if ($(window).width() - d3.event.pageX < 160) {
               var left_position = (d3.event.pageX - 155) + "px";
           } else {
               var left_position = (d3.event.pageX - 2) + "px";
           }
           tooltip.html(divHtml).style("left", left_position).style("top", (d3.event.pageY - 80) + "px");
       }).on("mouseout", function (d, i) {
           tooltip.transition().duration(100).style("opacity", 1e-6);
       });
}

function customizeCSVData(chartData, Y_COL, X_COL, HID_COL, START_DATE, END_DATE) {
    // Returns data object formatted for SPC chart 
    //      depending on chartType value
    // 
    // chartType 
    //  1 = Run Chart                   Y_COL = number?
    //  2 = Box and Whisker Plot
    //  3 = Funnel Plot                 Y_COL = "Yes" / "No", add functionality for "Checked" / "Unchecked"
    //  4 = Bar Chart
    //
    var chartType = chartData.chartType;
    var byMonth = chartData.byMonth;
    var indicatorVal = chartData.indicator;

    // Handle Run Chart with multiple lines
    var avg_line = false;
    if (typeof HID_COL !== 'number') {
        HID_COL = HID_COL[0];
        avg_line = true;
    }

    if (chartType == 1) {           // Draw Run Chart
        var dataset = [];
        
        var hids = chartData.hids;

        var avg_count = 0;
        var avg_sum = 0;
        var variance_sum = 0;
        
        var min = Infinity;
        var max = -Infinity;
        
        // Need to get each month (and possibly year) between START_DATE and END_DATE
        var startMonth = START_DATE.getMonth() + 1;
        var startYear = START_DATE.getFullYear();
        var endMonth = END_DATE.getMonth() + 1;
        var endYear = END_DATE.getFullYear();
        var dateLabels = [];
        var jsDateLabels = [];
        

        for (startYear; startYear <= endYear; startYear++) {
            if (byMonth) {
                if (startYear < endYear) {
                    for (startMonth; startMonth <= 12; startMonth++) {
                        //var dateStr = startMonth + "/" + startYear;
                        var dateStr = startMonth + "/1/" + startYear;
                        dateLabels.push(dateStr);
                        var dateJs = new Date(startMonth + "/1/" + startYear);
                        jsDateLabels.push(dateJs);
                    }
                    startMonth = 1;
                } else if (startYear == endYear) {
                    for (startMonth; startMonth <= endMonth; startMonth++) {
                        //var dateStr = startMonth + "/" + startYear;
                        var dateStr = startMonth + "/1/" + startYear;
                        dateLabels.push(dateStr);
                        var dateJs = new Date(startMonth + "/1/" + startYear);
                        jsDateLabels.push(dateJs);
                    }
                } else { }
            } else {
                //var dateStr = startYear;
                var dateStr = "1/1/" + startYear;
                dateLabels.push(dateStr);
                var dateJs = new Date("1/1/" + startYear);
                jsDateLabels.push(dateJs);
            }
        }
        
        _.each(hids, function (hid) {
               var arr = [];
               _.each(dateLabels, function (date) {
                    arr.push({ date: date, hid: hid, sample_size: 0, indicator: 0, ratio: 0, vals: [] });
               });
               dataset.push(arr);
        });
        
        //console.log("dataset = ", dataset);

        _.each(csvArray, function (item, i) {

            // Get Y-Axis indicator
            //var val = parseInt(item[Y_COL]);  -This assumes item[Y_COL] (y-axis) = number (not "Yes" or "Checked")
            var val = item[Y_COL];

            // Get Date
            // This assumes item[X_COL] (x-axis) = datetime    (YYYY-MM-DD)
            var dte = item[X_COL];
            var jsDte = new Date(item[X_COL]);
            var dteStr = DateToString2(jsDte);
            var dateIndex = $.inArray(dteStr, dateLabels);
            //var dateIndex = _.findIndex(dataset, { date: dteStr });
            //var dateIndex = -1;
            //dateIndex = $.map(dataset, function (obj, index) { if (obj.date == dteStr) return index; });
            //dateIndex = _.each(dataset, function (item, i) { if (item.date == dteStr) return i; });
               //console.log("dateIndex = ", dateIndex);

            // Get Hospital ID
            var hid = item[HID_COL];
            var hospIndex = $.inArray(parseInt(hid), hids);
            //var hospIndex = _.findIndex(allHids, hid);
            //var hospIndex = -1;
            //hospIndex = $.map(allHids, function (item, index) { if (item == hid) return index; });
            //hospIndex = _.each(allHids, function (item, i) { if(item == hid) return i; });

            // if jsDte is between START_DATE and END_DATE
            //    AND ((hid matches Global Hospital ID) OR (drawing avg line))
            if ((dateIndex !== -1) && (jsDte > START_DATE) && (jsDte < END_DATE) && (hid == global_hid || avg_line) && (val !== '') && (typeof val !== "undefined") && (jsDte !== '') && (typeof jsDte !== "undefined")) {
               
               //console.log("val = ", val);
               //console.log("indicatorVal = ", indicatorVal);
               
               if (typeof indicatorVal === "number") {
                    var num = parseInt(val);
               
                    if (hospIndex !== -1) {
                        dataset[hospIndex][dateIndex].vals.push(num);
                    }
               
                    if (avg_line) {
                        dataset[hids.length-1][dateIndex].sample_size++;
                        dataset[hids.length-1][dateIndex].vals.push(num);
                    }
               
                    avg_sum += num;              // get total sum
                    avg_count++;
                    if (num > max) max = num;    // get maximum value
                    if (num < min) min = num;    // get minimum value
               } else {
                    if (hospIndex !== -1) {
                        dataset[hospIndex][dateIndex].sample_size++;
               
                        if (val == indicatorVal) {
                            dataset[hospIndex][dateIndex].indicator++;
                        }
                    }
               
                    dataset[hids.length-1][dateIndex].sample_size++;
                    avg_count++;
               
                    if (val == indicatorVal) {
                        dataset[hids.length-1][dateIndex].indicator++;
                        avg_sum++;
                    }
               }

            }
        });

        var avg = avg_sum / avg_count;

        if (typeof indicatorVal === "number") {
            _.each(dataset, function (hidData) {
                  var sum = 0;
                  var items = [];
                  _.each(hidData, function (o) {
                        var current_sum = 0;
                        var size = o.vals.length;
                         
                        _.each(o.vals, function (item) {
                            variance_sum += ((item - avg) * (item - avg));
                            current_sum += item;
                            
                            sum += item;
                            items.push(item);
                        });
                        
                         o.sample_size = size;
                         
                        if (size > 0)
                            o.ratio = current_sum / size;
                        else
                            o.ratio = 0;
                  });
                   /*
                  if (hids.length > 1)
                  {
                   console.log("obj = ", obj);
                       dataset.push({ date: obj.hospitals[0].date, hid: 0, vals: items, ratio: sum / items.length, indicator: 0, sample_size: 0 });
                  }
                   */
            });
        } else {
            avg = avg * 100;
            
            _.each(dataset, function (hidData) {
                   _.each(hidData, function (o) {
                        if (o.hid !== 0) {
                            if (o.sample_size == 0)
                                o.ratio = 0;
                            else
                                o.ratio = (o.indicator / o.sample_size) * 100;
                   
                            variance_sum += ((o.ratio - avg) * (o.ratio - avg));
                        } else {
                            if (o.sample_size == 0)
                                o.ratio = 0;
                            else
                                o.ratio = (o.indicator / o.sample_size) * 100;
                        }
                   });
           });
        }

        var variance = variance_sum / avg_count;

        var stdev = Math.sqrt(variance);

        var ucl = avg + (3 * stdev);
        var lcl = avg - (3 * stdev);
        if (lcl < 0) lcl = 0;       // assumes lcl cannot be negative

        // Sort data by date
        console.log("run chart dataset = ", dataset);
        //dataset = _.sortBy(dataset, function (o) { var dt = new Date(o.date); return dt; });

        return { data: dataset, avg: avg, ucl: ucl, lcl: lcl, avg_line: avg_line, max: max, min: min, hids: hids  };

    } else if (chartType == 2) {    // Draw Box Plot 
        var dataset = [];

        _.each(X_COL, function (item, i) {
            // Create X-Axis Label
            var labelText = $("#xDataDrop2").find("option[value='" + item + "']").text();
            var labelTextArr = labelText.split(/\(choice=(.*)\)/);
            labelText = labelTextArr[1];

            // Format dataset
            dataset[i] = [];
            dataset[i][0] = labelText;
            dataset[i][1] = [];
        });

        var max = -Infinity;
        var min = Infinity;

        // format data
        _.each(csvArray, function (item, i) {
            var num = parseInt(item[Y_COL]);
            var hid = item[HID_COL];

            if ((num !== '') && (typeof num !== "undefined") && (hid == global_hid)) {
                _.each(X_COL, function (header, i) {
                    if (item[header] == "Checked") {        // Assumes item[header] always = "Checked" / "Unchecked"
                        dataset[i][1].push(num);
                        if (num > max) max = num;
                        if (num < min) min = num;
                    }
                });
            }
        });
        //console.log("dataset = ", dataset);

        return { data: dataset, min: min, max: max };
    } else if (chartType == 3) {	// Draw Funnel Plot 
        var funnelData = [];

        var indicatorVal = chartData.indicator;
        var total_population = 0;
        var incidence_population = 0;
        var sample_size = 0;
        var incidences = 0;

        var jsFirstDate = new Date(csvArray[0][X_COL]);
        var firstDate = (jsFirstDate.getMonth() + 1) + "/" + jsFirstDate.getFullYear();
        
        _.each(allHids, function(item) {
               funnelData.push({ hid: item, sample_size: 0, indicator: 0, ratio: 0 });
        });

        //funnelData[0] = { sample_size: 0, indicator: 0, date: firstDate, ratio: 0 };

        _.each(csvArray, function (item, i) {
            var jsDate = new Date(item[X_COL]);
            var dte = (jsDate.getMonth() + 1) + "/" + jsDate.getFullYear();
            var indicator = item[Y_COL];
            var size = funnelData.length;
            var hid = item[HID_COL];
               
            var hidIndex = $.inArray(hid, allHids);

            if ((hidIndex !== -1) && (indicator !== '') && (typeof indicator !== "undefined") && (jsDate !== '') && (typeof jsDate !== "undefined")) {
               
                    funnelData[hidIndex].sample_size++;
                    //if (indicator == "Yes") {       // Assumes Indicator is always Yes/No
                    if (indicator == indicatorVal) {       // Assumes Indicator is always Yes/No
                        funnelData[hidIndex].indicator++;
                        incidence_population++;
                    }
               
                    total_population++;
            }
        });

        _.each(funnelData, function (item) {
               if (item.sample_size !== 0)
                    item.ratio = item.indicator / item.sample_size;
               else
                    item.ratio = 0;
        });

        // Calculate mean incidence over entire population
        var mean_incidence_rate = incidence_population / total_population;
        var mean_incidence = incidence_population / funnelData.length;

        var sigma_squared = mean_incidence_rate * (1 - mean_incidence_rate);

        // Create Sorted List of Labels
        var sorted_names = [];
        _.each(funnelData, function (item) {
            sorted_names.push(item["hid"]);
        });

        // Sorts dataset by population size for drawing confidence intervals
        funnelData.sort(compare);

        // Calculate standard error for each value: SE = SD / sqrt(n)
        //  ---Creating Control Limits/Confidence Intervals
        _.each(funnelData, function (item) {
            item['std_error'] = Math.sqrt(sigma_squared / item['sample_size']);
            item['plus_2sd'] = mean_incidence_rate + (2 * item['std_error']);
            item['minus_2sd'] = mean_incidence_rate - (2 * item['std_error']);
            item['plus_3sd'] = mean_incidence_rate + (3 * item['std_error']);
            item['minus_3sd'] = mean_incidence_rate - (3 * item['std_error']);
        });
        
        //console.log("funnelData = ", funnelData);

        return { data: funnelData, names: sorted_names, rate: mean_incidence_rate };
    } else if (chartType == 4) {    // Draw Bar Chart
        var barData = [];

        var byMonth = true;

        // Get Date Range from User Input
        /*
        var startDateText = $("#startDateText").val();
        var endDateText = $("#endDateText").val();
        var byMonth = true;

        if ($("#yearRadio:checked").length > 0)
            byMonth = false;

        //var START_DATE = new Date("2011-01-01");      // Date Range
        //var END_DATE = new Date("2015-12-31");      // Date Range
        var START_DATE = new Date(startDateText);      // Date Range
        var END_DATE = new Date(endDateText);      // Date Range
        */

        var idLabels = [];
        var dateLabels = [];

        // Need to get each month (and possibly year) between START_DATE and END_DATE
        var startMonth = START_DATE.getMonth() + 1;
        var startYear = START_DATE.getFullYear();
        var endMonth = END_DATE.getMonth() + 1;
        var endYear = END_DATE.getFullYear();

        for (startYear; startYear <= endYear; startYear++) {
            if (byMonth) {
                if (startYear < endYear) {
                    for (startMonth; startMonth <= 12; startMonth++) {
                        var dateStr = startMonth + "/" + startYear;
                        dateLabels.push(dateStr);

                        barData.push({ date: dateStr, hospitals: [] });
                    }
                    startMonth = 1;
                } else if (startYear == endYear) {
                    for (startMonth; startMonth <= endMonth; startMonth++) {
                        var dateStr = startMonth + "/" + startYear;
                        dateLabels.push(dateStr);

                        barData.push({ date: dateStr, hospitals: [] });
                    }
                } else { }
            } else {
                var dateStr = startYear;
                dateLabels.push(dateStr);
                barData.push({ date: dateStr, hospitals: [] });
            }
        }

        _.each(csvArray, function (item, i) {
            var item_date = new Date(item[X_COL]);
            var item_id = item[HID_COL];

            if (item_date > START_DATE && item_date < END_DATE && typeof item_id !== "undefined" && item_id !== '') {
                if (byMonth)
                    item_date = DateToString(item_date);
                else
                    item_date = item_date.getFullYear();

                var newId = $.inArray(item_id, idLabels);
                if (newId == -1) {
                    idLabels.push(item_id);

                    for (var i = 0; i < dateLabels.length; i++) {
                        barData[i].hospitals.push({
                            hid: item_id,
                            date: dateLabels[i],
                            indicator: 0,
                            sample_size: 0,
                            ratio: 0
                        });
                    }
                }

                var newDate = $.inArray(item_date, dateLabels);
                newId = $.inArray(item_id, idLabels);

                if (newDate !== -1 && newId !== -1) {
                    barData[newDate].hospitals[newId].sample_size++;
                    if (item[Y_COL] == "Yes") barData[newDate].hospitals[newId].indicator++;
                }
            }
        });

        var maxRatio = 0;

        _.each(barData, function (item) {
            var hospItems = item.hospitals;

            for (var i = 0; i < idLabels.length; i++) {
                if (hospItems[i].sample_size !== 0) {
                    var ratio = (hospItems[i].indicator / hospItems[i].sample_size) * 100;
                    hospItems[i].ratio = ratio;

                    if (ratio > maxRatio) maxRatio = ratio;
                }
            }
        });

        //console.log("idLabels = ", idLabels);
        //console.log("dateLabels = ", dateLabels);
        //console.log("barData = ", barData);

        return { data: barData, max: maxRatio, dateLabels: dateLabels, hospitalLabels: idLabels };
    }
}