/**
 * NewPudController
 * @namespace kalendr.puds.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.puds.controllers')
        .controller('NewPudController', NewPudController);

    NewPudController.$inject = ['$rootScope','$scope', 'Authentication', 'Puds', 'Snackbar'];

    /**
     * @namespace NewPudController
     */
    function NewPudController($rootScope, $scope, Authentication, Puds, Snackbar) {
        var vm = this;
        vm.submit = submit;
        vm.need_repeat = false;

        function submit() {
            var repeat_int;
            var priority_int;

            var content = vm.content;
            var notification = vm.notification;
            var priority = vm.priority;

            if (vm.priority == 'low') {
                priority_int = 0;
            } else if (vm.priority == 'normal') {
                priority_int = 1;
            } else if (vm.priority == 'high') {
                priority_int = 2;
            } else {
                priority_int = 3;
            }

            var duration = parseInt(vm.duration);
            var repeatType = vm.repeat;

            if (vm.repeat == 'Weekly') {
                repeat_int = 2;
            } else if (vm.repeat == 'Monthly') {
                repeat_int = 3;
            } else if (vm.repeat == 'Daily') {
                repeat_int = 1;
            } else {
                repeat_int = 0;
            }

            if (vm.repeat == 'Weekly' ||
                vm.repeat == 'Monthly' ||
                vm.repeat == 'Daily') vm.need_repeat = true;

            var notifyWhen = parseInt(vm.notify_when);

            Puds.create(content, notification, priority, priority_int, duration, repeatType, repeat_int,
                vm.need_repeat, notifyWhen).then(createPudSuccessFn, createPudErrorFn);

            function createPudSuccessFn(data, status, headers, config) {
                Snackbar.show('Success! PUD added to Kalendr');
            }

            function createPudErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('pud.created.error');
                Snackbar.error(data.error);
            }

            $scope.closeThisDialog();
        }
    }
})();
