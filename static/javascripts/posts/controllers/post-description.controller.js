/**
 * PostDescriptionController
 * @namespace kalendr.posts.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.posts.controllers')
        .controller('PostDescriptionController', PostDescriptionController);

    PostDescriptionController.$inject = ['Access', 'Signup', '$scope'];

    /**
     * @namespace PostDescriptionController
     */
    function PostDescriptionController(Access, Signup, $scope) {
        var vm = this;

        vm.columns = [];

        vm.init = init;

        vm.hasReponses = false;
        vm.hasConfirmedGroups = false;
        vm.hasRemovedGroups = false;
        vm.hasDeclinedGroups = false;
        vm.hasNoRespGroups = false;

        // Signup Attributes

        vm.isSignup;
        vm.minDuration;
        vm.maxDuration;
        vm.maxSlots;
        vm.blocks = [];
        vm.numFreeSlots = [];

        vm.getNumber = getNumber;
        vm.isLoading = true;

        // Signup for User A and User B
        vm.isOwner;
        vm.signUp = signUp;
        vm.notSigningUp = true;

        // Search
        vm.searchAvailableSlots = searchAvailableSlots;
        vm.meetingDuration;
        vm.isSearching = false;

        // Received Slots
        vm.returnedBlocks = [];
        vm.returnedNumFreeSlots = [];
        vm.returnedblockDates = [];

        // Selecting Slots
        vm.selectedSlots = [];
        vm.checkSlot = checkSlot;
        vm.numSelected = 0;
        vm.checkDisabled = false;

        // Selected Times
        vm.selectedStart = [];
        vm.selectedEnd = [];
        vm.confirmSignUp = confirmSignUp;

        // Reformat Time
        vm.blockDates = [];
        vm.parseSlotTimes = parseSlotTimes;


        function init(id) {

            vm.postId = id;

            console.log("vm.postId: " + vm.postId);
            Access.getConfirmedResponses(vm.postId, 'CONFIRM').then(successConfirmedFn, errorFn);
            Access.getRemovedResponses(vm.postId, 'REMOVED').then(successRemovedFn, errorFn);
            Access.getDeclinedResponses(vm.postId, 'DECLINE').then(successDeclinedFn, errorFn);
            Access.getNoResponses(vm.postId, 'NO_RESP').then(successNoFn, errorFn);

            Signup.get(vm.postId).then(successSignupFn, errorFn);


            function successConfirmedFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.hasConfirmedGroups = true;
                    vm.hasReponses = true;
                }
                console.log('confirmed:' + data.data);
                var i;
                for (i = 0; i < data.data.length; i++) {
                    console.log(data.data[i].name);
                }
                vm.confirmedGroups = data.data;
            }


            function successRemovedFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.hasRemovedGroups = true;
                    vm.hasReponses = true;
                }
                console.log('removed:' + data.data);
                vm.removedGroups = data.data;
            }


            function successDeclinedFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.hasDeclinedGroups = true;
                    vm.hasReponses = true;
                }
                console.log('declined:' + data.data);
                vm.declinedGroups = data.data;
            }

            function successNoFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    console.log(data.data.length);
                    vm.hasNoRespGroups = true;
                    vm.hasReponses = true;
                }
                console.log('no response:' + data.data);
                vm.noRespGroups = data.data;
            }

            function successSignupFn(data, status, headers, config) {
                vm.isLoading = false;
                if (data.data['type'] == 'signup') {
                    vm.isSignup = true;
                    console.log('Data Type: ' + data.data['type']);
                    console.log('Min Duration: ' + data.data['min_duration']);
                    console.log('Signup Blocks: ' + data.data['myblocks']);
                    console.log('is Owner: ' + data.data['is_owner']['is_owner']);

                    vm.isOwner = data.data['is_owner']['is_owner'];
                    vm.maxSlots = data.data['max_slots'];

                    var i;
                    for (i = 0; i < data.data['myblocks'].length; i++) {
                        console.log(data.data['myblocks'][i]);
                        vm.blocks[i] = data.data['myblocks'][i];
                        var j;
                        var numFreeSlots = 0;
                        for (j = 0; j < vm.blocks[i].myslots.length; j++) {
                            if (vm.blocks[i].myslots.owner == null) numFreeSlots++;
                        }
                        vm.numFreeSlots[i] = numFreeSlots;
                        parseBlockDates(vm.blocks[i].start_time, vm.blocks[i].end_time, i);
                    }


                    if (data.data['type'] == 'signup') vm.isSignup = true;
                    vm.minDuration = data.data['min_duration'];
                    vm.maxDuration = data.data['max_duration'];
                }
            }


            function errorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
            }


        }

        function signUp() {
            vm.notSigningUp = false;
        }


        function searchAvailableSlots() {
            vm.isSearching = true;
            vm.selectedStart = [];
            vm.selectedEnd = [];
            vm.selectedSlots = [];
            vm.numSelected = 0;
            Signup.searchSlots(vm.postId, vm.meetingDuration).then(successSearchFn, errorFn);

            function successSearchFn(data, status, headers, config) {
                console.log('returned slots: ' + data.data['myblocks']);

                var i;
                for (i = 0; i < data.data['myblocks'].length; i++) {
                    console.log(data.data['myblocks'][i]);
                    vm.returnedBlocks[i] = data.data['myblocks'][i];
                    var j;
                    var numFreeSlots = 0;
                    for (j = 0; j < vm.returnedBlocks[i].myslots.length; j++) {
                        if (vm.returnedBlocks[i].myslots.owner == null) numFreeSlots++;
                    }
                    vm.returnedNumFreeSlots[i] = numFreeSlots;
                    parseReturnedBlockDates(vm.returnedBlocks[i].start_time, vm.returnedBlocks[i].end_time, i);
                }

                var totalNumFreeSlots = 0;
                for (i = 0; i < vm.returnedNumFreeSlots.length; i++) {
                    totalNumFreeSlots += vm.returnedNumFreeSlots[i];
                }

                for (i = 0; i < totalNumFreeSlots; i++) {
                    vm.selectedSlots[i] = false;
                }
                vm.isSearching = false;

            }

            function errorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
                vm.isSearching = false;
            }


        }

        function confirmSignUp() {
            Signup.confirmSlots(vm.postId, vm.selectedStart, vm.selectedEnd).then(successConfirmFn, errorFn);

            function successConfirmFn(data, status, headers, config){
                console.log('posted: ' + data.data);
                $scope.closeThisDialog();
            }

            function errorFn(data, status, headers, config) {
                Snackbar.error(data.data.error);
                $scope.closeThisDialog();
            }
        }

        function checkSlot(slotIndex, start_time, end_time) {
            if (vm.selectedSlots[slotIndex] == false) {
                console.log('selected start and end time: ' + start_time + ' ' + end_time);
                console.log('numSelected: ' + vm.numSelected);
                vm.selectedSlots[slotIndex] = true;
                vm.numSelected++;
                vm.selectedStart.push(start_time);
                vm.selectedEnd.push(end_time);
            }
            else {
                console.log('deselected');
                console.log('numSelected: ' + vm.numSelected);
                vm.numSelected--;
                vm.selectedStart.pop();
                vm.selectedEnd.pop();
            }
            if (vm.numSelected == vm.maxSlots) ;
        }

        function parseBlockDates(backendStartTime, backendEndTime, index) {
            var startDateAndTime = backendStartTime.split('T');
            var startYearMonthDate = startDateAndTime[0].split('-');
            var startHourMinSec = startDateAndTime[1].split(':');

            var endDateAndTime = backendEndTime.split('T');
            var endHourMinSec = endDateAndTime[1].split(':');

            var date = startYearMonthDate[1] + '/' + startYearMonthDate[2] + '/' + startYearMonthDate[0];
            var startTime = startHourMinSec[0] + ':' + startHourMinSec[1];
            var endTime = endHourMinSec[0] + ':' + endHourMinSec[1];

            vm.blockDates[index] = date + ' ' + startTime + '-' + endTime;

        }

        function parseReturnedBlockDates(backendStartTime, backendEndTime, index) {
            var startDateAndTime = backendStartTime.split('T');
            var startYearMonthDate = startDateAndTime[0].split('-');
            var startHourMinSec = startDateAndTime[1].split(':');

            var endDateAndTime = backendEndTime.split('T');
            var endHourMinSec = endDateAndTime[1].split(':');

            var date = startYearMonthDate[1] + '/' + startYearMonthDate[2] + '/' + startYearMonthDate[0];
            var startTime = startHourMinSec[0] + ':' + startHourMinSec[1];
            var endTime = endHourMinSec[0] + ':' + endHourMinSec[1];

            vm.returnedblockDates[index] = date + ' ' + startTime + '-' + endTime;

        }

        function parseSlotTimes(slotTime) {
            var slotDateAndTime = slotTime.split('T');
            var hourMinSec = slotDateAndTime[1].split(':');


            var parsedTime = hourMinSec[0] + ':' + hourMinSec[1];

            return parsedTime;
        }

        function getNumber(num) {
            return new Array(num);
        }


    }
})
();
