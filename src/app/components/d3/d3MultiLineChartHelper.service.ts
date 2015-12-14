module moddynBlog {
  'use strict';

  export class d3MultiLineChartHelperService{
    public deletedData = [];
    public leftMargin = 75;
    public monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    public d3;

    /** @ngInject */
    constructor(private d3HelperService: any) { }

    public createMultiLine(d3, svg, ele, width, height, margin, data, title, parseDate) {
      this.d3 = d3;
      var x = this.createX(width);
      var y = this.createY(height);
      var color = d3.scale.category10();
      var xAxis = this.d3HelperService.createXAxis(this.d3, x, "bottom");
      var yAxis = this.d3HelperService.createYAxis(this.d3, y, "right");

      var line = this.createLine(x, y, "date", "litres");
      this.createColorDomain(color, data);
      this.parseDates(data, parseDate, "Ref_Date");
      var dataArr = this.createDataArray(color, data, "Ref_Date");

      this.createXDomain(x, data, "Ref_Date");
      this.createYDomain(y, dataArr, "litres");

      this.drawXAxis(svg, xAxis, height);
      this.drawYAxis(svg, yAxis, 'Litres drunk per capita (L)');
      this.drawLine(svg, ele, dataArr, color, x, y, line, "date", "litres", height);
      this.d3HelperService.createTitle(svg, width, margin, title);
      this.createButtons(svg, ele, width, margin, dataArr, color, x, y, line, 'date', 'litres', height);
    }

    public createLine(x, y, xProp, yProp) {
      var line = this.d3.svg.line()
        .interpolate("basis")
        .x(function(d) {
          return x(d[xProp]);
        })
        .y(function(d) {
          return y(d[yProp]);
        });
      return line;
    }

    public createX(width) {
      var x = this.d3.time.scale().range([0, width]);
      return x;
    }

    public createY(height) {
      var y = this.d3.scale.linear().range([height, 0]);
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

    public createColorDomain(color, data) {
      color.domain(this.d3.keys(data[0]).filter(function(key) {
        return key !== "Ref_Date";
      }));
    }
    
    public parseDates(data, parseDate, dateProp) {
      data.forEach(function(d) {
        d[dateProp] = parseDate(d[dateProp] + "");
      });
    }

    public createXDomain(x, data, xProp) {
      x.domain(this.d3.extent(data, function(d) { return d[xProp]; }));
    }

    public createYDomain(y, data, prop) {
      var that = this;
      y.domain([
        this.d3.min(data, function(c) {
          return that.d3.min(c.values, function(v) {
            return v[prop];
          });
        }),
        this.d3.max(data, function(c) {
          return that.d3.max(c.values, function(v) {
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

    public drawLine(svg, ele, data, color, x, y, line, dateProp, valueProp, height) {
      var bisectDate = this.d3.bisector(function(d) {
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

      var tooltip = this.d3.select(ele[0]).append("div")
        .style('margin-top', '-' + (height+50) + 'px')
        .attr("class", "tooltip");

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
          var xPos = parseInt(that.d3.mouse(this)[0]) + that.leftMargin;
          var yPos = parseInt(that.d3.mouse(this)[1]);

          svg.append("circle")
            .attr('cx', xPos)
            .attr('cy', that.d3.mouse(this)[1])
            .attr('r', 5)
            .attr('fill', 'none')
            .attr('stroke', "red")
            .attr('stroke-width', "2px")
            .attr('class', 'mouse-over-circle');

          //draw vertical line down to axis
          svg.append('line')
            .attr('x1', xPos)
            .attr('y1', yPos)
            .attr('x2', xPos)
            .attr('y2', height)
            .attr('stroke', "red")
            .attr('stroke-width', "2")
            .attr('class', 'mouse-over-line');

          //draw horizontal line to axis
          svg.append('line')
            .attr('x1', xPos)
            .attr('y1', yPos)
            .attr('x2', that.leftMargin)
            .attr('y2', yPos)
            .attr('stroke', "red")
            .attr('stroke-width', "2")
            .attr('class', 'mouse-over-line');

          var dateObj = new Date(x.invert(that.d3.mouse(this)[0]));
          var dateYear = dateObj.getFullYear();
          var dateMonth = that.monthNames[dateObj.getMonth()];
          var value = y.invert(that.d3.mouse(this)[1]);

          tooltip.html(d.name + "<br/>" + dateMonth + " " + dateYear + "<br/>Consumption per capita: " + value.toFixed(1) + "L")
        })
        .on("mouseout", function(d) {
          that.mouseOut(svg, true);
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

    public mouseOut(svg, transition) {
      svg.selectAll('.mouse-over-line')
        .remove();
      svg.selectAll('.mouse-over-circle')
        .remove();
    }

    public createButtons(svg, ele, width, margin, data, color, x, y, line, dateProp, valueProp, height) {
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
            that.d3.select(this).attr("fill", 'blue');
            that.addDataLine(that.deletedData[d.name], data, that, d);
            that.drawLine(svg, ele, data, color, x, y, line, dateProp, valueProp, height);
          } else {
            that.d3.select(this).attr("fill", 'black');
            that.removeDataLine(data, d, that);
            that.drawLine(svg, ele, data, color, x, y, line, dateProp, valueProp, height);
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
