(function () {
    'use strict';

    angular
        .module('kalendr.freetime.controllers')
        .controller('FreeTimeController', FreeTimeController);

    FreeTimeController.$inject = ['$rootScope', '$scope', '$routeParams', 'Authentication', 'Snackbar'];


    function FreeTimeController($rootScope, $scope, $routeParams, Authentication, Snackbar) {
        var vm = this;
        vm.submit = submit;
        vm.day_array = [];
        vm.selectedUser;
        vm.addUser = addUser;
        //vm.addDay = addDay;
        vm.followingDict = [];
        var event_type;

        function submit() {
            if (vm.event_type == "One-Time") {
                event_type = 0;
                vm.start_search = null;
                vm.end_search = null;
            } else {
                event_type = 1;
            }

            if (vm.su) {
                vm.day_array.push(0);
            }
            if (vm.mo) {
                vm.day_array.push(1);
            }
            if (vm.tu) {
                vm.day_array.push(2);
            }
            if (vm.we) {
                vm.day_array.push(3);
            }
            if (vm.th) {
                vm.day_array.push(4);
            }
            if (vm.fr) {
                vm.day_array.push(5);
            }
            if (vm.sa) {
                vm.day_array.push(6);
            }

            passVal(event_type, vm.start_search, vm.end_search, vm.dur_hr, vm.dur_mi,
                    vm.begin_time, vm.end_time, vm.day_array, vm.followingDict);

            $scope.closeThisDialog();

        }

        function addUser() {
            vm.followingDict.push(vm.selectedUser.originalObject.username);
        }

        //function addDay() {
        //    vm.day_array.push(ng-ngModel);
        //}

        function passVal(type, s_date, e_date, hrs, min, s_time, e_time, days, following) {
            console.log(type + " event type");
            console.log(s_date + " start date");
            console.log(e_date + " end date");
            console.log(hrs + " hours");
            console.log(min + " minutes");
            console.log(s_time + " start time");
            console.log(e_time + " end time");
            days.forEach(function (entry) {
                console.log(entry + " day");
            });
            following.forEach(function (entry) {
                console.log(entry + " following");
            });
        }


    }
})();
