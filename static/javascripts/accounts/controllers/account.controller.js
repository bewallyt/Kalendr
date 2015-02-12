/**
 * AccountController
 * @namespace kalendr.accounts.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.accounts.controllers')
        .controller('AccountController', AccountController);

    AccountController.$inject = ['$timeout', '$location', 'Authentication', '$routeParams', 'Posts', 'Account', 'Snackbar', '$scope'];

    /**
     * @namespace AccountController
     */
    function AccountController($timeout, $location, Authentication, $routeParams, Posts, Account, Snackbar, $scope) {
        var vm = this;

        vm.isAuthenticated = Authentication.isAuthenticated();

        console.log('vm.isAuthenticated: ' + vm.isAuthenticated);
        vm.account = undefined;
        vm.posts = [];


        if (vm.isAuthenticated) activate();

        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf thinkster.accounts.controllers.AccountController
         */
        function activate() {
            var username = $routeParams.username.substr(1);

            Account.get(username).then(accountSuccessFn, accountErrorFn);
            Posts.get(username).then(postsSuccessFn, postsErrorFn);
            Authentication.getUsers().then(usersSuccessFn);

            $scope.$on('post.created', function (event, post) {
                Posts.get(username).then(postsSuccessFn, postsErrorFn);
                vm.posts.unshift(post);
                Posts.get(username).then(postsSuccessFn, postsErrorFn);
            });

            $scope.$on('post.created.error', function () {
                vm.posts.shift();
            });

            /**
             * @name accountSuccessAccount
             * @desc Update `account` on viewmodel
             */
            function accountSuccessFn(data, status, headers, config) {
                vm.account = data.data;
            }


            /**
             * @name accountErrorFn
             * @desc Redirect to index and show error Snackbar
             */
            function accountErrorFn(data, status, headers, config) {
                $location.url('/');
                Snackbar.error('That user does not exist.');
            }


            /**
             * @name postsSucessFn
             * @desc Update `posts` on viewmodel
             */
            function postsSuccessFn(data, status, headers, config) {
                              console.log('post success: ');
                vm.posts = data.data;

                  var i;
                  for(i = 0; i < vm.posts.length; i++){
                      console.log(vm.posts[i].content);
                  }

            }


            /**
             * @name postsErrorFn
             * @desc Show error snackbar
             */
            function postsErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function usersSuccessFn(data, status, headers, config) {
                console.log('users success: ' + data.data);
                vm.users = data.data;

                  var i;
                  for(i = 0; i < vm.users.length; i++){
                      console.log(vm.users[i].username);
                  }

            }
        }
    }
})();
