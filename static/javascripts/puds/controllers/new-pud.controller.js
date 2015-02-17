/**
 * NewPudController
 * @namespace kalendr.puds.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.puds.controllers')
        .controller('NewPudController', NewPudController);

    NewPudController.$inject = ['$scope', 'Authentication', 'Puds', 'Snackbar'];

    /**
     * @namespace NewPudController
     */
    function NewPudController($scope, Authentication, Puds, Snackbar) {
        var vm = this;
        vm.submit = submit;


        function submit() {
            var content = vm.content;
            var priority = vm.priority;
            var duration = parseInt(vm.duration);
            var isRepeating = vm.is_repeating;
            var repeatType = vm.repeat;
            var notification = vm.notification;
            var notifyWhen = vm.notify_when;

            Puds.create(content, priority, duration, isRepeating, repeatType,
                notification, notifyWhen).then(createPudSuccessFn, createPudErrorFn);

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
