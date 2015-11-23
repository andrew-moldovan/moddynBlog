module moddynBlog {
  'use strict';
  
  /** @ngInject */
  export function milkCanadaCreamPerYearLine(): ng.IDirective {

    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      controller: MilkCanadaController,
      controllerAs: 'mcc',
      link: (scope: any, ele: JQuery, attrs: ng.IAttributes) => {
        scope.mcc.d3Service.d3().then(d3 => {
          scope.mcc.d3HelperService.getData('/assets/data/milk/Canada_All_Cream_Per_Year.json').then((data: any) => {

            var margin = { top: 20, right: 80, bottom: 30, left: 50 };
            var parseDate = d3.time.format("%Y").parse;
            scope.mcc.d3MultiLineChartHelperService.createMultiLine(d3, margin, data, ele, 'line-canada', parseDate, "Canada Cream Consumption Per Year");

          });
        });
      },
      bindToController: true
    };
  }

  /** @ngInject */
  class MilkCanadaController {

    constructor(private d3Service: any, private d3MultiLineChartHelperService: any, private d3HelperService: any) {
    }
  }
}