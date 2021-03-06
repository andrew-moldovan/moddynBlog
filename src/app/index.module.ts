/// <reference path="../../.tmp/typings/tsd.d.ts" />


/// <reference path="index.route.ts" />

/// <reference path="index.config.ts" />
/// <reference path="index.run.ts" />
/// <reference path="main/main.controller.ts" />
/// <reference path="../app/components/posts/milk/milk.controller.ts" />
/// <reference path="../app/components/navbar/navbar.directive.ts" />
/// <reference path="../app/components/d3/d3.service.ts" />
/// <reference path="../app/components/d3/d3BarChartHelper.service.ts" />
/// <reference path="../app/components/d3/d3MultiLineChartHelper.service.ts" />
/// <reference path="../app/components/d3/d3Helper.service.ts" />
/// <reference path="../app/components/d3/bar-chart.directive.ts" />
/// <reference path="../app/components/d3/line-chart.directive.ts" />

module moddynBlog {
  'use strict';

  angular.module('moddynBlog', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'd3'])
      .config(Config)
      .config(RouterConfig)
      .run(RunBlock)
      .service('d3HelperService', d3HelperService)
      .service('d3BarChartHelperService', d3BarChartHelperService)
      .service('d3MultiLineChartHelperService', d3MultiLineChartHelperService)
      .controller('MainController', MainController)
      .controller('MilkController', MilkController)
      .directive('navbar', navbar)
      .directive('barChart', barChart)
      .directive('lineChart', lineChart);
}
