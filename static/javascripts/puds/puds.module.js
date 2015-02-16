(function () {
  'use strict';

  angular
    .module('kalendr.puds', [
      'kalendr.puds.controllers',
      'kalendr.puds.directives',
      'kalendr.puds.services'
    ]);

  angular
    .module('kalendr.puds.controllers', []);

  angular
    .module('kalendr.puds.directives', ['ngDialog']);

  angular
    .module('kalendr.puds.services', []);
})();
