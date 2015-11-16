module moddynBlog {
  'use strict';
  
  /** @ngInject */
  export function milkCanada(): ng.IDirective {

    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'app/components/posts/milk/canada.html',
      controller: MilkCanadaController,
      controllerAs: 'mcc',
      link: (scope: any, element: JQuery, attrs: ng.IAttributes) => {
        scope.mcc.d3Service.d3().then(d3 => {
          console.log(d3);
        });
      },
      bindToController: true
    };
  }

  /** @ngInject */
  class MilkCanadaController {

    constructor(private d3Service: any) {
    }
  }
}
