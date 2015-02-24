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

            Puds.saveComplete(vm.pud_author, vm.pud_id, vm.complete);

            //$rootScope.$broadcast('pud.completed', {
            //    id: vm.pud_id
            //});
            //
            //$scope.closeThisDialog();
            //
            //function completePudSuccessFn(data, status, headers, config) {
            //    Snackbar.show('Success! PUD completed');
            //}
            //
            //function completePudErrorFn(data, status, headers, config) {
            //    $rootScope.$broadcast('pud.completed.error');
            //    Snackbar.error(data.error);
            //}


        }
    }
})();
