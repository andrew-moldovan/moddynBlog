module moddynBlog {
  'use strict';
  
  /** @ngInject */
  export function milkCanada(): ng.IDirective {

    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      templateUrl: 'app/components/posts/milk/canada.html',
      controller: MilkCanadaController,
      controllerAs: 'mcc',
      link: (scope: any, ele: JQuery, attrs: ng.IAttributes) => {
        scope.mcc.d3Service.d3().then(d3 => {

          var height = window.innerHeight * 0.5;
          var margin = { top: 40, right: 120, bottom: 30, left: 40 },
          width = 400;

          var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

          var y = d3.scale.linear()
            .range([height, 0]);

          var xAxis = d3.svg.axis()
            .scale(x)
            .orient("top")
            .tickFormat(function(d){
              return "";
            });

          var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

          var svg = d3.select(ele[0]).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          scope.$on('$destroy', function() {
            scope.mcc.d3HelperService.removeSVGOnDestroy(svg, d3);
          });

          x.domain(scope.mcc.data.map(function(d) { return d.company; }));
          y.domain([0, d3.max(scope.mcc.data, function(d) { return d.avgOrgDepth; })]);

          var globalColorScale = d3.scale.category20c();

          drawBars();

          function drawBars() {
            svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

              svg.selectAll(".bar")
                .data(scope.mcc.data)
                .enter().append("rect")
                  .attr("class", "bar")
                  .attr("x", function(d) { return x(d.company); })
                  .attr("width", x.rangeBand())
                  .attr("y", function(d) { return y(d.avgOrgDepth); })
                  .style('fill', function(d, i) { return globalColorScale(i) })
                  .attr("height", function(d) { return height - y(d.avgOrgDepth); });

              var dataLabels = svg.selectAll(".bartext")
                .data(scope.mcc.data)
                .enter()
                .append("text")
                .text(function(d) {return d.avgOrgDepth})
                .attr("x", function(d, i) {
                  return i * (width / scope.mcc.data.length) + (width / scope.mcc.data.length - 1) / 2;
                })
                .attr("y", function(d, i) {
                  return y(d.avgOrgDepth) + 15;
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "white")
                .attr("text-anchor", "middle");

              var legendRectSize = 14;
              var legendSpacing = 4;

              scope.mcc.d3HelperService.createLegend(svg, scope.mcc.data, width, legendRectSize, legendRectSize, legendSpacing, globalColorScale);

              var title = svg.append("text")
                .attr("x", (width / 2))             
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")  
                .style("font-size", "16px") 
                .style("text-decoration", "underline")  
                .text("Average Organization Depth by Company");

           } // end drawBars()
        });
      },
      bindToController: true
    };
  }

  /** @ngInject */
  class MilkCanadaController {

    constructor(private d3Service: any, private d3HelperService: any) {
    }
  }
}
