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
          var margin = { top: 40, right: 120, bottom: 30, left: 40 };
          var width = 400;
          var title = "Test bar chart";

          var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
          var y = d3.scale.linear()
            .range([height, 0]);

          var xAxis = scope.mcc.d3BarChartHelperService.createXAxis(d3, x);
          var yAxis = scope.mcc.d3BarChartHelperService.createYAxis(d3, y);

          var svg = scope.mcc.d3HelperService.createSVG(d3, width, height, margin, scope.mcc.data, ele, 'testBar');

          scope.mcc.d3BarChartHelperService.fillAxisWithData(d3, x, y, scope.mcc.data);

          scope.$on('$destroy', function() {
            scope.mcc.d3HelperService.removeSVGOnDestroy(svg, d3);
          });

          var globalColorScale = d3.scale.category20c();

          scope.mcc.d3BarChartHelperService.createBarGroupAndTranslate(svg, height, xAxis);
          scope.mcc.d3BarChartHelperService.addDataToBars(svg, scope.mcc.data, x, y, height, globalColorScale);
          scope.mcc.d3BarChartHelperService.createDataLabels(svg, scope.mcc.data, width, x, y);
          scope.mcc.d3BarChartHelperService.createLegend(svg, scope.mcc.data, width, globalColorScale);
          scope.mcc.d3BarChartHelperService.createTitle(svg, width, margin, title);
           
        });
      },
      bindToController: true
    };
  }

  /** @ngInject */
  class MilkCanadaController {

    constructor(private d3Service: any, private d3BarChartHelperService: any, private d3HelperService: any) {
    }
  }
}
