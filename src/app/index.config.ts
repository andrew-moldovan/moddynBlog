module moddynBlog {
  'use strict';

  export class Config {
    /** @ngInject */
    constructor($logProvider: ng.ILogProvider) {
      // enable log
      $logProvider.debugEnabled(true);
    }

  }
}
