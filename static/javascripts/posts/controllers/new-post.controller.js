/**
 * NewPostController
 * @namespace kalendr.posts.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.posts.controllers')
        .controller('NewPostController', NewPostController);

    NewPostController.$inject = ['$rootScope', '$scope', '$routeParams', 'Authentication', 'Snackbar', 'Posts', 'Access'];


    /**
     * @namespace NewPostController
     */
    function NewPostController($rootScope, $scope, $routeParams, Authentication, Snackbar, Posts, Access) {
        var vm = this;
        vm.submit = submit;
        vm.need_repeat = false;

        // Share Variables
        vm.is_shared = false;
        vm.selectedGroup;
        vm.users;
        vm.addGroups = addGroups;

        vm.rule;
        vm.groupRuleDict = new Object();

        vm.updateEvent = updateEvent;
        vm.init = init;


        function init(id) {
            vm.postId = id;
        }

        function updateEvent() {

            var num_day = vm.start_time.getDay();
            var dayOfWeek;
            var weekNum = vm.start_time.getWeekNum();
            var isWeekSet = true;
            var pud;

            if (num_day == 0) dayOfWeek = 'Sunday';
            else if (num_day == 1) dayOfWeek = 'Monday';
            else if (num_day == 2) dayOfWeek = 'Tuesday';
            else if (num_day == 3) dayOfWeek = 'Wednesday';
            else if (num_day == 4) dayOfWeek = 'Thursday';
            else if (num_day == 5) dayOfWeek = 'Friday';
            else dayOfWeek = 'Saturday';


            if(dayOfWeek == 'Sunday') weekNum ++;
            if (vm.begin_time === null) vm.begin_time = '';
            if (vm.end_time === null) vm.end_time = '';
            if (vm.notify_when === null) vm.notify_when = vm.start_time;

            if (vm.notification === undefined) vm.notification = false;


            if (vm.repeat == 'Weekly' ||
                vm.repeat == 'Monthly' ||
                vm.repeat == 'Daily') vm.need_repeat = true;

            if (vm.pud_time == undefined) {
                vm.pud_time = false;
                pud = 'none';
                vm.duration = 0;
            } else {
                pud = 'mutable';
                vm.duration = timeDiff(vm.begin_time, vm.end_time);
                vm.content = "Complete Task";
                vm.description_event = 'Work on: ';
            }

            Posts.updateEvent(vm.content, vm.start_time, vm.notification, vm.notify_when, vm.repeat, vm.location_event,
                vm.description_event, vm.begin_time, vm.end_time, vm.end_repeat, vm.not_all_day, dayOfWeek,
                vm.need_repeat, weekNum, isWeekSet, vm.pud_time, pud, vm.duration, vm.postId).then(updatePostSuccessFn, createPostErrorFn);

            $rootScope.$broadcast('post.created', {
                content: vm.content,
                repeat: vm.repeat,
                start_time: vm.start_time,
                notification: vm.notification,
                notify_when: vm.notify_when,
                location_event: vm.location_event,
                description_event: vm.description_event,
                begin_time: vm.begin_time,
                end_time: vm.end_time,
                end_repeat: vm.end_repeat,
                not_all_day: vm.not_all_day,
                dayOfWeek: dayOfWeek,
                weekNum: weekNum,
                isWeekSet: isWeekSet,
                pud_time: vm.pud_time,
                pud: pud,
                duration: vm.duration,
                author: {
                    username: Authentication.getAuthenticatedAccount().username
                }
            });

            $scope.closeThisDialog();


            /**
             * @name createPostSuccessFn
             * @desc Show snackbar with success message
             */
            function updatePostSuccessFn(data, status, headers, config) {
                Snackbar.show('Success! Event Updated!');

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


        /**
         * @name submit
         * @desc Create a new Post
         * @memberOf kalendr.posts.controllers.NewPostController
         */
        function submit() {

            var num_day = vm.start_time.getDay();
            var dayOfWeek;
            var weekNum = vm.start_time.getWeekNum();
            var isWeekSet = true;
            var pud;

            if (num_day == 0) dayOfWeek = 'Sunday';
            else if (num_day == 1) dayOfWeek = 'Monday';
            else if (num_day == 2) dayOfWeek = 'Tuesday';
            else if (num_day == 3) dayOfWeek = 'Wednesday';
            else if (num_day == 4) dayOfWeek = 'Thursday';
            else if (num_day == 5) dayOfWeek = 'Friday';
            else dayOfWeek = 'Saturday';


            if(dayOfWeek == 'Sunday') weekNum ++;
            if (vm.begin_time === null) vm.begin_time = '';
            if (vm.end_time === null) vm.end_time = '';
            if (vm.notify_when === null) vm.notify_when = vm.start_time;

            if (vm.notification === undefined) vm.notification = false;


            if (vm.repeat == 'Weekly' ||
                vm.repeat == 'Monthly' ||
                vm.repeat == 'Daily') vm.need_repeat = true;

            if (vm.pud_time == undefined) {
                vm.pud_time = false;
                pud = 'none';
                vm.duration = 0;
            } else {
                pud = 'mutable';
                vm.duration = timeDiff(vm.begin_time, vm.end_time);
                vm.content = "Complete Task";
                vm.description_event = 'Work on: ';
            }

            console.log(vm.start_time);

            Posts.create(vm.content, vm.start_time, vm.notification, vm.notify_when, vm.repeat, vm.location_event,
                vm.description_event, vm.begin_time, vm.end_time, vm.end_repeat, vm.not_all_day, dayOfWeek,
                vm.need_repeat, weekNum, isWeekSet, vm.pud_time, pud, vm.duration).then(createPostSuccessFn, createPostErrorFn);

            $rootScope.$broadcast('post.created', {
                content: vm.content,
                repeat: vm.repeat,
                start_time: vm.start_time,
                notification: vm.notification,
                notify_when: vm.notify_when,
                location_event: vm.location_event,
                description_event: vm.description_event,
                begin_time: vm.begin_time,
                end_time: vm.end_time,
                end_repeat: vm.end_repeat,
                not_all_day: vm.not_all_day,
                dayOfWeek: dayOfWeek,
                weekNum: weekNum,
                isWeekSet: isWeekSet,
                pud_time: vm.pud_time,
                pud: pud,
                duration: vm.duration,
                author: {
                    username: Authentication.getAuthenticatedAccount().username
                }
            });

            $scope.closeThisDialog();


            /**
             * @name createPostSuccessFn
             * @desc Show snackbar with success message
             */
            function createPostSuccessFn(data, status, headers, config) {
                Snackbar.show('Success! Event added to Kalendr');

                // Benson to David: Access Rule API call here
                // Post is created by now.
                // Passing back whole post

                // To get latest group make create API get call that filters for latest group
                // e.g. filter queryset via .latest('created_at')
                // returned group will be data.data not data.data[0] because single item (not array)

                console.log("post creation successful and here is data.data: ");
                console.log(data.data.id);
                console.log("This is the group rule:");
                console.log(vm.groupRuleDict);
                Access.createShareable(data.data.id, vm.groupRuleDict);


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

        function addGroups() {
            vm.groupRuleDict[vm.selectedGroup.originalObject.name] = vm.rule;

        }
    }

    function timeDiff(begin_time, end_time) {
        return Math.ceil(end_time.getHours() - begin_time.getHours());
    }

    Date.prototype.getWeekNum = function () {
        var determinedate = new Date();
        determinedate.setFullYear(this.getFullYear(), this.getMonth(), this.getDate());
        var D = determinedate.getDay();
        if (D == 0) D = 7;
        determinedate.setDate(determinedate.getDate() + (4 - D));
        var YN = determinedate.getFullYear();
        var ZBDoCY = Math.floor((determinedate.getTime() - new Date(YN, 0, 1, -6)) / 86400000);
        var WN = 1 + Math.floor(ZBDoCY / 7);
        return WN;
    }
})();
