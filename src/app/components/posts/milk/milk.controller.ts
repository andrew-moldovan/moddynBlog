module moddynBlog {
  'use strict';

  export class MilkController {
    public testData;

    /* @ngInject */
    constructor() {

      this.testData = [
        { company: 'Microsoft', avgOrgDepth: 6.6 },
        { company: 'Fortune 500', avgOrgDepth: 6.1 },
        { company: 'Finance', avgOrgDepth: 3.4 },
        { company: 'Tech', avgOrgDepth: 4.2 },
        { company: 'Healthcare', avgOrgDepth: 5.3 },
        { company: 'Retail', avgOrgDepth: 2.3 }
      ];   
    }
  }
}