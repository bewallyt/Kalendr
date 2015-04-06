/**
 * EmailController
 * @namespace kalendr.email.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.email.controllers')
        .controller('EmailController', EmailController);

    EmailController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Email'];


    /**
     * @namespace EnmasseController
     */
    function EmailController($rootScope, $scope, Authentication, Snackbar, Email) {
        var vm = this;
        vm.submit = submit;

        function submit() {
            var format;
            if (vm.email_type == 'PDF') {
                format = 1;
            } else {
                format = 0;
            }
            Email.create(vm.start_date, vm.end_date, format);//.then(emailSuccess, emailError);

            $scope.closeThisDialog();

            function emailSuccess(data, status, headers, config) {
                Snackbar.show('Success! Email sent');
            }

            function emailError(data, status, headers, config) {
                Snackbar.error(data.error);
            }

        }
    }
})
();
