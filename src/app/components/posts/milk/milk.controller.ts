module moddynBlog {
  'use strict';

  export class MilkController {
    public margin = { top: 20, right: 20, bottom: 30, left: 40 };
    public url1 = '/assets/data/milk/Canada_All_Per_Year_No_Total.json';
    public url2 = '/assets/data/milk/Canada_All_Milk.json';
    public url3 = '/assets/data/milk/Canada_All_Cream.json';

    /* @ngInject */
    constructor() {  
    }
  }
}