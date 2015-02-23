/**
 * AccountController
 * @namespace kalendr.accounts.controllers
 */
(function () {

    angular
        .module('kalendr.accounts.controllers')
        .controller('AccountController', AccountController);

    AccountController.$inject = ['$location', 'Authentication', 'Posts', 'Puds', 'Account', 'Snackbar', '$scope', 'Groups'];

    function AccountController($location, Authentication, Posts, Puds, Account, Snackbar, $scope, Groups) {

        var vm = this;
        instantiateAccordian();
        var username;

        vm.addFollower = addFollower;
        vm.followerList = [];
        vm.hasFollowers = false;

        vm.followingList = [];
        vm.isFollowing = false;

        vm.groupList = [];
        vm.hasGroups = false;

        vm.groupName = null;
        vm.groupMembers = [];
        var groupAccounts = [];
        vm.selectedMember = null;
        vm.rule = null;
        vm.addMembers = addMembers;
        vm.addGroup = addGroup;
        vm.groupNum = 0;
        //vm.groupClick = groupClick;
        var pud_post;


        vm.isAuthenticated = Authentication.isAuthenticated();

        console.log('vm.isAuthenticated: ' + vm.isAuthenticated);
        vm.account = undefined;
        vm.posts = [];
        vm.puds = [];

        if (vm.isAuthenticated) activate();

        function activate() {

            username = Authentication.getAuthenticatedAccount().username;
            console.log('current user: ' + username);
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
            Groups.get(username).then(groupSuccessFn, groupErrorFn);
            Groups.getFollowing(username).then(followingSuccessFn, followingErrorFn);
            Puds.get(username).then(pudsSuccessFn, pudsErrorFn);

            $scope.$on('post.created', function (event, post) {
                console.log('post.created: scope get week: ' + post.weekNum);

                num_month = post.start_time.getMonth();
                month = findMonth(num_month);

                vm.date = post.dayOfWeek + ', ' + month + ' ' + post.start_time.getDate();
                vm.weekNum = post.weekNum;

                if (post.pud_time) {
                    console.log('this event is for a pud!');
                    Posts.getWeek(username, post.weekNum).then(postIdSuccessFn, postIdErrorFn);
                } else {
                    Posts.getWeek(username, post.weekNum).then(postsSuccessFn, postsErrorFn);
                    Posts.getWeek(username, post.weekNum).then(postsSuccessFn, postsErrorFn);
                }
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
                vm.posts = data.data;
            }

            function postsErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function postIdSuccessFn(data, status, headers, config) {
                console.log('this is the returned data length: ' + data.data.length);
                console.log('this is the data head: ' + data.data[0].duration);
                console.log('this is the data tail: ' + data.data[data.data.length - 1].duration);
                console.log('this is the data tail id: ' + data.data[data.data.length - 1].id);
                pud_post = data.data[data.data.length - 1];
                Puds.get(username).then(pudTimeSuccessFn, pudTimeErrorFn);
            }

            function postIdErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function pudTimeSuccessFn(data, status, headers, config) {
                var time_prune = [];
                console.log("pud_post duration: " + pud_post.duration);
                console.log('pud_post id: ' + pud_post.id);
                data.data.sort(function (a, b) {
                    return b.duration - a.duration;
                });
                for (var s = 0; s < data.data.length; s++) {
                    console.log(data.data[s].content + " " + data.data[s].duration);
                    if (data.data[s].duration <= pud_post.duration) {
                        time_prune.push(data.data[s]);
                    }
                }
                time_prune.sort(function (a, b) {
                    return b.priority_int - a.priority_int;
                });
                //for (var i = 0; i < time_prune.length; i++) {
                //    console.log(time_prune[i].content + " " + time_prune[i].priority_int);
                //}
                if (time_prune.length != 0) {
                    Posts.savePost(username, pud_post.id, time_prune[0].content);
                } else {
                    Posts.savePost(username, pud_post.id, 'No Task Available');
                }
                //Posts.savePost(username, pud_post.id, time_prune[0].content);

                //Posts.getWeek(username, pud_post.weekNum).then(postsSuccessFn, postsErrorFn);
                //Posts.getWeek(username, pud_post.weekNum).then(postsSuccessFn, postsErrorFn);
            }

            function pudTimeErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function pudsSuccessFn(data, status, headers, config) {
                // Not getting the newest pud.
                vm.puds = data.data;
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

            }

            function groupSuccessFn(data, status, headers, config) {
                // Only adding groups that I am owner of here:
                if (data.data.length > 0) vm.hasGroups = true;

                var i;
                for (i = 0; i < data.data.length; i++) {
                    if (data.data[i].is_follow_group == false) {
                        if ($.inArray(data.data[i], vm.groupList) == -1) {
                            console.log('Groups I own: ' + data.data[i]);
                            vm.groupList.unshift(data.data[i]);
                            console.log(data.data[i]);
                        }
                    }
                    else {
                        vm.followerList.unshift(data.data[i].name);
                        vm.hasFollowers = true;
                    }


                }
            }

            function groupErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function followingSuccessFn(data, status, headers, config) {

                var i;
                for (i = 0; i < data.data.length; i++) {
                    console.log('is following group: ' + data.data[i].is_follow_group);
                    if (data.data[i].is_follow_group) {
                        vm.isFollowing = true;
                        if ($.inArray(data.data[i].owner.username, vm.followingList) == -1) {
                            vm.followingList.unshift(data.data[i].owner.username);
                        }
                    }
                    else {
                        vm.hasGroups = true;
                        console.log('Groups Im a member of: ' + data.data[i].name);
                        if ($.inArray(data.data[i].name, vm.groupList) == -1) {
                            vm.groupList.unshift(data.data[i]);
                        }
                    }

                }
            }

            function followingErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
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


        }

        function addFollower() {
            vm.hasFollowers = true;
            vm.followerList.unshift(vm.selectedUser.originalObject.username);
            var userAccount = [];
            userAccount.unshift(vm.selectedUser.originalObject);
            Groups.create(vm.selectedUser.originalObject.username, userAccount, Authentication.getAuthenticatedAccount(), true);
        }

        function addMembers() {
            vm.groupMembers.unshift(vm.selectedMember.originalObject.username);
            groupAccounts.unshift(vm.selectedMember.originalObject);
        }

        function addGroup() {

            Groups.create(vm.groupName, groupAccounts, Authentication.getAuthenticatedAccount(), false);
            Groups.get(username).then(groupSuccessFnTwo);
            vm.hasGroups = true;
            vm.groupName = null;
            vm.groupMembers = [];
            groupAccounts = [];
            vm.selectedMember = null;
            vm.rule = null;
        }

        function groupSuccessFnTwo(data, status, headers, config) {
            // Only adding groups that I am owner of here:
            if (data.data.length > 0) vm.hasGroups = true;
            vm.groupList = [];

            var i;
            for (i = 0; i < data.data.length; i++) {
                if (data.data[i].is_follow_group == false) {
                    if ($.inArray(data.data[i], vm.groupList) == -1) {
                        console.log('Groups I own: ' + data.data[i]);
                        vm.groupList.unshift(data.data[i]);
                        console.log(data.data[i]);
                    }
                }
            }
        }

        //function groupClick(group) {
        //    $rootScope.$broadcast('group.clicked', {
        //        created_at: group.created_at
        //    });
        //}


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
