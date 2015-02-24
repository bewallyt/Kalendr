/**
 * PostDescriptionController
 * @namespace kalendr.posts.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.posts.controllers')
        .controller('PostDescriptionController', PostDescriptionController);

    PostDescriptionController.$inject = ['$timeout', '$scope'];

    /**
     * @namespace PostDescriptionController
     */
    function PostDescriptionController($timeout, $scope) {
        var vm = this;

        vm.columns = [];

        activate();

        function activate() {

        }
    }
})();
