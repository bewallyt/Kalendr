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
         * @memberOf kalendr.accounts.controllers.AccountController
         */
        function activate() {

            var username = $routeParams.username.substr(1);

            Account.get(username).then(accountSuccessFn, accountErrorFn);
            Posts.getWeek(username, null).then(postsSuccessFn, postsErrorFn);
            Authentication.getUsers().then(usersSuccessFn);

            var now = new Date();
            var dayOfWeek;

            var num_day = now.getDay();

            if (num_day == 0) dayOfWeek = 'Sunday';
            else if (num_day == 1) dayOfWeek = 'Monday';
            else if (num_day == 2) dayOfWeek = 'Tuesday';
            else if (num_day == 3) dayOfWeek = 'Wednesday';
            else if (num_day == 4) dayOfWeek = 'Thursday';
            else if (num_day == 5) dayOfWeek = 'Friday';
            else dayOfWeek = 'Saturday';



            var date = Date().substring(3, 10);
            vm.date = dayOfWeek + ', ' + date;
            if(vm.weekNum == null) vm.weekNum = getWeekNum(y2k(now.getYear()),now.getMonth(),now.getDate());

            $scope.$on('post.created', function (event, post) {
                console.log('post.created: scope get week' + post.weekNum);
                Posts.getWeek(username, post.weekNum).then(postsSuccessFn, postsErrorFn);
                vm.posts.unshift(post);
                Posts.getWeek(username, post.weekNum).then(postsSuccessFn, postsErrorFn);
            });

            $scope.$on('post.created.error', function () {
                vm.posts.shift();
            });

            $scope.$on('post.getWeek', function (event, post) {
                console.log('scope get week' + post.weekNum);
                Posts.getWeek(username, post.weekNum);
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

                if(vm.posts[0].week_num != null) vm.weekNum = vm.posts[0].week_num;
                var i;
                for (i = 0; i < vm.posts.length; i++) {
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
                for (i = 0; i < vm.users.length; i++) {
                    console.log(vm.users[i].username);
                }

            }
        }
    }

    function getWeekNum(year, month, day) {
        var when = new Date(year, month, day);
        var newYear = new Date(year, 0, 1);
        var offset = 7 + 1 - newYear.getDay();
        if (offset == 8) offset = 1;
        var daynum = ((Date.UTC(y2k(year), when.getMonth(), when.getDate(), 0, 0, 0) - Date.UTC(y2k(year), 0, 1, 0, 0, 0)) / 1000 / 60 / 60 / 24) + 1;
        var weeknum = Math.floor((daynum - offset + 7) / 7);
        if (weeknum == 0) {
            year--;
            var prevNewYear = new Date(year, 0, 1);
            var prevOffset = 7 + 1 - prevNewYear.getDay();
            if (prevOffset == 2 || prevOffset == 8) weeknum = 53; else weeknum = 52;
        }
        return weeknum;
    }

    function y2k(number) { return (number < 1000) ? number + 1900 : number; }
})();
