module moddynBlog {
  'use strict';
  
  /** @ngInject */
  export function milkCanadaAllPerYearBar(): ng.IDirective {

    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      controller: MilkCanadaController,
      controllerAs: 'mcc',
      link: (scope: any, ele: JQuery, attrs: ng.IAttributes) => {
        
        scope.mcc.d3Service.d3().then(d3 => {
          var margin = { top: 20, right: 20, bottom: 30, left: 40 },
            width = ele.parent().width() - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

          var svg = scope.mcc.d3HelperService.createSVG(d3, width, height, margin, ele, 'line-canada');

          scope.mcc.d3HelperService.getData('/assets/data/milk/Canada_All_Per_Year_No_Total.json').then((data: any) => {
            
            var parseDate = d3.time.format("%Y").parse;

            scope.mcc.d3BarChartHelperService.createBarChart(d3, svg, width, height, margin, data, ele, "Canada Milk & Cream Consumption Per Year", parseDate);

          });
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
