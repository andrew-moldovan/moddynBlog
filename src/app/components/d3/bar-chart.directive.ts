module moddynBlog {
  'use strict';
  
  /** @ngInject */
  export function barChart(): ng.IDirective {

    return {
      restrict: 'E',
      scope: {
        url: '=',
        parseDateFormat: '=',
        margin: '=',
        height: '=',
        title: '=',
        cssClass: '='
      },
      controller: barChartController,
      controllerAs: 'mcc',
      link: (scope: any, ele: JQuery, attrs: ng.IAttributes) => {

        scope.mcc.d3Service.d3().then(d3 => {
          var width = ele.parent().width() - scope.mcc.margin.left - scope.mcc.margin.right;
          var height = scope.mcc.height - scope.mcc.margin.top - scope.mcc.margin.bottom;
          var svg = scope.mcc.d3HelperService.createSVG(d3, width, height, scope.mcc.margin, ele, scope.mcc.cssClass);

          scope.mcc.d3HelperService.getData(scope.mcc.url).then((data: any) => {
            scope.mcc.d3BarChartHelperService.createBarChart(d3, svg, width, height, scope.mcc.margin, data, ele, scope.mcc.title);
          });
        });
      },
      bindToController: true
    };
  }

  /** @ngInject */
  class barChartController {

    constructor(private d3Service: any, private d3BarChartHelperService: any, private d3HelperService: any) {
    }
  }
}
