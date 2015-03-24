/**
 * AccountController
 * @namespace kalendr.accounts.controllers
 */
(function () {

    angular
        .module('kalendr.accounts.controllers')
        .controller('AccountController', AccountController);

    AccountController.$inject = ['$location', 'Authentication', 'Posts', 'Puds', 'Account', 'Snackbar', '$scope', 'Groups', 'Access'];

    function AccountController($location, Authentication, Posts, Puds, Account, Snackbar, $scope, Groups, Access) {

        var vm = this;
        instantiateAccordian();
        var username;

        vm.account = undefined;
        vm.posts = [];
        vm.puds = [];

        vm.isAuthenticated = Authentication.isAuthenticated();

        if (vm.isAuthenticated) activate();

        // Benson: remove error fn

        function activate() {
            var date = new Date();
            console.log('current day' + date.getDay());

            /**
             * Social Bar Variables Instantiated Below
             */

                // For Displaying Followers

            vm.addFollower = addFollower;
            vm.followerList = [];
            vm.hasFollowers = false;

            // For Displaying Following

            vm.followingList = [];
            vm.isFollowing = false;

            // For Displaying Groups

            vm.hasGroups = false;
            vm.hasOwnedGroups = false;
            vm.hasMemberOfGroups = false;
            vm.ownedGroups = [];
            vm.memberOfGroups = [];

            // For Creating Groups

            vm.groupName = null;
            vm.groupMembers = [];
            var groupAccounts = [];
            vm.selectedMember = null;
            var pud_post;
            vm.rule = null;
            vm.addMembers = addMembers;
            vm.addGroup = addGroup;
            var groupNum = 0;

            // For Passing Shareable into Event Creation

            vm.shareable = [];
            vm.share_following = [];

            // For Displaying Notifications

            vm.hasNotifications = false;
            vm.newNotifications = null;
            vm.numNotifications = 0;
            vm.showNotificationsTab = showNotificationsTab;

            // For Responding to Notifications

            vm.response = null;
            vm.emailNotification = false;
            vm.emailNotifyWhen = null;
            vm.replyNotification = replyNotification;
            vm.currentNotificationPostId = 0;

            // Closing Accords
            vm.closeAccords = closeAccords;

            // Show Follower Events on Kalendr
            vm.appendFollowingEvents = appendFollowingEvents;
            clickedFollowingArray = [];
            clickedFollowingPosts = [];
            followerDict = new Object();

            // Benson to Prit:
            vm.followingListOwners = [];


            username = Authentication.getAuthenticatedAccount().username;
            vm.myUsername = username;

            var date = new Date();
            var num_month = date.getMonth();
            var month = findMonth(num_month);
            var num_day = date.getDay();
            var dayOfWeek = findDay(num_day);
            var homeDate = date;
            var homeWeek;

            // Ugly Sunday Bug Fix
            var addForSunday = 0;
            if (dayOfWeek == 'Sunday')  addForSunday = 1;
            var date = new Date();
            console.log('calculate week: ' + date.getWeekNum() + addForSunday);
            homeWeek = date.getWeekNum() + addForSunday;

            var homeDayOfWeek = dayOfWeek;
            var homeMonth = month;
            var homeGetDate = date.getDate();

            vm.date = dayOfWeek + ', ' + month + ' ' + date.getDate();
            if (vm.weekNum == null) vm.weekNum = homeWeek;

            Account.get(username).then(accountSuccessFn, accountErrorFn);
            Posts.getWeek(username, vm.weekNum).then(postsSuccessFn, postsErrorFn);
            Authentication.getUsers().then(usersSuccessFn);

            // Groups I own
            Groups.getNonFollowerOwnedGroups(username).then(groupOwnerSuccessFn, groupOwnerErrorFn);
            Groups.getFollowers(username).then(followerSuccessFn, followerErrorFn);
            // Groups I don't own
            Groups.getMemberGroups(username).then(groupMemberSuccessFn, groupMemberErrorFn);
            Groups.getFollowing(username).then(followingSuccessFn, followingErrorFn);
            Puds.get(username).then(pudsSuccessFn, pudsErrorFn);

            // To update shareable list
            Groups.get(username).then(groupsSuccessFn, groupsErrorFn);
            Groups.getFollowing(username).then(shareFollowingSFn, followingErrorFn);

            // Fetch Notifications
            Posts.getNotificationPosts().then(notificationSuccessFn, notificationErrorFn);


            $scope.$on('post.created', function (event, post) {

                num_month = post.start_time.getMonth();
                month = findMonth(num_month);

                vm.date = post.dayOfWeek + ', ' + month + ' ' + post.start_time.getDate();
                vm.weekNum = post.weekNum;

                if (post.pud_time) {
                    Posts.getWeek(username, post.weekNum).then(postIdSuccessFn, postIdErrorFn);
                    Posts.getWeek(username, post.weekNum).then(postIdSuccessFn, postIdErrorFn);
                } else {
                    Posts.getWeek(username, post.weekNum).then(postsSuccessFn, postsErrorFn);
                    Posts.getWeek(username, post.weekNum).then(postsSuccessFn, postsErrorFn);
                }
            });

            $scope.$on('signup.created', function (event, post) {

                num_month = post.firstMeetingMonth;
                month = findMonth(num_month);

                vm.date = post.dayOfWeek + ', ' + month + ' ' + post.firstMeetingDate;
                vm.weekNum = post.firstMeetingWeek;

                console.log('weeknumber passed: ' + post.firstMeetingWeek);

                Posts.getWeek(username, post.firstMeetingWeek).then(postsSuccessFn, postsErrorFn);
                Posts.getWeek(username, post.firstMeetingWeek).then(postsSuccessFn, postsErrorFn);
            });

            $scope.$on('post.created.error', function () {
                vm.posts.shift();
            });

            $scope.$on('post.getWeek', function (event, post) {
                // Hack fetched shared following posts in here

                vm.weekNum = post.weekNum;
                num_month = post.date.getMonth();
                month = findMonth(num_month);

                num_day = post.date.getDay();
                dayOfWeek = findDay(num_day);

                if (dayOfWeek == 'Sunday') vm.weekNum++;

                date = post.date;

                vm.date = dayOfWeek + ', ' + month + ' ' + post.date.getDate();
                Posts.getWeek(username, vm.weekNum).then(postsSuccessFn, postsErrorFn);
                Snackbar.show('Carried to week ' + vm.weekNum + ': ' + vm.date + '!');
            });
            //fix double get call
            $scope.$on('pud.created', function (event, pud) {
                Puds.get(username).then(pudsSuccessFn, pudsErrorFn);
                Puds.get(username).then(pudsSuccessFn, pudsErrorFn);
            });

            $scope.$on('pud.completed', function (event, pud) {
                console.log('received pud broadcast');
                console.log('account username: ' + pud.username);
                console.log('pud id after broadcast: ' + pud.id);
                console.log('pud completed?: ' + pud.is_completed);
                Posts.pudPostUpdate(pud.username, pud.id).then(pudCompleteSuccessFn, pudCompleteErrorFn);
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
                var i;
                sharedWeeksPosts = [];
                for (i = 0; i < clickedFollowingPosts.length; i++) {
                    if (clickedFollowingPosts[i].week_num == vm.weekNum) {
                        sharedWeeksPosts.push(clickedFollowingPosts[i]);
                    }
                }
                vm.posts = data.data.concat(sharedWeeksPosts);
            }

            function postsSuccessFn2(data, status, headers, config) {
                vm.posts = data.data.concat(clickedFollowingPosts);
            }

            function postsErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            /**
             * @name postIdSuccessFn
             * @desc Assign the pud with highest priority fitting into the post duration, if the highest priority is
             * shared amongst multiple puds, then the oldest pud is assigned
             * @param data, status, headers, config
             * @calls Puds.get
             */

            function postIdSuccessFn(data, status, headers, config) {
                data.data.sort(function (a, b) {
                    return b.id - a.id;
                });
                for (var s = 0; s < data.data.length; s++) {
                    console.log(data.data[s].id + ' id');
                }
                pud_post = data.data[0];
                console.log(pud_post.id + ' post_pud id');
                Posts.savePost(username, pud_post.id, pud_post.week_num).then(postsSuccessFn, postsErrorFn);
                Posts.savePost(username, pud_post.id, pud_post.week_num).then(postsSuccessFn, postsErrorFn).then(Puds.get(username).then(pudsSuccessFn, pudsErrorFn));
                //Puds.get(username).then(pudsSuccessFn, pudsErrorFn);
            }

            function pudCompleteSuccessFn(data, status, headers, config) {
                Posts.getWeek(username, vm.weekNum).then(postsSuccessFn, postsErrorFn).then(Puds.get(username).then(pudsSuccessFn, pudsErrorFn));
            }

            function pudCompleteErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function postIdErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function pudsSuccessFn(data, status, headers, config) {
                vm.puds = data.data;
            }

            function pudsErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function usersSuccessFn(data, status, headers, config) {
                vm.users = data.data;
                vm.userArray = new Object();
                var i;
                for (i = 0; i < vm.users.length; i++) {
                    vm.userArray[i] = vm.users[i];
                    followerDict[vm.users[i].username] = false;
                }

            }

            function groupOwnerSuccessFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.hasGroups = true;
                    vm.hasOwnedGroups = true;
                }
                vm.ownedGroups = data.data;
                Groups.get(username).then(groupsSuccessFn, groupsErrorFn);

            }

            function groupOwnerErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function groupMemberSuccessFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.hasMemberOfGroups = true;
                    vm.hasGroups = true;
                }
                vm.memberOfGroups = data.data;
            }

            function groupMemberErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function followingSuccessFn(data, status, headers, config) {
                vm.followingList = data.data;
                var i;

                for (i = 0; i < data.data.length; i++) {
                    vm.followingListOwners.push(vm.followingList[i].owner);
                }
                if (data.data.length > 0) vm.isFollowing = true;
            }

            function shareFollowingSFn(data, status, headers, config) {
                vm.share_following = data.data;
            }

            function followingErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function followerSuccessFn(data, status, headers, config) {
                vm.followerList = data.data;
                if (data.data.length > 0) vm.hasFollowers = true;

                var i;
                for (i = 0; i < data.data.length; i++) {
                    followerDict[data.data[i].name] = true;
                }
                Groups.get(username).then(groupsSuccessFn, groupsErrorFn);
            }

            function followerErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function addFollower() {
                vm.hasFollowers = true;
                vm.followerList.unshift(vm.selectedUser.originalObject);
                followerDict[vm.selectedUser.originalObject.username] = true;
                Groups.create(vm.selectedUser.originalObject.username, [vm.selectedUser.originalObject], Authentication.getAuthenticatedAccount(), true).then(FollowerCreateSuccessFn, FollowerCreateErrorFn);
            }

            function addMembers() {
                vm.groupMembers.unshift(vm.selectedMember.originalObject.username);
                groupAccounts.unshift(vm.selectedMember.originalObject);
            }

            function addGroup() {
                var i;
                for (i = 0; i < groupAccounts.length; i++) {
                    if (!followerDict[groupAccounts[i].username]) {
                        followerDict[groupAccounts[i].username] = true;
                        vm.followerList.unshift(groupAccounts[i]);
                        Groups.create(groupAccounts[i].username, [groupAccounts[i]], Authentication.getAuthenticatedAccount(), true).then(FollowerCreateSuccessFn, FollowerCreateErrorFn);
                    }
                }
                Groups.create(vm.groupName, groupAccounts, Authentication.getAuthenticatedAccount(), false).then(groupCreateSuccessFn, groupCreateErrorFn);
            }

            function groupCreateSuccessFn() {
                Snackbar.show('Group Created!');
                Groups.getNonFollowerOwnedGroups(username).then(groupOwnerSuccessFn, groupOwnerErrorFn);

                // Reset Group Field data
                vm.hasGroups = true;
                vm.groupName = null;
                vm.groupMembers = [];
                groupAccounts = [];
                vm.selectedMember = null;
                vm.rule = null;
            }

            function groupCreateErrorFn() {
                Snackbar.error('Group Creation Error');
            }

            function FollowerCreateSuccessFn() {
                Snackbar.show('Follower Added!');
                Groups.getFollowers(username).then(followerSuccessFn, followerErrorFn);

            }


            function FollowerCreateErrorFn() {
                Snackbar.error('Follower Addition Error');
            }

            function groupsSuccessFn(data, status, headers, config) {
                vm.shareable = data.data;
            }

            function groupsErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function notificationSuccessFn(data, status, headers, config) {
                if (data.data.length > 0) vm.hasNotifications = true;
                else vm.hasNotifications = false;


                vm.newNotifications = data.data;
                vm.numNotifications = data.data.length;

                var i;
                console.log('notifications: ');
                console.log(vm.numNotifications);
                for (i = 0; i < vm.numNotifications; i++) {
                    console.log(vm.newNotifications[i]);
                }
            }

            function notificationErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function replyEventSuccessFn() {
                Snackbar.show('Replied Event Invitation!');
                Posts.getNotificationPosts().then(notificationSuccessFn, notificationErrorFn);

            }

            function replyEventErrorFn() {
                Snackbar.error('Event Reply Error');
            }

            function sharedFollowingSuccessFn(data, status, headers, config) {
                clickedFollowingPosts = clickedFollowingPosts.concat(data.data);

                Posts.getWeek(username, vm.weekNum).then(postsSuccessFn, postsErrorFn);
            }

            function sharedFollowingErrorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }

            function replyNotification() {
                Access.reply(vm.currentNotificationPostId, vm.response, vm.emailNotification, vm.emailNotifyWhen).then(replyEventSuccessFn, replyEventErrorFn);
                $scope.closeThisDialog();
            }

            function showNotificationsTab() {
                vm.isThirdOpen = true;
            }

            function closeAccords() {
                vm.open = false;
                vm.isFirstOpen = false;
                vm.isSecondOpen = false;
                vm.isThirdOpen = false;
            }

            function appendFollowingEvents(isClicked, followingUsername) {

                if (isClicked == 0) {
                    clickedFollowingArray.push(followingUsername);
                    Posts.getSharedFollowing(followingUsername).then(sharedFollowingSuccessFn, sharedFollowingErrorFn);
                }
                // Remove Users
                else {
                    var i;
                    for (i = 0; i < clickedFollowingArray.length; i++) {
                        if (clickedFollowingArray[i] == followingUsername) {
                            clickedFollowingArray.splice(i, 1);
                            var j;
                            for (j = 0; j < vm.posts.length; j++) {
                                if (vm.posts[j].author.username == followingUsername) {
                                    vm.posts.splice(j, 1);
                                    j--;
                                }
                            }
                            for (j = 0; j < clickedFollowingPosts.length; j++) {
                                if (clickedFollowingPosts[j].author.username == followingUsername) {
                                    clickedFollowingPosts.splice(j, 1);
                                    j--;
                                }
                            }
                            break;
                        }
                    }
                }

            }

            vm.activate = function () {
                // Hack fetched shared following posts in here
                date = homeDate;

                vm.date = homeDayOfWeek + ', ' + homeMonth + ' ' + homeGetDate;
                vm.weekNum = homeWeek;

                Posts.getWeek(username, vm.weekNum).then(postsSuccessFn, postsErrorFn);
                Snackbar.show('Back to Today!');
            };

            vm.next = function () {
                // Hack fetched shared following posts in here
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
                // Hack fetched shared following posts in here
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


    }

    Date.prototype.getWeekNum = function () {
        var determinedate = new Date();
        determinedate.setFullYear(this.getFullYear(), this.getMonth(), this.getDate());
        var D = determinedate.getDay();
        var addForSunday = 0;
        if (D == 0) {
            D = 7;
            addForSunday = 1;
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
