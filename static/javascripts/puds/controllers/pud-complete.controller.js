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

            console.log('pud author username is: ' + vm.pud_author.username);
            console.log('pud id is: ' + vm.pud_id);
            console.log('checkbox value: ' + vm.complete);

            Puds.saveComplete(vm.pud_author.username, vm.pud_id, vm.complete).then(completePudSuccessFn, completePudErrorFn);

            $rootScope.$broadcast('pud.completed', {
                is_completed: vm.complete,
                id: vm.pud_id,
                username: Authentication.getAuthenticatedAccount().username
            });

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
