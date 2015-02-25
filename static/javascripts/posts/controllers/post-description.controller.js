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

        function init(id) {

            vm.hasReponses = false;
            vm.hasConfirmedGroups = false;
            vm.hasRemovedGroups = false;
            vm.hasDeclinedGroups = false;
            vm.hasNoRespGroups = false;
            vm.postId = id;
            console.log(vm.postId);

            Access.getConfirmedResponses(vm.postId).then(successConfirmedFn, errorFn);
            Access.getRemovedResponses(vm.postId).then(successRemovedFn, errorFn);
            Access.getDeclinedResponses(vm.postId).then(successDeclinedFn, errorFn);
            Access.getNoResponses(vm.postId).then(successNoFn, errorFn);

            function successConfirmedFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.hasConfirmedGroups = true;
                    vm.hasReponses = true;
                }
                vm.confirmedGroups = data.data;
            }


            function successRemovedFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.hasRemovedGroups = true;
                    vm.hasReponses = true;
                }
                vm.removedGroups = data.data;
            }


            function successDeclinedFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.hasDeclinedGroups = true;
                    vm.hasReponses = true;
                }
                vm.declinedGroups = data.data;
            }

            function successNoFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.hasNoRespGroups = true;
                    vm.hasReponses = true;
                }
                vm.noRespGroups = data.data;
            }

            function errorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

        }


    }
})();
