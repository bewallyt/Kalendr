/**
 * AccountController
 * @namespace kalendr.accounts.controllers
 */
(function () {

    angular
        .module('kalendr.accounts.controllers')
        .controller('AccountController', AccountController);

    AccountController.$inject = ['$timeout', '$location', 'Authentication', '$routeParams', 'Posts', 'Puds',
        'Account', 'Snackbar', '$scope'];


    /**
     * @namespace AccountController
     */
    function AccountController($timeout, $location, Authentication, $routeParams, Posts, Puds,
                               Account, Snackbar, $scope) {

        var vm = this;
        instantiateAccordian();

        vm.addFollower = addFollower;
        vm.followerList = [];
        vm.hasFollowers = false;

        vm.groupList = [];
        vm.hasGroups = false;

        vm.groupName = null;
        vm.groupMembers = [];
        vm.selectedMember = null;
        vm.rule = null;
        vm.addMembers = addMembers;
        vm.addGroup = addGroup;
        //vm.isGroupComplete = (vm.groupName != null) && (vm.selectedMember != null) && (vm.rule != null);


        vm.isAuthenticated = Authentication.isAuthenticated();

        console.log('vm.isAuthenticated: ' + vm.isAuthenticated);
        vm.account = undefined;
        vm.posts = [];
        vm.puds = [];

        if (vm.isAuthenticated) activate();

        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf kalendr.accounts.controllers.AccountController
         */

        function activate() {

            var username = Authentication.getAuthenticatedAccount().username;
            vm.myUsername = username;

            var date = new Date();
            var num_month = date.getMonth();
            var month = findMonth(num_month);


            var num_day = date.getDay();
            var dayOfWeek = findDay(num_day);

            var homeDate = date;
            var homeWeek = date.getWeekNum();
            var homeDayOfWeek = dayOfWeek;
            var homeMonth = month;
            var homeGetDate = date.getDate();

            vm.date = dayOfWeek + ', ' + month + ' ' + date.getDate();
            if (vm.weekNum == null) vm.weekNum = homeWeek;

            Account.get(username).then(accountSuccessFn, accountErrorFn);
            Posts.getWeek(username, vm.weekNum).then(postsSuccessFn, postsErrorFn);
            Authentication.getUsers().then(usersSuccessFn);

            $scope.$on('post.created', function (event, post) {
                console.log('post.created: scope get week: ' + post.weekNum);

                num_month = post.start_time.getMonth();
                month = findMonth(num_month);

                vm.date = post.dayOfWeek + ', ' + month + ' ' + post.start_time.getDate();
                vm.weekNum = post.weekNum;

                Posts.getWeek(username, post.weekNum).then(postsSuccessFn, postsErrorFn);
                Posts.getWeek(username, post.weekNum).then(postsSuccessFn, postsErrorFn);
            });

            $scope.$on('post.created.error', function () {
                vm.posts.shift();
            });

            $scope.$on('post.getWeek', function (event, post) {
                console.log('scope get week: ' + post.weekNum);

                vm.weekNum = post.weekNum;
                num_month = post.date.getMonth();
                month = findMonth(num_month);

                num_day = post.date.getDay();
                dayOfWeek = findDay(num_day);

                date = post.date;

                vm.date = dayOfWeek + ', ' + month + ' ' + post.date.getDate();
                Posts.getWeek(username, post.weekNum).then(postsSuccessFn, postsErrorFn);
                Snackbar.show('Carried to week ' + vm.weekNum + ': ' + vm.date + '!');
            });

            $scope.$on('pud.created', function (event, pud) {
                console.log('printing content from account controller: '+pud.content);
                Puds.get(username).then(pudsSuccessFn, pudsErrorFn);
            });

            $scope.$on('pud.created.error', function () {
            });

            function accountSuccessFn(data, status, headers, config) {
                vm.account = data.data;
            }

            function accountErrorFn(data, status, headers, config) {
                $location.url('/');
                Snackbar.error('That user does not exist.');
            }

            function postsSuccessFn(data, status, headers, config) {
                console.log('post success: ');
                vm.posts = data.data;
            }

            function postsErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function pudsSuccessFn(data, status, headers, config) {
                console.log("puds success");
                // Not getting the newest pud.
                vm.puds = data.data;

                var i;
                for(i = 0; i < vm.puds.length; i++){
                    console.log(vm.puds[i].content);
                    console.log(vm.puds[i].priority_int);
                }
            }

            function pudsErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function usersSuccessFn(data, status, headers, config) {
                console.log('users success: ' + data.data);
                vm.users = data.data;
                vm.userArray = new Object();
                var i;
                for (i = 0; i < vm.users.length; i++) {
                    vm.userArray[i] = vm.users[i];
                }
                console.log('vm.users:');
                console.log(vm.users);
                //console.log('user array:');
                //console.log(vm.userArray);

            }

            vm.activate = function () {
                date = homeDate;

                vm.date = homeDayOfWeek + ', ' + homeMonth + ' ' + homeGetDate;
                vm.weekNum = homeWeek;
                Posts.getWeek(username, vm.weekNum).then(postsSuccessFn, postsErrorFn);
                Snackbar.show('Back to Today!');
            };

            vm.next = function () {
                if (vm.weekNum < 53) {
                    vm.weekNum = vm.weekNum + 1;
                    date.setDate(date.getDate() + 7);

                    num_month = date.getMonth();
                    month = findMonth(num_month);

                    num_day = date.getDay();
                    dayOfWeek = findDay(num_day);

                    vm.date = dayOfWeek + ', ' + month + ' ' + date.getDate();
                    Posts.getWeek(username, vm.weekNum).then(postsSuccessFn, postsErrorFn);

                }
            };

            vm.before = function () {
                if (vm.weekNum > 1) {
                    vm.weekNum = vm.weekNum - 1;
                    date.setDate(date.getDate() - 7);

                    num_month = date.getMonth();
                    month = findMonth(num_month);

                    num_day = date.getDay();
                    dayOfWeek = findDay(num_day);

                    vm.date = dayOfWeek + ', ' + month + ' ' + date.getDate();
                    Posts.getWeek(username, vm.weekNum).then(postsSuccessFn, postsErrorFn);
                }
            };
        }

        function instantiateAccordian() {
            vm.selectedUser = null;
            vm.oneAtATime = false;
            vm.status = {
                isFirstOpen: true,
                isFirstDisabled: false
            };

            //vm.addItem = function () {
            //    var newItemNo = vm.items.length + 1;
            //    vm.items.push('Item ' + newItemNo);
            //};
        }

        function addFollower() {
            vm.hasFollowers = true;
            // vm.followerList gets list of followers (groups with only 1 user -- flagged)
            vm.followerList.unshift(vm.selectedUser.originalObject.username);
            console.log('selected user:' + vm.selectedUser);
            console.log('selected title:' + vm.selectedUser.title);
            console.log('selected email:' + vm.selectedUser.email);
            console.log('selected user_object:' + vm.selectedUser.originalObject);
            console.log('selected username:' + vm.selectedUser.originalObject.username);
            console.log('selected username:' + vm.selectedUser.originalObject.email);

        }

        function addMembers() {
            vm.groupMembers.unshift(vm.selectedMember.originalObject.username);
        }

        function addGroup() {
            // Make group list a button with popup description
            // create API request
            vm.groupList.unshift(vm.groupName);
            vm.hasGroups = true;
            vm.groupName = null;
            vm.groupMembers = [];
            vm.selectedMember = null;
            vm.rule = null;
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
    };

    function findMonth(num_month) {
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

        return month;
    }

    function findDay(num_day) {
        var dayOfWeek;
        if (num_day == 0) dayOfWeek = 'Sunday';
        else if (num_day == 1) dayOfWeek = 'Monday';
        else if (num_day == 2) dayOfWeek = 'Tuesday';
        else if (num_day == 3) dayOfWeek = 'Wednesday';
        else if (num_day == 4) dayOfWeek = 'Thursday';
        else if (num_day == 5) dayOfWeek = 'Friday';
        else dayOfWeek = 'Saturday';

        return dayOfWeek;
    }


})
();
