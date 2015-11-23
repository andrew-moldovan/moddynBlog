module moddynBlog {
  'use strict';

  export class d3MultiLineChartHelperService{
    
    /** @ngInject */
    constructor(private d3HelperService: any) { }

    public createMultiLine(d3, margin, data, ele, cssClass, parseDate, title) {
      var width = ele.parent().width() - margin.left - margin.right;
      var height = 500 - margin.top - margin.bottom;

      var x = this.createX(d3, width);
      var y = this.createY(d3, height);
      var color = d3.scale.category10();
      var xAxis = this.d3HelperService.createXAxis(d3, x, "bottom");
      var yAxis = this.d3HelperService.createYAxis(d3, y, "left");

      var line = this.createLine(d3, x, y, "date", "litres");
      var svg = this.d3HelperService.createSVG(d3, width, height, margin, ele, cssClass);
      this.createColorDomain(d3, color, data);
      this.parseDates(data, parseDate, "Ref_Date");
      var milk = this.createDataArray(color, data, "Ref_Date");

      this.createXDomain(d3, x, data, "Ref_Date");
      this.createYDomain(d3, y, milk, "litres");

      this.drawXAxis(svg, xAxis, height);
      this.drawYAxis(svg, yAxis, 'Litres drunk per capita (L)');
      this.drawLine(svg, milk, color, x, y, line, "date", "litres");
      this.d3HelperService.createTitle(svg, width, margin, title);
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
      var city = svg.selectAll(".city")
        .data(data)
        .enter().append("g")
        .attr("class", "city");

      city.append("path")
        .attr("class", "line")
        .attr("d", function(d) {
          return line(d.values);
        })
        .style("stroke", function(d) {
          return color(d.name);
        });

      city.append("text")
        .datum(function(d) { return { name: d.name, value: d.values[d.values.length - 1] }; })
        .attr("transform", function(d) { return "translate(" + x(d.value[dateProp]) + "," + y(d.value[valueProp]) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });
    }
  }
}
