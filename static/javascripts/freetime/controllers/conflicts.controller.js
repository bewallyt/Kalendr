/**
 * ConflictsController
 * @namespace kalendr.freetime.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.freetime.controllers')
        .controller('ConflictsController', ConflictsController);

    ConflictsController.$inject = ['$scope'];

    /**
     * @namespace ConflictsController
     */
    function ConflictsController($scope) {
        var vm = this;

        vm.columns = [];

        activate();


        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf kalendr.freetime.controllers.ConflictsController
         */
        function activate() {

            console.log("in activate conflicts");
            $scope.$watchCollection(function () {
                return $scope.conflicts;
            }, render);
            $scope.$watch(function () {
                return $(window).width();
            }, render);
        }


        function render(current, original) {

            if (current !== original) {
                vm.columns = [];

                for (var i = 0; i < current.length; i++) {
                    vm.columns.push([]);
                }

                for (var j = 0; j < current.length; j++) {
                    vm.columns[j].push(current[j]);
                }

            }
        }

    }
})();