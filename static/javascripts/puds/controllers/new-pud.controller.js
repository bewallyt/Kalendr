/**
 * NewPudController
 * @namespace kalendr.puds.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.puds.controllers')
        .controller('NewPudController', NewPudController);

    NewPudController.$inject = ['$rootScope', '$scope', 'Authentication', 'Puds', 'Snackbar'];

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
            var notification;
            var notifyWhen;

            var content = vm.content;

            if (vm.notification == undefined) {
                notification = false;
            }

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
                repeatType = 'Perpetual';
            }

            if (vm.repeat == 'Weekly' ||
                vm.repeat == 'Monthly' ||
                vm.repeat == 'Daily') vm.need_repeat = true;

            if (notification) {
                notifyWhen = parseInt(vm.notify_when);
            } else {
                notifyWhen = 0;
            }


            Puds.create(content, notification, priority, priority_int, duration, repeatType, repeat_int,
                vm.need_repeat, notifyWhen).then(createPudSuccessFn, createPudErrorFn);

            $rootScope.$broadcast('pud.created', {
                content: content,
                notification: notification,
                priority: priority,
                priority_int: priority_int,
                duration: duration,
                repeat: repeatType,
                repeat_int: repeat_int,
                need_repeat: vm.need_repeat,
                notify_when: notifyWhen,
                author: {
                    username: Authentication.getAuthenticatedAccount().username
                }
            });

            $scope.closeThisDialog();

            function createPudSuccessFn(data, status, headers, config) {
                Snackbar.show('Success! PUD added to Kalendr');
            }

            function createPudErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('pud.created.error');
                Snackbar.error(data.error);
            }


        }
    }
})();
