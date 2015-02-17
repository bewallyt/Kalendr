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

        activate();


        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf kalendr.puds.controllers.PudsController
         */
        function activate() {

            var i;
            for (i=0; i<$scope.puds.length; i++) {
                console.log($scope.posts[i].content);
            }
            $scope.$watchCollection(function () {
                return $scope.posts;
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

                for (var i=0; i<calculateNumberOfColumns(); ++i) {
                    vm.columns.push([]);
                }

                //for (var i=0; i<current.length; ++i) {
                //    if (current[i].repeat == 'Daily') {
                //        vm.columns[0].push(current[i]);
                //    } else if (current[i].repeat == 'Weekly') {
                //        vm.columns[0].push(current[i]);
                //    } else if (current[i].repeat == 'Monthly') {
                //        vm.columns[1].push(current[i]);
                //    }
                //}
            }
        }

    }
})();
