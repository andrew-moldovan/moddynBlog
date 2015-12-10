module moddynBlog {
  'use strict';

  export class d3MultiLineChartHelperService{
    public deletedData = [];

    /** @ngInject */
    constructor(private d3HelperService: any) { }

    public createMultiLine(d3, svg, width, height, margin, data, title, parseDate) {

      var x = this.createX(d3, width);
      var y = this.createY(d3, height);
      var color = d3.scale.category10();
      var xAxis = this.d3HelperService.createXAxis(d3, x, "bottom");
      var yAxis = this.d3HelperService.createYAxis(d3, y, "left");

      var line = this.createLine(d3, x, y, "date", "litres");
      this.createColorDomain(d3, color, data);
      this.parseDates(data, parseDate, "Ref_Date");
      var dataArr = this.createDataArray(color, data, "Ref_Date");

      this.createXDomain(d3, x, data, "Ref_Date");
      this.createYDomain(d3, y, dataArr, "litres");

      this.drawXAxis(svg, xAxis, height);
      this.drawYAxis(svg, yAxis, 'Litres drunk per capita (L)');
      this.drawLine(svg, dataArr, color, x, y, line, "date", "litres");
      this.d3HelperService.createTitle(svg, width, margin, title);
      this.createButtons(d3, svg, width, margin, dataArr, color, x, y, line, 'date', 'litres');
    }

    public createLine(d3, x, y, xProp, yProp) {
      var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) {
          return x(d[xProp]);
        })
        .y(function(d) {
          return y(d[yProp]);
        });
      return line;
    }

    public createX(d3, width) {
      var x = d3.time.scale().range([0, width]);
      return x;
    }

    public createY(d3, height) {
      var y = d3.scale.linear().range([height, 0]);
      return y;
    }

    public createDataArray(color, data, xProp) {
      var milk = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return { date: d[xProp], litres: d[name] };
          })
        };
      });
      return milk;
    }

    public createColorDomain(d3, color, data) {
      color.domain(d3.keys(data[0]).filter(function(key) {
        return key !== "Ref_Date";
      }));
    }
    
    public parseDates(data, parseDate, dateProp) {
      data.forEach(function(d) {
        d[dateProp] = parseDate(d[dateProp] + "");
      });
    }

    public createXDomain(d3, x, data, xProp) {
      x.domain(d3.extent(data, function(d) { return d[xProp]; }));
    }

    public createYDomain(d3, y, data, prop) {
      y.domain([
        d3.min(data, function(c) {
          return d3.min(c.values, function(v) {
            return v[prop];
          });
        }),
        d3.max(data, function(c) {
          return d3.max(c.values, function(v) {
            return v[prop];
          });
        })
      ]);
    }

    public drawXAxis(svg, xAxis, height) {
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    }

    public drawYAxis(svg, yAxis, text) {
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(text);
    }

    public drawLine(svg, data, color, x, y, line, dateProp, valueProp) {
      // create a holder for each line in the multi-line chart
      var eachLine = svg.selectAll(".eachLine")
        .data(data, function(d) {
          return d.name;
        });

      var eachLineEnter = eachLine.enter()
        .append("g")
        .attr("class", "eachLine");

      // create a line for each one
      var path = eachLineEnter.append("path")
        .attr("class", "line")
        .attr("d", function(d) {
          // the line function takes in an array of values and draws the whole thing in one go
          return line(d.values);
        })
        .style("stroke", function(d) {
          return color(d.name);
        });
      
      if (path.node()) {
        // this only happens if there is something to be entering
        var totalLength = path.node().getTotalLength();

        path.attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(750)
          .ease("linear")
          .attr("stroke-dashoffset", 0);
      }
        

      eachLineEnter.append("text")
        .datum(function(d) { 
          return { name: d.name, value: d.values[d.values.length - 1] }; 
        })
        .attr("transform", function(d) { return "translate(" + x(d.value[dateProp]) + "," + y(d.value[valueProp]) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

      eachLine.exit()
        .transition()
        .duration(500)
        .style("opacity", 0)
        .remove();
    }

    public createButtons(d3, svg, width, margin, data, color, x, y, line, dateProp, valueProp) {
      var optionsStart = 20;
      var that = this;
      var options = svg.selectAll(".option")
        .data(data, function(d) {
          return d.name;
        })
        .enter()
        .append("g");

      options.append('text')
        .attr('x', function(d, i) { 
          return ((d.name.length * 10) + parseInt(i)*70)
        })
        .attr('y', 0)
        .attr('class', 'option-text')
        .attr('fill', 'blue')
        .text(function(d) { return d.name })
        .on("click", function(d) {
          if (that.deletedData[d.name]) {
            d3.select(this).attr("fill", 'blue');
            that.addDataLine(that.deletedData[d.name], data, that, d);
            that.drawLine(svg, data, color, x, y, line, dateProp, valueProp);
          } else {
            d3.select(this).attr("fill", 'black');
            that.removeDataLine(data, d, that);
            that.drawLine(svg, data, color, x, y, line, dateProp, valueProp);
          }
        });
    }

    public addDataLine(dataToAdd, data, that, d) {
      data.push(dataToAdd);
      that.deletedData[d.name] = undefined;
    }

    public removeDataLine(data, d, that) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].name === d.name) {
          that.deletedData[d.name] = (data.splice(i, 1)[0]);
        }
      }
    }
  }
}
