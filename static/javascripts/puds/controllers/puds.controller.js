/**
 * PudsController
 * @namespace kalendr.puds.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.puds.controllers')
        .controller('PudsController', PudsController);

    PudsController.$inject = ['$scope'];

    /**
     * @namespace PudsController
     */
    function PudsController($scope) {
        var vm = this;

        vm.columns = [];
        vm.pr_sort = [];

        activate();


        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf kalendr.puds.controllers.PudsController
         */
        function activate() {

            var i;
            for (i = 0; i < $scope.puds.length; i++) {
                console.log($scope.puds[i].content);
            }
            $scope.$watchCollection(function () {
                return $scope.puds;
            }, render);
            $scope.$watch(function () {
                return $(window).width();
            }, render);
        }

        function calculateNumberOfColumns() {
            var width = $(window).width();
            return 3;
        }

        function render(current, original) {

            if (current !== original) {
                vm.columns = [];

                for (var i = 0; i < calculateNumberOfColumns(); i++) {
                    vm.columns.push([]);
                }

                for (var i = 0; i < current.length; i++) {
                    if (current[i].repeat_int == 0 || current[i].repeat_int == 1 ||
                        current[i].repeat_int == 2) {
                        vm.columns[0].push(current[i]);
                        vm.columns[2].push(current[i]);
                    } else {
                        vm.columns[1].push(current[i]);
                        vm.columns[2].push(current[i]);
                    }
                }
                vm.columns[2].sort(function (a, b) {
                    return b.priority_int - a.priority_int;
                })


            }
        }

    }
})();