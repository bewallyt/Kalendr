(function () {
  'use strict';

  angular
    .module('kalendr.freetime', [
      'kalendr.freetime.controllers',
      'kalendr.freetime.directives',
      'kalendr.freetime.services'
    ]);

  angular
    .module('kalendr.freetime.controllers', []);

  angular
    .module('kalendr.freetime.directives', ['ngDialog']);

  angular
    .module('kalendr.freetime.services', []);
})();
