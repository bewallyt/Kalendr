/**
 * EnmasseController
 * @namespace kalendr.enmasse.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.enmasse.controllers')
        .controller('EnmasseController', EnmasseController);

    EnmasseController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Posts', 'Access'];


    /**
     * @namespace EnmasseController
     */
    function EnmasseController($rootScope, $scope, Authentication, Snackbar, Posts, Access) {
        var vm = this;
        vm.submit = submit;
        vm.check = check;
        vm.lineNumber;

        function check(event, keyCode) {
            //console.log(keyCode); *works
            var textArea = event.target;
            if (keyCode == 13) {
                vm.lineNumber = textArea.value.substr(0, textArea.selectionStart).split("\n").length;
                console.log("line number: " + vm.lineNumber);
            }
            //if (keyCode==13) {
            //console.log(vm.text); *works for pulling all text in textarea, but need to pull the previous line!
            //validate();
            //}
        }

        //function check(keyCode) {
        //    console.log(vm.lineNumber);
        //}

        function submit() { //called when all the lines are validated and user clicks submit
        }
    }
})();
