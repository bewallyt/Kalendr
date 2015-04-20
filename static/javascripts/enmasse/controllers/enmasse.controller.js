/**
 * EnmasseController
 * @namespace kalendr.enmasse.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.enmasse.controllers')
        .controller('EnmasseController', EnmasseController);

    EnmasseController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Posts', 'Access', 'Puds', 'Groups', 'Signup'];


    /**
     * @namespace EnmasseController
     */
    function EnmasseController($rootScope, $scope, Authentication, Snackbar, Posts, Access, Puds, Groups, Signup) {
        var vm = this;
        vm.submit = submit;
        vm.check = check;
        vm.validateLine = validateLine;
        vm.lineNumber;
        vm.validated = true;


        // Used for sharing
        var followers = [];
        var textFollowers = [];
        var nameAndRules = [];
        var textRules = [];
        var trueNames;
        var invalidName;
        vm.groupRuleDict = new Object();


        var username = Authentication.getAuthenticatedAccount().username;
        Groups.getFollowers(username).then(followerSuccessFn);

        var lines;
        var fieldKeys = ['content', 'priority', 'duration', 'recurring', 'expires', 'escalates', 'time', 'day', 'notify', 'when'];
        var eventfieldKeys = ['content', 'description', 'location', 'dateOfEvent', 'allDay', 'optionalStartTime', 'optionalEndTime', 'repeat', 'optionalRepeatValue', 'optionalRepeatEndDate', 'pudAllocation', 'notify', 'optionalNotificationTime', 'shareEvent', 'optionalShareWith'];
        var signupFieldKeys = ['name', 'location', 'minTime', 'maxTime', 'maxSlotsPerUser', 'numberOfBlocks', 'blockDateStartTimeEndTime', 'shareWith', 'preferenceBased', 'preferenceDuration'];


        function check(event, keyCode) {
            var textArea = event.target;
            if (keyCode == 13) {
                vm.lineNumber = textArea.value.substr(0, textArea.selectionStart).split("\n").length;
                lines = vm.text.split("\n");
                validationRule(lines[vm.lineNumber - 1]);
            }
        }

        function validateLine() {
            lines = vm.text.split("\n");
            validationRule(lines[vm.lineNumber - 1]);
        }

        function validationRule(line) {
            var forFields = stringTrimmer(line);
            if (forFields[0] == 'pud') {
                validatePud(forFields);
            } else if (forFields[0] == 'event') {
                validateEvent(forFields);
            } else if (forFields[0] == 'signup') {
                validateSignUp(forFields);
            } else {
                Snackbar.error('Invalid Kalendr object type!', 5000);
            }
        }

        function creationRule(line) {
            var forFields = stringTrimmer(line);
            if (forFields[0] == 'pud') {
                parseCreatePud(forFields);
            } else if (forFields[0] == 'event') {
                parseCreateEvent(forFields);
            } else if (forFields[0] == 'signup') {
                parseCreateSignUp(forFields);
            } else {
            }
        }

        function stringTrimmer(line) {
            var fields = line.split(";");
            var forFields = [];
            var i;
            for (i = 0; i < fields.length; i++) {
                forFields[i] = fields[i].trim();
            }

            forFields = forFields.slice(0, forFields.length - 1);
            return forFields;
        }

        /**
         * @name validatePud
         * @desc Parse the textarea line to validate the input fields and values
         * @desc Line format - pud; content:val; priority:val; duration:#; recurring:val; expires:y/n; escalates:y/n; time:hh/mm; day:mm/dd/yyyy; notify:y/n; when:#;
         * @param {Object} fields The line of text split by semicolons into an index-able array
         * @returns {Snackbar}
         * @memberOf kalendr.enmasse.controllers.EnmasseController
         */
        function validatePud(fields) {
            var areFieldsValid;
            var areValuesValid = true;
            var i;
            for (i = 1; i < fields.length; i++) {
                if (fields[i].split(":")[0] != fieldKeys[i - 1]) {
                    Snackbar.error('Pud field names are incorrect on line ' + vm.lineNumber, 5000);
                    areFieldsValid = false;
                    break;
                } else {
                    areFieldsValid = true;
                }
            }

            try {
                var now = new Date();
                if (!_.contains(['low', 'normal', 'high', 'urgent'], fields[2].split(":")[1])) throw "Invalid priority value, line " + vm.lineNumber;
                if (parseInt(fields[3].split(":")[1]) < 1
                    || parseInt(fields[3].split(":")[1] > 24)
                    || isNaN(parseInt(fields[3].split(":")[1]))) throw "Duration must be at least 1 hr and no more than 24 hrs, line " + vm.lineNumber;
                if (!_.contains(['n', 'Daily', 'Weekly', 'Monthly'], fields[4].split(":")[1])) throw "Invalid recurrence value, line " + vm.lineNumber;
                if (fields[5].split(":")[1] == 'y/n') throw "Choose whether the PUD expires";
                if (fields[6].split(":")[1] == 'y/n') throw "Choose whether the PUD escalates";
                if (fields[5].split(":")[1] == 'y'
                    && (parseInt(fields[7].split(":")[1].split("/")[0]) < 0
                    || parseInt(fields[7].split(":")[1].split("/")[0]) > 23
                    || parseInt(fields[7].split(":")[1].split("/")[1]) < 0
                    || parseInt(fields[7].split(":")[1].split("/")[1]) > 59
                    || isNaN(parseInt(fields[7].split(":")[1].split("/")[0]))
                    || isNaN(parseInt(fields[7].split(":")[1].split("/")[1]))
                    )) throw "Expiry time must be in 24 hr format, line " + vm.lineNumber; //working up to here

                if (fields[5].split(":")[1] == 'y'
                    && ((isNaN(parseInt(fields[8].split(":")[1].split("/")[0]))
                    || isNaN(parseInt(fields[8].split(":")[1].split("/")[1]))
                    || isNaN(parseInt(fields[8].split(":")[1].split("/")[2]))
                    ) || parseInt(fields[8].split(":")[1].split("/")[1]) < 1
                    || parseInt(fields[8].split(":")[1].split("/")[1]) > 31
                    || parseInt(fields[8].split(":")[1].split("/")[2]) < now.getFullYear()
                    || (parseInt(fields[8].split(":")[1].split("/")[2]) == now.getFullYear()
                    && parseInt(fields[8].split(":")[1].split("/")[0]) < now.getMonth() + 1)
                    || (parseInt(fields[8].split(":")[1].split("/")[2]) == now.getFullYear()
                    && parseInt(fields[8].split(":")[1].split("/")[0]) == now.getMonth() + 1
                    && parseInt(fields[8].split(":")[1].split("/")[1]) < now.getDate())
                    || (parseInt(fields[8].split(":")[1].split("/")[2]) == now.getFullYear()
                    && parseInt(fields[8].split(":")[1].split("/")[0]) == now.getMonth() + 1
                    && parseInt(fields[8].split(":")[1].split("/")[1]) == now.getDate()
                    && parseInt(fields[7].split(":")[1].split("/")[0]) < now.getHours())
                    )
                ) throw "Invalid date and/or date-time is backdated, line " + vm.lineNumber;

                if (fields[9].split(":")[1] == 'y/n') throw "Choose whether you want to be notified of the PUD"; //this works

                if (fields[9].split(":")[1] == 'y'
                    && (fields[10].split(":")[1] > 7
                    || fields[10].split(":")[1] < 1
                    || isNaN(parseInt(fields[10].split(":")[1]))
                    )) throw "Notification interval must be between 1 and 7 inclusive, line " + vm.lineNumber;
            } catch (err) {
                Snackbar.error(err, 5000);
                areValuesValid = false;
                vm.validated = true;
            }

            if (areFieldsValid && areValuesValid) {
                Snackbar.show("Pud fields and values valid on line " + vm.lineNumber, 5000);
                vm.validated = false;
            }
        }

        /**
         * @name parseCreatePud
         * @desc Parse the textarea line to create a PUD with the input values
         * @param {Object} fields The line of text split by semicolons into an index-able array
         * @returns {Puds}
         * @memberOf kalendr.enmasse.controllers.EnmasseController
         */
        function parseCreatePud(fields) {

            var content = fields[1].split(":")[1];
            var priority = fields[2].split(":")[1];

            var priority_int;
            var repeat;
            var repeatType;
            var repeat_int;
            var expiry;
            var exp_day;
            var expiry_time;

            if (priority == 'low') {
                priority_int = 0;
            } else if (priority == 'normal') {
                priority_int = 1;
            } else if (priority == 'high') {
                priority_int = 2;
            } else {
                priority_int = 3;
            }

            var duration = parseInt(fields[3].split(":")[1]);

            if (fields[4].split(":")[1] != "n") {
                repeatType = fields[4].split(":")[1];
                repeat = true;
            } else {
                repeatType = "Perpetual";
                repeat = false;
            }

            var expires = fields[5].split(":")[1] == 'y';
            var escalate = fields[6].split(":")[1] == 'y';

            if (!expires) {
                expiry = new Date();
                exp_day = 32;
                expiry_time = expiry;
            } else {
                var d = new Date();
                d.setHours(parseInt(fields[7].split(":")[1].split("/")[0]));
                d.setMinutes(parseInt(fields[7].split(":")[1].split("/")[1]));
                expiry_time = d;

                var d2 = new Date();
                var year = parseInt(fields[8].split(":")[1].split("/")[2]);
                var day = parseInt(fields[8].split(":")[1].split("/")[1]);
                var month = parseInt(fields[8].split(":")[1].split("/")[0]);
                d2.setFullYear(year, month - 1, day);
                expiry = d2;
            }

            if (repeatType == 'Weekly') {
                repeat_int = 2;
                if (expires) {
                    exp_day = expiry.getDay();
                } else {
                    exp_day = 32;
                }
            } else if (repeatType == 'Monthly') {
                repeat_int = 3;
                if (expires) {
                    exp_day = expiry.getDate();
                } else {
                    exp_day = 32;
                }
            } else if (repeatType == 'Daily') {
                repeat_int = 1;
                exp_day = 32;
                expiry = new Date();
                escalate = false;
            } else if (repeatType == 'Perpetual') {
                repeat_int = 0;
                exp_day = 32;
            } else {
            }

            var notify = fields[9].split(":")[1] == 'y';
            var notifyWhen;
            if (notify) {
                notifyWhen = parseInt(fields[10].split(':')[1]);
            } else {
                notifyWhen = 0;
            }

            Puds.create(content, notify, priority, priority_int, duration, repeatType, repeat_int,
                repeat, notifyWhen, expires, escalate, expiry, exp_day, expiry_time).then(pudSuccess);

            function pudSuccess(data, status, headers, config) {
                Snackbar.show('Success! PUD added to Kalendr');
                $rootScope.$broadcast('pud.created', {});
            }
        }

        function validateEvent(fields) {


            var areFieldsValid;
            var areValuesValid = true;
            var i;
            for (i = 1; i < fields.length; i++) {
                console.log(fields[i].split(":")[0]);
                if (fields[i].split(":")[0] != eventfieldKeys [i - 1]) {
                    console.log('error at: ' + fields[i].split(":")[0]);
                    console.log(eventfieldKeys [i - 1]);
                    Snackbar.error('Event field names are incorrect on line ' + vm.lineNumber, 5000);
                    areFieldsValid = false;
                    break;
                } else {
                    areFieldsValid = true;
                }
            }

            try {
                var now = new Date();
                if ((isNaN(parseInt(fields[4].split(":")[1].split("/")[0]))
                    || isNaN(parseInt(fields[4].split(":")[1].split("/")[1]))
                    || isNaN(parseInt(fields[4].split(":")[1].split("/")[2]))
                    ) || parseInt(fields[4].split(":")[1].split("/")[1]) < 1
                    || parseInt(fields[4].split(":")[1].split("/")[1]) > 41
                    || parseInt(fields[4].split(":")[1].split("/")[2]) < now.getFullYear()
                    || (parseInt(fields[4].split(":")[1].split("/")[2]) == now.getFullYear()
                    && parseInt(fields[4].split(":")[1].split("/")[0]) < now.getMonth() + 1)
                    || (parseInt(fields[4].split(":")[1].split("/")[2]) == now.getFullYear()
                    && parseInt(fields[4].split(":")[1].split("/")[0]) == now.getMonth() + 1
                    && parseInt(fields[4].split(":")[1].split("/")[1]) < now.getDate())
                    || (parseInt(fields[4].split(":")[1].split("/")[2]) == now.getFullYear()
                    && parseInt(fields[4].split(":")[1].split("/")[0]) == now.getMonth() + 1
                    && parseInt(fields[4].split(":")[1].split("/")[1]) == now.getDate())
                ) throw "Invalid date and/or date-time is backdated, line " + vm.lineNumber;
                if (fields[5].split(":")[1] == 'y/n') throw "Choose whether the event is all day";
                if (fields[5].split(":")[1] == 'y'
                    && (parseInt(fields[6].split(":")[1].split("/")[0]) < now.getHours()
                    || parseInt(fields[7].split(":")[1].split("/")[0]) < now.getHours()))
                    throw "Invalid time or time is backdated, line " + vm.lineNumber;

                console.log('field 9' + fields[9].split(":")[1]);
                if (fields[8].split(":")[1] == 'y/n') throw "Choose whether the event repeats.";
                if (fields[8].split(":")[1] == 'y'
                    && !_.contains(['daily', 'weekly', 'monthly', 'Daily', 'Weekly', 'Monthly'], fields[9].split(":")[1])) throw "Invalid repeat value." + vm.lineNumber;


                if (fields[8].split(":")[1] == 'y'
                    && ((isNaN(parseInt(fields[10].split(":")[1].split("/")[0]))
                    || isNaN(parseInt(fields[10].split(":")[1].split("/")[1]))
                    || isNaN(parseInt(fields[10].split(":")[1].split("/")[2]))
                    ) || parseInt(fields[10].split(":")[1].split("/")[1]) < 1
                    || parseInt(fields[10].split(":")[1].split("/")[1]) > 31
                    || parseInt(fields[10].split(":")[1].split("/")[2]) < now.getFullYear()
                    || (parseInt(fields[10].split(":")[1].split("/")[2]) == now.getFullYear()
                    && parseInt(fields[10].split(":")[1].split("/")[0]) < now.getMonth() + 1)
                    || (parseInt(fields[10].split(":")[1].split("/")[2]) == now.getFullYear()
                    && parseInt(fields[10].split(":")[1].split("/")[0]) == now.getMonth() + 1
                    && parseInt(fields[10].split(":")[1].split("/")[1]) < now.getDate())
                    || (parseInt(fields[10].split(":")[1].split("/")[2]) == now.getFullYear()
                    && parseInt(fields[10].split(":")[1].split("/")[0]) == now.getMonth() + 1
                    && parseInt(fields[10].split(":")[1].split("/")[1]) == now.getDate()))) throw "Invalid time or time is backdated, line " + vm.lineNumber;


                if (fields[11].split(":")[1] == 'y/n') throw "Choose whether you want PUD allocation";
                if (fields[12].split(":")[1] == 'y/n') throw "Choose whether you want to be notified of the event";

                if (fields[12].split(":")[1] == 'y'
                    && ((isNaN(parseInt(fields[13].split(":")[1].split("/")[0]))
                    || isNaN(parseInt(fields[13].split(":")[1].split("/")[1]))
                    || isNaN(parseInt(fields[13].split(":")[1].split("/")[2]))
                    ) || parseInt(fields[13].split(":")[1].split("/")[1]) < 1
                    || parseInt(fields[13].split(":")[1].split("/")[1]) > 31
                    || parseInt(fields[13].split(":")[1].split("/")[2]) < now.getFullYear()
                    || (parseInt(fields[13].split(":")[1].split("/")[2]) == now.getFullYear()
                    && parseInt(fields[13].split(":")[1].split("/")[0]) < now.getMonth() + 1)
                    || (parseInt(fields[13].split(":")[1].split("/")[2]) == now.getFullYear()
                    && parseInt(fields[13].split(":")[1].split("/")[0]) == now.getMonth() + 1
                    && parseInt(fields[13].split(":")[1].split("/")[1]) < now.getDate())
                    || (parseInt(fields[13].split(":")[1].split("/")[2]) == now.getFullYear()
                    && parseInt(fields[13].split(":")[1].split("/")[0]) == now.getMonth() + 1
                    && parseInt(fields[13].split(":")[1].split("/")[1]) == now.getDate()
                    && parseInt(fields[13].split(":")[1].split("/")[3]) < now.getHours()))) throw "Invalid time or time is backdated, line " + vm.lineNumber;

                if (fields[14].split(":")[1] == 'y/n') throw "Choose whether you want to share event";

                // Check whether follower exists via get follower
                if (fields[14].split(":")[1] == 'y') {
                    nameAndRules = fields[15].split(":")[1].split(".");
                    var i;
                    for (i = 0; i < nameAndRules.length; i++) {
                        textFollowers[i] = nameAndRules[i].split("/")[0];
                        textRules[i] = nameAndRules[i].split("/")[1];
                    }


                    for (i = 0; i < textFollowers.length; i++) {
                        if (followers.indexOf(textFollowers[i]) == -1) {
                            invalidName = textFollowers[i];
                            throw invalidName + " is an invalid follower name in line " + vm.lineNumber;
                        }
                    }

                    //for(i = 0; i < textRules.length; i++){
                    //    if(textRules[i] != 'Busy' || textRules[i] != 'Modify' || textRules[i] != "Read Only" ){
                    //        if(textRules[i] != 'busy' || textRules[i] != 'modify' || textRules[i] != "read only" ){
                    //            throw textRules[i] + " is an invalid rule in line " +vm.lineNumber;
                    //        }
                    //    }
                    //}
                }


            } catch (err) {
                Snackbar.error(err, 5000);
                areValuesValid = false;
                vm.validated = true;
            }

            if (areFieldsValid && areValuesValid) {
                Snackbar.show("Event fields and values valid on line " + vm.lineNumber, 5000);
                vm.validated = false;
            }

        }

        function followerSuccessFn(data, status, headers, config) {
            var i;
            for (i = 0; i < data.data.length; i++) {
                followers[i] = data.data[i].name;
            }

        }

        function parseCreateEvent(fields) {

            var content = fields[1].split(":")[1];
            var description = fields[2].split(":")[1];
            var location = fields[3].split(":")[1];

            var dateOfEvent;
            var allDay;
            var optionalStartTime;
            var optionalEndTime;
            var repeat;
            var optionalRepeatValue;
            var optionalRepeatEndDate;
            var pudAllocation;
            var notify;
            var optionalNotificationTime;
            var shareEvent;

            // 4 Set dateOfEvent
            var d2 = new Date();
            var year = parseInt(fields[4].split(":")[1].split("/")[2]);
            var day = parseInt(fields[4].split(":")[1].split("/")[1]);
            var month = parseInt(fields[4].split(":")[1].split("/")[0]);
            d2.setFullYear(year, month - 1, day);
            dateOfEvent = d2;

            // 5 All Day
            if (fields[5].split(":")[1] == "n") {
                allDay = true;
                var t1 = new Date();
                t1.setHours(parseInt(fields[6].split(":")[1].split("/")[0]));
                t1.setMinutes(parseInt(fields[6].split(":")[1].split("/")[1]));
                optionalStartTime = t1;

                var t2 = new Date();
                t2.setHours(parseInt(fields[7].split(":")[1].split("/")[0]));
                t2.setMinutes(parseInt(fields[7].split(":")[1].split("/")[1]));
                optionalEndTime = t2;
            } else {
                allDay = false;
            }

            if (fields[8].split(":")[1] == "y") {
                repeat = true;
                optionalRepeatValue = fields[9].split(":")[1];
                var d3 = new Date();
                var year = parseInt(fields[10].split(":")[1].split("/")[2]);
                var day = parseInt(fields[10].split(":")[1].split("/")[1]);
                var month = parseInt(fields[10].split(":")[1].split("/")[0]);
                d3.setFullYear(year, month - 1, day);
                optionalRepeatEndDate = d3;
                console.log('repeat end date: ' + optionalRepeatEndDate);
            }
            else {
                repeat = false;
            }

            if (fields[11].split(":")[1] == "y") {
                pudAllocation = true;
            }
            else {
                pudAllocation = false;
            }

            if (fields[12].split(":")[1] == "y") {
                notify = true;
                var d3 = new Date();
                var year = parseInt(fields[13].split(":")[1].split("/")[2]);
                var day = parseInt(fields[13].split(":")[1].split("/")[1]);
                var month = parseInt(fields[13].split(":")[1].split("/")[0]);
                var hours = parseInt(fields[13].split(":")[1].split("/")[3]);
                var minutes = parseInt(fields[13].split(":")[1].split("/")[4]);
                d3.setFullYear(year, month - 1, day);
                d3.setHours(hours);
                d3.setMinutes(minutes);
                optionalNotificationTime = d3;
            }
            else {
                notify = false;
            }

            if (fields[14].split(":")[1] == "y") {
                shareEvent = true;
                var i;
                for (i = 0; i < textFollowers.length; i++) {
                    vm.groupRuleDict[textFollowers[i]] = textRules;
                }
            }
            else {
                shareEvent = false;
            }

            var num_day = dateOfEvent.getDay();
            var weekNum = dateOfEvent.getWeekNum();
            var dayOfWeek;
            var isWeekSet = true;

            if (num_day == 0) dayOfWeek = 'Sunday';
            else if (num_day == 1) dayOfWeek = 'Monday';
            else if (num_day == 2) dayOfWeek = 'Tuesday';
            else if (num_day == 3) dayOfWeek = 'Wednesday';
            else if (num_day == 4) dayOfWeek = 'Thursday';
            else if (num_day == 5) dayOfWeek = 'Friday';
            else dayOfWeek = 'Saturday';


            if (dayOfWeek == 'Sunday') weekNum++;

            Posts.create(content, dateOfEvent, notify, optionalNotificationTime, optionalRepeatValue, location,
                description, optionalStartTime, optionalEndTime, optionalRepeatEndDate, allDay, dayOfWeek,
                repeat, weekNum, isWeekSet, false, pudAllocation, 0).then(createPostSuccessFn, createPostErrorFn);


            $rootScope.$broadcast('post.created', {
                content: vm.content,
                repeat: optionalRepeatValue,
                start_time: dateOfEvent,
                notification: notify,
                notify_when: optionalNotificationTime,
                location_event: location,
                description_event: description,
                begin_time: optionalStartTime,
                end_time: optionalEndTime,
                end_repeat: optionalRepeatEndDate,
                not_all_day: allDay,
                dayOfWeek: dayOfWeek,
                weekNum: weekNum,
                isWeekSet: isWeekSet,
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

                if (shareEvent) {
                    Access.createShareable(data.data.id, vm.groupRuleDict);
                }


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

        function validateSignUp(fields) {
            var areFieldsValid;
            var areValuesValid = true;
            var i;
            for (i = 1; i < fields.length; i++) {
                if (fields[i].split(":")[0] != signupFieldKeys[i - 1]) {
                    Snackbar.error('Signup field names are incorrect on line ' + vm.lineNumber, 5000);
                    areFieldsValid = false;
                    break;
                } else {
                    areFieldsValid = true;
                }
            }

            try {

                if(fields[9].split(":")[1] != 'y') {


                    if (isNaN(parseInt(fields[3].split(":")[1]))
                    //|| parseInt(fields[3].split(":")[1]) != 5
                    //|| parseInt(fields[3].split(":")[1]) != 10
                    //|| parseInt(fields[3].split(":")[1]) != 15
                    //|| parseInt(fields[3].split(":")[1]) != 20
                    //|| parseInt(fields[3].split(":")[1]) != 25
                    //|| parseInt(fields[3].split(":")[1]) != 30
                    ) throw "Minimum time " + fields[3].split(":")[1] + " minutes is an incorrect time, line " + vm.lineNumber;

                    if (isNaN(parseInt(fields[4].split(":")[1]))
                    //|| parseInt(fields[4].split(":")[1]) != parseInt(fields[3].split(":")[1]) * 1
                    //|| parseInt(fields[4].split(":")[1]) != parseInt(fields[3].split(":")[1]) * 2
                    //|| parseInt(fields[4].split(":")[1]) != parseInt(fields[3].split(":")[1]) * 3
                    //|| parseInt(fields[4].split(":")[1]) != parseInt(fields[3].split(":")[1]) * 4
                    //|| parseInt(fields[4].split(":")[1]) != parseInt(fields[3].split(":")[1]) * 5
                    //|| parseInt(fields[4].split(":")[1]) != parseInt(fields[3].split(":")[1]) * 6
                    ) throw "Maximum time " + fields[4].split(":")[1] + " minutes is an incorrect time, line " + vm.lineNumber;
                }
                var numOfBlocks = parseInt(fields[6].split(":")[1]);
                var maxSlotsPerUser;


                if (maxSlotsPerUser < 1) throw "Max slots per user needs to be greater than 1, line " + vm.lineNumber;
                if (numOfBlocks < 1) throw "Number of blocks needs to be greater than 1, line " + vm.lineNumber;

                var blockDateTimes = fields[7].split(":")[1].split(".");
                if (blockDateTimes.length != numOfBlocks) throw "Number of date time fields in blockDateStartTimeEndTime field is incorrect, line" + vm.lineNumber;

                for (var i = 0; i < blockDateTimes.length; i++) {

                    // Checking Block Times

                    console.log("0: " + blockDateTimes[i].split("/")[0]);
                    console.log("1: " + blockDateTimes[i].split("/")[1]);
                    console.log("2: " + blockDateTimes[i].split("/")[2]);
                    console.log("3: " + blockDateTimes[i].split("/")[3]);
                    console.log("4: " + blockDateTimes[i].split("/")[4]);

                    var now = new Date();

                    if (((isNaN(parseInt(blockDateTimes[i].split("/")[0]))
                        || isNaN(parseInt(blockDateTimes[i].split("/")[1]))
                        || isNaN(parseInt(blockDateTimes[i].split("/")[2]))
                        || isNaN(parseInt(blockDateTimes[i].split("/")[3]))
                        || isNaN(parseInt(blockDateTimes[i].split("/")[4]))
                        ) || parseInt(blockDateTimes[i].split("/")[1]) < 1
                        || parseInt(blockDateTimes[i].split("/")[1]) > 31
                        || parseInt(blockDateTimes[i].split("/")[2]) < now.getFullYear()
                        || (parseInt(blockDateTimes[i].split("/")[2]) == now.getFullYear()
                        && parseInt(blockDateTimes[i].split("/")[0]) < now.getMonth() + 1)
                        || (parseInt(blockDateTimes[i].split("/")[2]) == now.getFullYear()
                        && parseInt(blockDateTimes[i].split("/")[0]) == now.getMonth() + 1
                        && parseInt(blockDateTimes[i].split("/")[1]) < now.getDate())
                        || (parseInt(blockDateTimes[i].split("/")[2]) == now.getFullYear()
                        && parseInt(blockDateTimes[i].split("/")[0]) == now.getMonth() + 1
                        && parseInt(blockDateTimes[i].split("/")[1]) == now.getDate()
                        && parseInt(blockDateTimes[i].split("/")[3]) < now.getHours())
                        || ((parseInt(blockDateTimes[i].split("/")[3]) < 0
                        || parseInt(blockDateTimes[i].split("/")[3]) > 23
                        || parseInt(blockDateTimes[i].split("/")[4]) < 0
                        || parseInt(blockDateTimes[i].split("/")[4]) > 23))))

                    throw "Invalid date and/or date-time is backdated, line " + vm.lineNumber;

                }
                var followersString = fields[8].split(":")[1];
                var signUpFollowers = followersString.split(".");

                for (i = 0; i < signUpFollowers.length; i++) {
                    if (followers.indexOf(signUpFollowers[i]) == -1) {
                        invalidName = signUpFollowers[i];
                        throw invalidName + " is an invalid follower name, line " + vm.lineNumber;
                    }
                }

                if (fields[9].split(":")[1] == 'y/n') throw "Choose whether you want a preference based signup";

                // Check whether follower exists via get follower
                //if (fields[9].split(":")[1] == 'y' &&
                //    (fields[10].split(":")[1] != '10' ||
                //    fields[10].split(":")[1] != '20' ||
                //    fields[10].split(":")[1] != '30' ||
                //    fields[10].split(":")[1] != '40' ||
                //    fields[10].split(":")[1] != '50' ||
                //    fields[10].split(":")[1] != '60')
                //    ) throw fields[10].split(":")[1] + " is an invalid preference time, line " + vm.lineNumber;

                if(fields[9].split(":")[1] == 'n'){
                    maxSlotsPerUser = parseInt(fields[5].split(":")[1]);
                }

            }

            catch
                (err) {
                Snackbar.error(err, 5000);
                areValuesValid = false;
                vm.validated = true;
            }

            if (areFieldsValid && areValuesValid) {
                Snackbar.show("Sign up valid on line " + vm.lineNumber, 5000);
                vm.validated = false;
            }
        }


        function parseCreateSignUp(fields) {

            var name = fields[1].split(":")[1];
            var location = fields[2].split(":")[1];
            var minTimeValue = parseInt(fields[3].split(":")[1]);
            var maxTimeValue = parseInt(fields[4].split(":")[1]);

            var minTime = new Object();
            var maxTime = new Object();

            // Format for backend to query correctly

            minTime[undefined] = minTimeValue;
            maxTime[undefined] = maxTimeValue;

            var maxSlotsPerUser;
            var numberOfBlocks = parseInt(fields[6].split(":")[1]);



            var blockDateTimes = fields[7].split(":")[1].split(".");
            vm.dates = [];
            vm.beginTimes = [];
            vm.endTimes = [];
            vm.beginDateTimes = [];
            vm.endDateTimes = [];
            vm.dayOfWeek;


            for (var i = 0; i < blockDateTimes.length; i++) {
                var date = new Date();
                var month = parseInt(blockDateTimes[i].split("/")[0]);
                var day = parseInt(blockDateTimes[i].split("/")[1]);
                var year = parseInt(blockDateTimes[i].split("/")[2]);

                date.setFullYear(year, month - 1, day);
                vm.dates[i] = date;

                var beginHour = parseInt(blockDateTimes[i].split("/")[3]);
                var endHour = parseInt(blockDateTimes[i].split("/")[4]);

                var d2 = new Date();
                var d3 = new Date();
                d2.setHours(parseInt(beginHour));
                d3.setHours(parseInt(endHour));

                vm.beginTimes[i] = d2;
                vm.endTimes[i] = d3;
            }

            createDateTime();
            createDayOfWeek();


            var followersString = fields[8].split(":")[1];
            var signUpFollowers = followersString.split(".");
            var groupRuleDict = new Object();
            for (var i = 0; i < signUpFollowers.length; i++) {
                groupRuleDict[signUpFollowers[i]] = 'ALL';
            }

            var isPreferenceBased = false;
            var preferenceDuration;

            if(fields[9].split(":")[1] == 'y'){
                isPreferenceBased = true;
                preferenceDuration = parseInt(fields[10].split(":")[1]);
            }
            else{
                maxSlotsPerUser = parseInt(fields[5].split(":")[1])
            }

            console.log('this isnt preference based: ' + !isPreferenceBased);


            var firstMeetingMonth = vm.dates[0].getMonth();
            var firstMeetingDate = vm.dates[0].getDate();
            var firstMeetingWeek = vm.dates[0].getWeekNum();
            console.log('week num: ' + firstMeetingWeek);

            if (vm.dayOfWeek == 'Sunday') firstMeetingWeek++;

            if (!isPreferenceBased) {
                console.log('non preference signup');

                Signup.create(name, location, vm.beginDateTimes, vm.endDateTimes, minTime, maxTime, maxSlotsPerUser, vm.dayOfWeek, firstMeetingWeek).then(createPostSuccessFn, createPostErrorFn);

                $rootScope.$broadcast('signup.created', {
                    content: name,
                    location: location,
                    beginDateTimes: vm.beginDateTimes,
                    endDateTimes: vm.endDateTimes,
                    minTimes: minTime,
                    maxTimes: maxTime,
                    numSlotsPerUser: maxSlotsPerUser,
                    dayOfWeek: vm.dayOfWeek,
                    firstMeetingMonth: firstMeetingMonth,
                    firstMeetingDate: firstMeetingDate,
                    firstMeetingWeek: firstMeetingWeek,
                    author: {
                        username: Authentication.getAuthenticatedAccount().username
                    }
                });

            }

            else {


                console.log('preference signup');
                console.log('maxTime:' + maxTime);
                console.log('minTime' + minTime);
                console.log('maxSlotsPerUser' + maxSlotsPerUser);

                /*Preference-Based Signup*/
                Signup.createPref(name, location, vm.beginDateTimes, vm.endDateTimes, vm.dayOfWeek, firstMeetingWeek, preferenceDuration).then(createPostSuccessFn, createPostErrorFn);

                $rootScope.$broadcast('prefSignup.created', {
                    content: name,
                    location: location,
                    beginDateTimes: vm.beginDateTimes,
                    endDateTimes: vm.endDateTimes,
                    dayOfWeek: vm.dayOfWeek,
                    firstMeetingMonth: firstMeetingMonth,
                    firstMeetingDate: firstMeetingDate,
                    firstMeetingWeek: firstMeetingWeek,
                    author: {
                        username: Authentication.getAuthenticatedAccount().username
                    }
                });
            }


            $scope.closeThisDialog();


            /**
             * @name createPostSuccessFn
             * @desc Show snackbar with success message
             */
            function createPostSuccessFn(data, status, headers, config) {
                Snackbar.show('Success! Signup Created.');

                console.log("signup creation successful and here is data.data: ");
                console.log(data.data);
                console.log(data.data.id);
                Access.createShareable(data.data.id, groupRuleDict);
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

                vm.beginDateTimes[i] = new Date(year, month, day, beginHour, 0, 0);
                vm.endDateTimes[i] = new Date(year, month, day, endHour, 0, 0);

                console.log('beginDateTimes: ' + vm.beginDateTimes[i]);
                console.log('endDateTimes: ' + vm.endDateTimes[i]);
            }
        }

        function createDayOfWeek() {
            var num_day = vm.dates[0].getDay();

            if (num_day == 0) vm.dayOfWeek = 'Sunday';
            else if (num_day == 1) vm.dayOfWeek = 'Monday';
            else if (num_day == 2) vm.dayOfWeek = 'Tuesday';
            else if (num_day == 3) vm.dayOfWeek = 'Wednesday';
            else if (num_day == 4) vm.dayOfWeek = 'Thursday';
            else if (num_day == 5) vm.dayOfWeek = 'Friday';
            else vm.dayOfWeek = 'Saturday';

        }

        function submit() { //called when all the lines are validated and user clicks submit
            var i;
            for (i = 0; i < lines.length; i++) {
                creationRule(lines[i]); //maybe need to setTimeOut to slow down loop, sometimes, too many pud creations fails to update DOM, missing PUD
            }                           //talk w/ Benson about timeout

            $scope.closeThisDialog();
        }
    }
})
();
