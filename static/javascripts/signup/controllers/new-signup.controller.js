/**
 * NewSignupController
 * @namespace kalendr.signup.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.signup.controllers')
        .controller('NewSignupController', NewSignupController);

    NewSignupController.$inject = ['$rootScope', '$scope', '$routeParams', 'Authentication', 'Snackbar', 'Signup', 'Access'];


    /**
     * @namespace NewSignupController
     */
    function NewSignupController($rootScope, $scope, Authentication, Snackbar, Signup, Access) {
        var vm = this;

        vm.submit = submit;
        vm.content;
        vm.location;
        vm.numBlocks = 0;
        vm.date;
        vm.beginTime;
        vm.endTime;

        vm.selectedGroup;
        vm.users;
        vm.addGroups = addGroups;

        vm.getNumber = getNumber;

        /**
         * @name submit
         * @desc Create a new Signup
         * @memberOf kalendr.signup.controllers.NewSignupController
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

            Signup.create(vm.content, vm.date, vm.location, vm.begin_time, vm.end_time, dayOfWeek,
                vm.need_repeat, weekNum).then(createPostSuccessFn, createPostErrorFn);

            $rootScope.$broadcast('signup.created', {
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
                // Signup is created by now.
                // Passing back whole signup

                // To get latest group make create API get call that filters for latest group
                // e.g. filter queryset via .latest('created_at')
                // returned group will be data.data not data.data[0] because single item (not array)

                //console.log("signup creation successful and here is data.data: ");
                //console.log(data.data.id);
                //console.log("This is the group rule:");
                //console.log(vm.groupRuleDict);
                Access.createShareable(data.data.id, vm.groupRuleDict);


            }


            /**
             * @name createPostErrorFn
             * @desc Propogate error event and show snackbar with error message
             */
            function createPostErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('signup.created.error');
                Snackbar.error(data.error);
            }
        }

        function addGroups() {
            vm.groupRuleDict[vm.selectedGroup.originalObject.name] = vm.rule;

        }

        function getNumber(num) {
            console.log('num: ' + num);
            return new Array(num);
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
