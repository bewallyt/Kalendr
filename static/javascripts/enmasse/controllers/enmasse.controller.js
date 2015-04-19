/**
 * EnmasseController
 * @namespace kalendr.enmasse.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.enmasse.controllers')
        .controller('EnmasseController', EnmasseController);

    EnmasseController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Posts', 'Access', 'Puds'];


    /**
     * @namespace EnmasseController
     */
    function EnmasseController($rootScope, $scope, Authentication, Snackbar, Posts, Access, Puds) {
        var vm = this;
        vm.submit = submit;
        vm.check = check;
        vm.validateLine = validateLine;
        vm.lineNumber;
        vm.validated = true;
        var lines;
        var fieldKeys = ['content', 'priority', 'duration', 'recurring', 'expires', 'escalates', 'time', 'day', 'notify', 'when'];
        var eventfieldKeys = ['content', 'description', 'location', 'dateOfEvent', 'allDay', 'optionalStartTime', 'optionalEndTime', 'repeat', 'optionalRepeatValue', 'optionalRepeatEndDate', 'pudAllocation', 'notify', 'optionalNotificationTime', 'shareEvent'];

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
                    && !_.contains(['daily', 'weekly', 'monthly', 'Daily', 'Weekly', 'Monthly'], fields[9].split(":")[1])) throw "Invalid repeat value." +  + vm.lineNumber;


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

                // Benson to David: Access Rule API call here
                // Post is created by now.
                // Passing back whole post

                // To get latest group make create API get call that filters for latest group
                // e.g. filter queryset via .latest('created_at')
                // returned group will be data.data not data.data[0] because single item (not array)

                console.log("post creation successful and here is data.data: ");
                console.log(data.data.id);
                //console.log("This is the group rule:");
                //console.log(vm.groupRuleDict);
                //Access.createShareable(data.data.id, vm.groupRuleDict);


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

        }


        function parseCreateSignUp(fields) {

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
