(function () {
  'use strict';

  angular
    .module('kalendr.authentication', [
      'kalendr.authentication.controllers',
      'kalendr.authentication.services'
    ]);

  angular
    .module('kalendr.authentication.controllers', []);

  angular
    .module('kalendr.authentication.services', ['ngCookies']);
})();
