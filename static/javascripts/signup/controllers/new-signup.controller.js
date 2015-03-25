/**
 * NewSignupController
 * @namespace kalendr.signup.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.signup.controllers')
        .controller('NewSignupController', NewSignupController);

    NewSignupController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Signup', 'Access'];


    /**
     * @namespace NewSignupController
     */
    function NewSignupController($rootScope, $scope, Authentication, Snackbar, Signup, Access) {
        var vm = this;

        vm.submit = submit;
        vm.content;
        vm.location;
        vm.numBlocks;
        vm.numSlotsPerUser;

        // Benson: Date array and Begin/End time arrays exists for the possibility of multiple slots
        vm.dates = [];
        vm.beginTimes = [];
        vm.endTimes = [];

        var beginDateTimes = [];
        var endDateTimes = [];

        vm.minTimes;
        vm.maxTimes;

        vm.selectedGroup;
        vm.groups = new Object();
        vm.addGroups = addGroups;

        vm.getNumber = getNumber;

        var dayOfWeek;


        /**
         * @name submit
         * @desc Create a new Signup
         * @memberOf kalendr.signup.controllers.NewSignupController
         */
        function submit() {

            createDateTime();
            createDayOfWeek();

            var firstMeetingMonth = vm.dates[0].getMonth();
            var firstMeetingDate = vm.dates[0].getDate();
            var firstMeetingWeek = vm.dates[0].getWeekNum();
            console.log('week num: ' + firstMeetingWeek);


            Signup.create(vm.content, vm.location, beginDateTimes, endDateTimes, vm.minTimes, vm.maxTimes, vm.numSlotsPerUser, dayOfWeek, firstMeetingWeek).then(createPostSuccessFn, createPostErrorFn);

            $rootScope.$broadcast('signup.created', {
                content: vm.content,
                location: vm.location,
                beginDateTimes: vm.beginDateTimes,
                endDateTimes: vm.endDateTimes,
                minTimes: vm.minTimes,
                maxTimes: vm.maxTimes,
                numSlotsPerUser: vm.numSlotsPerUser,
                dayOfWeek: dayOfWeek,
                firstMeetingMonth: firstMeetingMonth,
                firstMeetingDate: firstMeetingDate,
                firstMeetingWeek: firstMeetingWeek,
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
                Snackbar.show('Success! Signup Created.');

                // Benson to David: Access Rule API call here
                // Signup is created by now.
                // Passing back whole signup

                // To get latest group make create API get call that filters for latest group
                // e.g. filter queryset via .latest('created_at')
                // returned group will be data.data not data.data[0] because single item (not array)

                console.log("signup creation successful and here is data.data: ");
                console.log(data.data);
                //console.log("This is the group rule:");
                //console.log(vm.groupRuleDict);
                console.log(data.data.id);
                Access.createShareable(data.data.id, vm.groups);


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
            vm.groups[vm.selectedGroup.originalObject.name] = 'ALL';
        }

        function getNumber(num) {
            return new Array(num);
        }

        function createDateTime() {

            var i;
            for (i = 0; i < vm.dates.length; i++) {
                var day = vm.dates[i].getDate();
                console.log('day: ' + day);
                var month = vm.dates[i].getMonth();
                console.log('month: ' + month);
                var year = vm.dates[i].getFullYear();
                console.log('year: ' + year);

                var beginHour = vm.beginTimes[i].getHours();
                var endHour = vm.endTimes[i].getHours();

                beginDateTimes[i] = new Date(year, month, day, beginHour, 0, 0);
                endDateTimes[i] = new Date(year, month, day, endHour, 0, 0);

                console.log('beginDateTimes: ' + beginDateTimes[i]);
                console.log('endDateTimes: ' + endDateTimes[i]);
            }
        }

        function createDayOfWeek() {
            var num_day = vm.dates[0].getDay();

            if (num_day == 0) dayOfWeek = 'Sunday';
            else if (num_day == 1) dayOfWeek = 'Monday';
            else if (num_day == 2) dayOfWeek = 'Tuesday';
            else if (num_day == 3) dayOfWeek = 'Wednesday';
            else if (num_day == 4) dayOfWeek = 'Thursday';
            else if (num_day == 5) dayOfWeek = 'Friday';
            else dayOfWeek = 'Saturday';
        }
    }

    function timeDiff(beginTime, endTime) {
        return Math.ceil(endTime.getHours() - beginTime.getHours());
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
