/**
 * PostDescriptionController
 * @namespace kalendr.posts.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.posts.controllers')
        .controller('PostDescriptionController', PostDescriptionController);

    PostDescriptionController.$inject = ['$timeout', '$scope', 'Access'];

    /**
     * @namespace PostDescriptionController
     */
    function PostDescriptionController($timeout, $scope, Access) {
        var vm = this;

        vm.columns = [];

        vm.init = init;

        vm.hasReponses = false;
        vm.hasConfirmedGroups = false;
        vm.hasRemovedGroups = false;
        vm.hasDeclinedGroups = false;
        vm.hasNoRespGroups = false;

        function init(id) {

            vm.postId = id;

            console.log("vm.postId");
            console.log(vm.postId);
            Access.getConfirmedResponses(vm.postId, 'CONFIRM').then(successConfirmedFn, errorFn);
            Access.getRemovedResponses(vm.postId, 'REMOVED').then(successRemovedFn, errorFn);
            Access.getDeclinedResponses(vm.postId, 'DECLINE').then(successDeclinedFn, errorFn);
            Access.getNoResponses(vm.postId, 'NO_RESP').then(successNoFn, errorFn);

            console.log('after get calls');
            console.log('has response: ' + vm.hasResponse);
            console.log(vm.noRespGroups);


            function successConfirmedFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.hasConfirmedGroups = true;
                    vm.hasReponses = true;
                }
                console.log('confirmed:' + data.data);
                var i;
                for (i = 0; i < data.data.length; i++) {
                    console.log(data.data[i].name);
                }
                vm.confirmedGroups = data.data;
            }


            function successRemovedFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.hasRemovedGroups = true;
                    vm.hasReponses = true;
                }
                console.log('removed:' + data.data);
                vm.removedGroups = data.data;
            }


            function successDeclinedFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.hasDeclinedGroups = true;
                    vm.hasReponses = true;
                }
                console.log('declined:' + data.data);
                vm.declinedGroups = data.data;
            }

            function successNoFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    console.log(data.data.length);
                    vm.hasNoRespGroups = true;
                    vm.hasReponses = true;
                }
                console.log('no response:' + data.data);
                vm.noRespGroups = data.data;
            }

            function errorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

        }


    }
})();
