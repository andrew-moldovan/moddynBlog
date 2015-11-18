module moddynBlog {
  'use strict';

  export class d3HelperService {

    /** @ngInject */
    constructor() {}

    public removeSVGOnDestroy(svg: any, d3: any) {
      svg.selectAll("*").remove();
      d3.select("svg").remove();
    }

  }
}
