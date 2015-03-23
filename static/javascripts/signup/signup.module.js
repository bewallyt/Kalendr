(function () {
  'use strict';

  angular
    .module('kalendr.signup', [
      'kalendr.signup.controllers',
      'kalendr.signup.services'
    ]);

  angular
    .module('kalendr.signup.controllers', ['ngDialog']);

  angular
    .module('kalendr.signup.services', []);
})();
