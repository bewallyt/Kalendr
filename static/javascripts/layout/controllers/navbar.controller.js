/**
 * NavbarController
 * @namespace kalendr.layout.controllers
 */
(function () {
  'use strict';

  angular
    .module('kalendr.layout.controllers')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$scope', 'Authentication'];

  /**
   * @namespace NavbarController
   */
  function NavbarController($scope, Authentication) {
    var vm = this;

    vm.logout = logout;

    /**
     * @name logout
     * @desc Log the user out
     * @memberOf kalendr.layout.controllers.NavbarController
     */
    function logout() {
      Authentication.logout();
    }
  }
})();
