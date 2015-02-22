(function () {

  angular
    .module('kalendr.accounts', [
      'kalendr.accounts.controllers',
      'kalendr.accounts.services'
    ]);

  angular
    .module('kalendr.accounts.controllers', ['ngDialog']);

  angular
    .module('kalendr.accounts.services', []);

})();
