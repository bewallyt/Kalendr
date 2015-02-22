(function () {
  'use strict';

  angular
    .module('kalendr.groups', [
      'kalendr.groups.controllers',
      'kalendr.groups.directives',
      'kalendr.groups.services'
    ]);

  angular
    .module('kalendr.groups.controllers', ['ngDialog']);

  angular
    .module('kalendr.groups.directives', ['ngDialog']);

  angular
    .module('kalendr.groups.services', []);
})();
