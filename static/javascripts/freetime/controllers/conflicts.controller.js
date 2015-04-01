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
        vm.dur_hrs;
        vm.dur_min;
        vm.start_time;
        vm.end_time;
        vm.days;
        vm.length;
        vm.users;

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
                vm.dur_hrs = current[0].duration_hrs;
                vm.dur_min = current[0].duration_min;
                vm.start_time = current[0].start_time;
                vm.end_time = current[0].end_time;
                vm.days = current[0].which_days;
                vm.length = current.length;
                vm.users = current[0].num_conflicting_users;
            }
            //if (current.length != 0) {
            //    vm.dur_hrs = current[0].duration_hrs;
            //    vm.dur_min = current[0].duration_min;
            //    vm.start_time = current[0].start_time;
            //    vm.end_time = current[0].end_time;
            //    vm.days = current[0].which_days;
            //    vm.length = current.length;
            //    vm.users = current[0].num_conflicting_users;
            //}
        }

    }
})();