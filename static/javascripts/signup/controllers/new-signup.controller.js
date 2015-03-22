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
        vm.numSlotsPerUser = 0;

        // Benson: Date array and Begin/End time arrays exists for the possibility of multiple slots
        vm.dates = [];
        vm.beginTimes = [];
        vm.endTimes = [];

        vm.minTimes = [];
        vm.maxTimes = [];

        vm.selectedGroup;
        vm.groups = [];
        vm.addGroups = addGroups;

        vm.getNumber = getNumber;

        /**
         * @name submit
         * @desc Create a new Signup
         * @memberOf kalendr.signup.controllers.NewSignupController
         */
        function submit() {

            var num_day = vm.dates.getDay();
            var dayOfWeek;
            var weekNum = vm.dates.getWeekNum();

            if (num_day == 0) dayOfWeek = 'Sunday';
            else if (num_day == 1) dayOfWeek = 'Monday';
            else if (num_day == 2) dayOfWeek = 'Tuesday';
            else if (num_day == 3) dayOfWeek = 'Wednesday';
            else if (num_day == 4) dayOfWeek = 'Thursday';
            else if (num_day == 5) dayOfWeek = 'Friday';
            else dayOfWeek = 'Saturday';

            Signup.create(vm.content, vm.dates, vm.location, vm.beginTimes, vm.endTimes, dayOfWeek,
                 weekNum, vm.minTimes, vm.maxTimes, vm.numSlotsPerUser).then(createPostSuccessFn, createPostErrorFn);

            $rootScope.$broadcast('signup.created', {
                content: vm.content,
                dates: vm.dates,
                location: vm.location,
                beginTimes: vm.beginTimes,
                endTimes: vm.endTimes,
                dayOfWeek: dayOfWeek,
                weekNum: weekNum,
                minTimes: vm.minTimes,
                maxTimes: vm.maxTimes,
                numSlotsPerUser: vm.numSlotsPerUser,
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
                //Access.createShareable(data.data.id, vm.groupRuleDict);


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
            vm.groups.push(vm.selectedGroup.originalObject.name);
        }

        function getNumber(num) {
            return new Array(num);
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
