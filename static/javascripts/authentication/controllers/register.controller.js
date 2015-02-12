/**
 * Register controller
 * @namespace kalendr.authentication.controllers
 */
(function () {
  'use strict';

  angular
    .module('kalendr.authentication.controllers')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$rootScope','$location', '$scope', 'Authentication'];

  /**
   * @namespace RegisterController
   */
  function RegisterController($rootScope, $location, $scope, Authentication) {
    var vm = this;

    vm.register = register;
    console.log('clicking register');
    activate();

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf kalendr.authentication.controllers.RegisterController
     */
    function activate() {
      // If the user is authenticated, they should not be here.
      if (Authentication.isAuthenticated()) {
        $location.url('/');
      }
    }

    /**
     * @name register
     * @desc Register a new user
     * @memberOf kalendr.authentication.controllers.RegisterController
     */
    function register() {
      Authentication.register(vm.email, vm.password, vm.username);
    }
  }
})();
