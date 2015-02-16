/**
 * NewPudController
 * @namespace kalendr.puds.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.puds.controllers')
        .controller('NewPudController', NewPudController);

    NewPudController.$inject = ['$timeout', '$scope'];

    /**
     * @namespace NewPudController
     */
    function NewPudController($timeout, $scope) {
        var vm = this;
        activate();


        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf kalendr.puds.controllers.NewPudController
         */
        function activate() {

        }

    }
})();
