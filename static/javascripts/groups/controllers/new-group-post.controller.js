/**
 * NewPostController
 * @namespace kalendr.posts.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.groups.controllers')
        .controller('NewGroupPostController', NewGroupPostController);

    NewGroupPostController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Groups'];

    /**
     * @namespace NewPostController
     */
    function NewGroupPostController($rootScope, $scope, Authentication, Snackbar, Groups) {
        var vm = this;

        vm.submit = submit;

        /**
         * @name submit
         * @desc Create a new Post
         * @memberOf kalendr.posts.controllers.NewPostController
         */
        console.log(' username: Authentication.getAuthenticatedAccount().username' + Authentication.getAuthenticatedAccount().username);

        function submit() {
            var members_array = (vm.members).split(" ");
            if (vm.is_readonly === undefined) vm.is_readonly = false;

            Groups.create(vm.name, vm.members,
                Authentication.getAuthenticatedAccount().email, vm.is_readonly).then(createPostSuccessFn, createPostErrorFn);

            $rootScope.$broadcast('group.created', {
                name: vm.name,
                members: vm.members,
                //is_private: vm.is_readonly,
                owner: {
                    username: Authentication.getAuthenticatedAccount().username
                }
            });

            $scope.closeThisDialog();


            /**
             * @name createPostSuccessFn
             * @desc Show snackbar with success message
             */
            function createPostSuccessFn(data, status, headers, config) {
                Snackbar.show('Success! Group created.');
            }


            /**
             * @name createPostErrorFn
             * @desc Propogate error event and show snackbar with error message
             */
            function createPostErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('post.created.error');
                Snackbar.error(data.error);
            }
        }
    }
})();