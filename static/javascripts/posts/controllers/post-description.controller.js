/**
 * PostDescriptionController
 * @namespace kalendr.posts.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.posts.controllers')
        .controller('PostDescriptionController', PostDescriptionController);

    PostDescriptionController.$inject = ['Access', 'Signup', '$scope', 'Snackbar'];

    /**
     * @namespace PostDescriptionController
     */
    function PostDescriptionController(Access, Signup, $scope, Snackbar) {
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

        // Preference Based Variables
        vm.prefDuration;
        vm.isPrefSignup = false;
        vm.preferenceValues = [];
        vm.frontEndPreferenceValues;
        vm.numBlocks;
        vm.numSlots;
        vm.numSlotsFront = [];
        vm.numSlotsFront[0] = 0;

        vm.confirmPrefSignUp = confirmPrefSignUp;

        // Pereference Based Originator Variables
        vm.suggest = suggest;
        vm.isSuggested = false;
        vm.arrayOfArraysofRequesters = [];
        vm.requestersCounter = 0;

        // For originator resolve
        vm.update = update;
        vm.isBeingUpdated = false;
        vm.possibleRequesters = [];
        vm.resolvedRequesters = [];
        vm.resolve = resolve;



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
                    vm.possibleRequesters.push(data.data[i].name);
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
                if (data.data['type'] == 'signup' || data.data['type'] == 'prefsignup') {
                    vm.isSignup = true;
                    console.log('Data Type: ' + data.data['type']);
                    console.log('Min Duration: ' + data.data['min_duration']);
                    console.log('Signup Blocks: ' + data.data['myblocks']);
                    console.log('is Owner: ' + data.data['is_owner']['is_owner']);

                    vm.isOwner = data.data['is_owner']['is_owner'];
                    vm.maxSlots = data.data['max_slots'];

                    if (data.data['type'] == 'prefsignup') {
                        vm.isPrefSignup = true;
                        vm.prefDuration = data.data['duration'];

                    }

                    var i;
                    var counter = 0;
                    for (i = 0; i < data.data['myblocks'].length; i++) {
                        vm.frontEndPreferenceValues = new Array(data.data['myblocks'].length);
                        vm.numBlocks = data.data['myblocks'].length;

                        console.log(data.data['myblocks'][i]);
                        vm.blocks[i] = data.data['myblocks'][i];
                        var j;
                        var numFreeSlots = 0;
                        for (j = 0; j < vm.blocks[i].myslots.length; j++) {
                            vm.numSlots = vm.blocks[i].myslots.length;
                            vm.numSlotsFront[i+1] = vm.numSlots;
                            vm.frontEndPreferenceValues[i] = new Array(vm.blocks[i].myslots.length);
                            vm.frontEndPreferenceValues[i][j] = "am";
                            // add info for pref
                            if (vm.blocks[i].myslots.owner == null) numFreeSlots++;
                            if (vm.isPrefSignup) {
                                if(vm.blocks[i].myslots[j].owner.length > 0){
                                    vm.isSuggested = true;
                                    console.log('is suggested');
                                }


                                var k;
                                // parse for requester info
                                var preferencePlaceholder = "";
                                for (k = 0; k < vm.blocks[i].myslots[j].requester_list.length; k++) {
                                    if(k > 0) preferencePlaceholder = preferencePlaceholder + "&";
                                    //console.log(vm.blocks[i].myslots[j].requester_list[k]);
                                    var tempPreference;
                                    if (vm.blocks[i].myslots[j].requester_list[k][1] == 1) tempPreference = "Not Preferred";
                                    else if (vm.blocks[i].myslots[j].requester_list[k][1] == 2) tempPreference = "Slightly Preferred";
                                    else tempPreference = "Highly Preferred";
                                    preferencePlaceholder = preferencePlaceholder + " " + vm.blocks[i].myslots[j].requester_list[k][0] + " - " + tempPreference + " ";

                                }
                                vm.resolvedRequesters[counter] = "na";
                                vm.arrayOfArraysofRequesters[counter] = preferencePlaceholder;
                                console.log('pushed: ' + preferencePlaceholder);
                                counter++;
                            }

                        }
                        vm.numFreeSlots[i] = numFreeSlots;
                        parseBlockDates(vm.blocks[i].start_time, vm.blocks[i].end_time, i);
                    }
                    for (k = 0; k < vm.arrayOfArraysofRequesters.length; k++) {
                        console.log(vm.arrayOfArraysofRequesters[k]);
                    }


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

            if (vm.isPrefSignup) {
                vm.searchAvailableSlots();
            }
        }


        function searchAvailableSlots() {
            vm.isSearching = true;
            vm.selectedStart = [];
            vm.selectedEnd = [];
            vm.selectedSlots = [];
            vm.numSelected = 0;

            /*Benson: API Call for prefBased signups required no meeting duration (set by originator)*/
            if (!vm.isPrefSignup) {
                Signup.searchSlots(vm.postId, vm.meetingDuration).then(successSearchFn, errorFn);
            }
            else {
                Signup.searchPrefSlots(vm.postId).then(successSearchFn, errorFn);
            }

            function successSearchFn(data, status, headers, config) {
                /*Benson: Expecting Same Data (slots) back for both pref and normal signups*/
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
                    console.log('total number of free slots: ' + totalNumFreeSlots);
                    vm.selectedSlots[i] = false;
                    //Benson added this for David as default preference Value
                    vm.preferenceValues[i] = "am";
                    vm.resolvedRequesters[i] = "na";
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

            function successConfirmFn(data, status, headers, config) {
                console.log('posted: ' + data.data);
                Snackbar.show('Signup Successful');
                $scope.closeThisDialog();
            }

            function errorFn(data, status, headers, config) {
                Snackbar.error('Too many slots selected');
                $scope.closeThisDialog();
            }
        }

        function confirmPrefSignUp() {
            // check preference values
            var i;
            var counter = 0;
            for (i = 0; i < vm.numBlocks; i++) {
                console.log('i: ' + i);
                var j;
                for (j = 0; j < vm.numSlotsFront[i+1]; j++) {
                    console.log('j ' + j);
                    if (vm.frontEndPreferenceValues[i][j] != null) {
                        vm.preferenceValues[counter] = vm.frontEndPreferenceValues[i][j];
                    }
                    else {
                        vm.preferenceValues[counter] = "am";
                    }
                    console.log('block ' + i + ' slot ' + j + ': ' + vm.preferenceValues[counter]);
                    counter++;
                }
            }
            Signup.confirmPrefSlots(vm.postId, vm.preferenceValues, vm.selectedStart, vm.selectedEnd).then(successConfirmFn, errorFn);

            function successConfirmFn(data, status, headers, config) {
                console.log('posted: ' + data.data);
                Snackbar.show('Preferences Saved');
                $scope.closeThisDialog();
            }

            function errorFn(data, status, headers, config) {
                Snackbar.error('Error');
                $scope.closeThisDialog();
            }
        }

        function suggest() {

            Signup.suggestSchedule(vm.postId).then(successSuggestFn, errorFn);

            function successSuggestFn(data, status, headers, config) {
                vm.isSuggested = true;
                Snackbar.show('Schedule Suggested!');
                console.log('suggested: ' + data.data);
                $scope.closeThisDialog();
            }

            function errorFn(data, status, headers, config) {
                Snackbar.error('Error');
                $scope.closeThisDialog();
            }
        }

        function update(){
            vm.isBeingUpdated = true;
        }

        function resolve(){
            console.log('number of requesters: ' + vm.resolvedRequesters.length);
            Signup.resolveSchedule(vm.postId, vm.resolvedRequesters).then(successResolveFn, errorFn);

            function successResolveFn(data, status, headers, config) {
                vm.isSuggested = true;
                vm.isBeingUpdated = false;
                Snackbar.show('Schedule Resolved!');
                console.log('suggested: ' + data.data);
                $scope.closeThisDialog();
            }

            function errorFn(data, status, headers, config) {
                Snackbar.error('Error');
                $scope.closeThisDialog();
            }
        }

        function checkSlot(start_time, end_time) {
            //if (pass == false) {
            //    console.log('selected start and end time: ' + start_time + ' ' + end_time);
            //    console.log('numSelected: ' + vm.numSelected);
            //    vm.selectedSlots[slotIndex] = true;
            vm.numSelected++;
            vm.selectedStart.push(start_time);
            vm.selectedEnd.push(end_time);
            //}
            //else {
            //    console.log('deselected');
            //    console.log('numSelected: ' + vm.numSelected);
            //    vm.numSelected--;
            //    vm.selectedStart.pop();
            //    vm.selectedEnd.pop();
            //}
            //if (vm.numSelected == vm.maxSlots) ;
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
