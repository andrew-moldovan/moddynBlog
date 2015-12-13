module moddynBlog {
  'use strict';

  export class d3MultiLineChartHelperService{
    public deletedData = [];
    public leftMargin = 75;
    public monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];


    /** @ngInject */
    constructor(private d3HelperService: any) { }

    public createMultiLine(d3, svg, width, height, margin, data, title, parseDate) {

      var x = this.createX(d3, width);
      var y = this.createY(d3, height);
      var color = d3.scale.category10();
      var xAxis = this.d3HelperService.createXAxis(d3, x, "bottom");
      var yAxis = this.d3HelperService.createYAxis(d3, y, "right");

      var line = this.createLine(d3, x, y, "date", "litres");
      this.createColorDomain(d3, color, data);
      this.parseDates(data, parseDate, "Ref_Date");
      var dataArr = this.createDataArray(color, data, "Ref_Date");

      this.createXDomain(d3, x, data, "Ref_Date");
      this.createYDomain(d3, y, dataArr, "litres");

      this.drawXAxis(svg, xAxis, height);
      this.drawYAxis(svg, yAxis, 'Litres drunk per capita (L)');
      this.drawLine(d3, svg, dataArr, color, x, y, line, "date", "litres");
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
        .attr("transform", "translate("+this.leftMargin+"," + height + ")")
        .call(xAxis);
    }

    public drawYAxis(svg, yAxis, text) {
      svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + this.leftMargin + ", 0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 25)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("fill", 'red')
        .style("z-index", 9999)
        .text(text);
    }

    public drawLine(d3, svg, data, color, x, y, line, dateProp, valueProp) {
      var bisectDate = d3.bisector(function(d) {
        return d.date;
      }).left;

      // create a holder for each line in the multi-line chart
      var eachLine = svg.selectAll(".eachLine")
        .data(data, function(d) {
          return d.name;
        });

      var eachLineEnter = eachLine.enter()
        .append("g")
        .attr("class", "eachLine");

      var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      var that = this;
      // create a line for each one
      var path = eachLineEnter.append("path")
        .attr("class", "line")
        .attr("transform", "translate(" + this.leftMargin + ", 0)")
        .attr("d", function(d) {
          // the line function takes in an array of values and draws the whole thing in one go
          return line(d.values);
        })
        .style("stroke", function(d) {
          return color(d.name);
        })
        .on("mouseover", function(d) {
          var dateObj = new Date(x.invert(d3.mouse(this)[0]));
          var dateYear = dateObj.getFullYear();
          var dateMonth = that.monthNames[dateObj.getMonth()];
          var value = y.invert(d3.mouse(this)[1]);
          console.log(d);

          tooltip.transition()
            .duration(100)
            .style("opacity", .9);
          tooltip.html(d.name + "<br/>" + dateMonth + " " + dateYear + "<br/>Consumption per capita: " + value.toFixed(1) + "L")
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
          tooltip.transition()
            .duration(400)
            .style("opacity", 0);
        });
      
      if (path.node()) {
        // this only happens if there is something to be entering
        var totalLength = path.node().getTotalLength() + 5000;

        path.attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(750)
          .ease("linear")
          .attr("stroke-dashoffset", 0);
      }

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
        .enter();

      options.append('text')
        .attr('x', this.leftMargin-5)
        .attr('y', function (d, i) {
          return (i * 20) + 10;
        })
        .attr('class', 'option-text')
        .attr('fill', 'blue')
        .text(function(d) { return d.name })
        .on("click", function(d) {
          if (that.deletedData[d.name]) {
            d3.select(this).attr("fill", 'blue');
            that.addDataLine(that.deletedData[d.name], data, that, d);
            that.drawLine(d3, svg, data, color, x, y, line, dateProp, valueProp);
          } else {
            d3.select(this).attr("fill", 'black');
            that.removeDataLine(data, d, that);
            that.drawLine(d3, svg, data, color, x, y, line, dateProp, valueProp);
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
