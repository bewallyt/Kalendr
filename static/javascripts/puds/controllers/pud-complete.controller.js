/**
 * PudCompleteController
 * @namespace kalendr.puds.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.puds.controllers')
        .controller('PudCompleteController', PudCompleteController);

    PudCompleteController.$inject = ['$rootScope', '$scope', 'Authentication', 'Puds', 'Snackbar'];

    /**
     * @namespace PudCompleteController
     */
    function PudCompleteController($rootScope, $scope, Authentication, Puds, Snackbar) {
        var vm = this;
        vm.change = change;

        function change() {

            console.log('checkbox value: ' + vm.complete);

            //Puds.create(content, notification, priority, priority_int, duration, repeatType, repeat_int,
            //    vm.need_repeat, notifyWhen).then(completePudSuccessFn, completePudErrorFn);
            //
            //$rootScope.$broadcast('pud.created', {
            //    content: content,
            //    notification: notification,
            //    priority: priority,
            //    priority_int: priority_int,
            //    duration: duration,
            //    repeat: repeatType,
            //    repeat_int: repeat_int,
            //    need_repeat: vm.need_repeat,
            //    notify_when: notifyWhen,
            //    author: {
            //        username: Authentication.getAuthenticatedAccount().username
            //    }
            //});

            $scope.closeThisDialog();

            function completePudSuccessFn(data, status, headers, config) {
                Snackbar.show('Success! PUD completed');
            }

            function completePudErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('pud.completed.error');
                Snackbar.error(data.error);
            }


        }
    }
})();
