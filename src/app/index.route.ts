module moddynBlog {
  'use strict';

  export class RouterConfig {
    /** @ngInject */
    constructor($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'app/main/main.html',
          controller: 'MainController',
          controllerAs: 'main'
        })
        .state('milk', {
          url: '/milk',
          templateUrl: 'app/components/posts/milk/milk.html',
          controller: 'MilkController',
          controllerAs: 'milk'
        });

      $urlRouterProvider.otherwise('/');
    }

  }
}
