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
        //vm.selectedGroup;

        function submit() {
            if(vm.event_type==0) {
                vm.start_search = null;
                vm.end_search = null;
            }

            if(vm.su) {
                vm.day_array.push(0);
            }
        }


    }
})();
