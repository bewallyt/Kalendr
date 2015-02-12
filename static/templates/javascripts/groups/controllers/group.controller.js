/**
 * GroupController
 * @namespace kalendr.accounts.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.groups.controllers')
        .controller('GroupController', GroupController);

    GroupController.$inject = ['$location', 'Authentication', '$routeParams', 'Groups', 'Account', 'Snackbar', '$scope'];

    /**
     * @namespace GroupController
     */
    function GroupController($location, Authentication, $routeParams, Groups, Account, Snackbar, $scope) {
        var vm = this;

        vm.isAuthenticated = Authentication.isAuthenticated();

        console.log('vm.isAuthenticated: ' + vm.isAuthenticated);
        vm.account = undefined;
        vm.groups = [];


        if (vm.isAuthenticated) activate();

        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf kalendr.accounts.controllers.GroupController
         */
        function activate() {
            var username = $routeParams.username.substr(1);
            console.log('in group username :'  + username);

            Account.get(username).then(accountSuccessFn, accountErrorFn);
            Groups.get(username).then(postsSuccessFn, postsErrorFn);

            $scope.$on('group.created', function (event, group) {
                Groups.get(username).then(postsSuccessFn, postsErrorFn);
                vm.groups.unshift(group);
                Groups.get(username).then(postsSuccessFn, postsErrorFn);
            });

            $scope.$on('group.created.error', function () {
                vm.groups.shift();
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
                vm.groups = data.data;
                console.log('post success: ' + data.data);
                console.log('(vm.groups)post success: ' + vm.groups.name);
                //
                //  var i;
                //  for(i = 0; i < vm.posts.length; i++){
                //      console.log(vm.posts[i].content);
                //  }

            }


            /**
             * @name postsErrorFn
             * @desc Show error snackbar
             */
            function postsErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }
        }
    }
})();
