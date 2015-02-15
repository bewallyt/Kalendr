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

        vm.activate = function () {
            vm.weekNum = null;
            activate();
            Snackbar.show('Back to Today!');
        };
        function activate() {

            var username = $routeParams.username.substr(1);
            console.log('username account.html: ' + username);


            var now = new Date();
            var num_month = now.getMonth();
            var month;

            if (num_month == 0) month = 'Jan';
            else if (num_month == 1) month = 'Feb';
            else if (num_month == 2) month = 'March';
            else if (num_month == 3) month = 'April';
            else if (num_month == 4) month = 'May';
            else if (num_month == 5) month = 'June';
            else if (num_month == 6) month = 'July';
            else if (num_month == 7) month = 'Aug';
            else if (num_month == 8) month = 'Sept';
            else if (num_month == 9) month = 'Oct';
            else if (num_month == 10) month = 'Nov';
            else month = 'Dec';

            var dayOfWeek;

            var num_day = now.getDay();

            if (num_day == 0) dayOfWeek = 'Sunday';
            else if (num_day == 1) dayOfWeek = 'Monday';
            else if (num_day == 2) dayOfWeek = 'Tuesday';
            else if (num_day == 3) dayOfWeek = 'Wednesday';
            else if (num_day == 4) dayOfWeek = 'Thursday';
            else if (num_day == 5) dayOfWeek = 'Friday';
            else dayOfWeek = 'Saturday';


            var homeDate = dayOfWeek + ', ' + month + ' ' + now.getDate();
            vm.date = homeDate;
            if (vm.weekNum == null) vm.weekNum = now.getWeekNum();

            Account.get(username).then(accountSuccessFn, accountErrorFn);
            Posts.getWeek(username, vm.weekNum).then(postsSuccessFn, postsErrorFn);
            Authentication.getUsers().then(usersSuccessFn);

            $scope.$on('post.created', function (event, post) {
                console.log('post.created: scope get week: ' + post.weekNum);

                var num_month = post.start_time.getMonth();
                var month;

                if (num_month == 0) month = 'Jan';
                else if (num_month == 1) month = 'Feb';
                else if (num_month == 2) month = 'March';
                else if (num_month == 3) month = 'April';
                else if (num_month == 4) month = 'May';
                else if (num_month == 5) month = 'June';
                else if (num_month == 6) month = 'July';
                else if (num_month == 7) month = 'Aug';
                else if (num_month == 8) month = 'Sept';
                else if (num_month == 9) month = 'Oct';
                else if (num_month == 10) month = 'Nov';
                else month = 'Dec';

                vm.date = post.dayOfWeek + ', ' + month + ' ' + post.start_time.getDate();
                vm.weekNum = post.weekNum;

                Posts.getWeek(username, post.weekNum).then(postsSuccessFn, postsErrorFn);
                vm.posts.unshift(post);
                Posts.getWeek(username, post.weekNum).then(postsSuccessFn, postsErrorFn);
            });

            $scope.$on('post.created.error', function () {
                vm.posts.shift();
            });

            $scope.$on('post.getWeek', function (event, post) {
                console.log('scope get week: ' + post.weekNum);

                vm.weekNum = post.weekNum;
                var num_month = post.date.getMonth();
                var month;
                num_day = post.date.getDay();
                var date = post.date.getDate();

                if (num_day == 0) dayOfWeek = 'Sunday';
                else if (num_day == 1) dayOfWeek = 'Monday';
                else if (num_day == 2) dayOfWeek = 'Tuesday';
                else if (num_day == 3) dayOfWeek = 'Wednesday';
                else if (num_day == 4) dayOfWeek = 'Thursday';
                else if (num_day == 5) dayOfWeek = 'Friday';
                else dayOfWeek = 'Saturday';

                if (num_month == 0) month = 'Jan';
                else if (num_month == 1) month = 'Feb';
                else if (num_month == 2) month = 'March';
                else if (num_month == 3) month = 'April';
                else if (num_month == 4) month = 'May';
                else if (num_month == 5) month = 'June';
                else if (num_month == 6) month = 'July';
                else if (num_month == 7) month = 'Aug';
                else if (num_month == 8) month = 'Sept';
                else if (num_month == 9) month = 'Oct';
                else if (num_month == 10) month = 'Nov';
                else month = 'Dec';

                vm.date = dayOfWeek + ', ' + month + ' ' + date.toString();
                Posts.getWeek(username, post.weekNum).then(postsSuccessFn, postsErrorFn);
                Snackbar.show('Carried to week ' + vm.weekNum +': ' + vm.date +  '!');
            });

            $scope.$on('post.goHome', function () {
                vm.date = homeDate;
                vm.weekNum = now.getWeekNum();
                Posts.getWeek(username, vm.weekNum).then(postsSuccessFn, postsErrorFn);
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

                if (vm.posts.length > 0) {
                    if (vm.posts[0].week_num != null) vm.weekNum = vm.posts[0].week_num;
                }
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

    Date.prototype.getWeekNum = function () {
        var determinedate = new Date();
        determinedate.setFullYear(this.getFullYear(), this.getMonth(), this.getDate());
        var D = determinedate.getDay();
        var addForSunday = 0;
        if (D == 0) {
            D = 7;
            addForSunday = 1
        }
        determinedate.setDate(determinedate.getDate() + (4 - D));
        var YN = determinedate.getFullYear();
        var ZBDoCY = Math.floor((determinedate.getTime() - new Date(YN, 0, 1, -6)) / 86400000);
        var WN = 1 + Math.floor(ZBDoCY / 7) + addForSunday;
        return WN;
    }
})();
