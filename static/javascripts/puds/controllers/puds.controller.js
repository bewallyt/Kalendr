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

        function prioritySort(pr_sort) { //this should return a sorted array!
            pr_sort.sort(function (a, b) {
                return b.priority_int - a.priority_int;
            });
            return pr_sort;
        }

        function render(current, original) {

            if (current !== original) {
                vm.columns = [];

                for (var i = 0; i < calculateNumberOfColumns(); i++) {
                    vm.columns.push([]);
                }
                console.log('number of columns: ' + vm.columns.length);
                console.log("number of puds " + current.length);

                for (var i = 0; i < current.length; i++) {
                    console.log('pud: ' + current[i].content + ' repeat_int: ' + current[i].repeat_int + ' priority_int: ' +
                    current[i].priority_int); //charfields and booleans work
                    if (current[i].repeat_int == 0 || current[i].repeat_int == 1 ||
                        current[i].repeat_int == 2) {
                        vm.columns[0].push(current[i]);
                        console.log('pushing: ' + current[i].content + 'here');
                    } else {
                        vm.columns[1].push(current[i]);
                        console.log('pushing monthly into column 2: ' + current[i].content);
                    }
                    vm.columns[2].push(current[i]);
                    //vm.pr_sort.push(current[i]);
                }
                //var sorted = prioritySort(vm.pr_sort);
                //for (var s = 0; s < sorted.length; ++s) {
                //    console.log('pushing priority level: ' + sorted[s]); //the sorting is not working apparently
                //    vm.columns[2].push(sorted[s]);
                //}
            }
        }

    }
})();
