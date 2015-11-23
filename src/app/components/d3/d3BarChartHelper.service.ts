module moddynBlog {
  'use strict';

  export class d3BarChartHelperService {
    
    /** @ngInject */
    constructor(private d3HelperService:any) {}

    public createBarChart(d3, svg, width, height, margin, data, ele, title, parseDate) {
      var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
        .rangeRound([height, 0]);

      var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#ccc", "#bbb", "#bef", "#cae", "#aaa", "#ddd"]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Ref_Date"; }));

      data.forEach(function(d) {
        var y0 = 0;
        d.dairy = color.domain().map(function(name) { return { name: name, y0: y0, y1: y0 += +d[name] }; });
        d.total = d.dairy[d.dairy.length - 1].y1;
      });

      x.domain(data.map(function(d) { return d.Ref_Date; }));
      y.domain([0, d3.max(data, function(d) { return d.total; })]);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Population");

      var state = svg.selectAll(".state")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x(d.Ref_Date) + ",0)"; });

      state.selectAll("rect")
        .data(function(d) { return d.dairy; })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
        .style("fill", function(d) { return color(d.name); });

      var legend = svg.selectAll(".legend")
        .data(color.domain().slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

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
        .text(function(d) { return d; });
    }
  }
}
