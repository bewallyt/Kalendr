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

            //var d = new Date();
            //d.setHours(parseInt(fields[7].split(":")[1].split("/")[0]));
            //d.setMinutes(parseInt(fields[7].split(":")[1].split("/")[1]));
            //expiry_time = d;
            //
            //var d2 = new Date();
            //var year = parseInt(fields[8].split(":")[1].split("/")[2]);
            //var day = parseInt(fields[8].split(":")[1].split("/")[1]);
            //var month = parseInt(fields[8].split(":")[1].split("/")[0]);
            //d2.setFullYear(year, month - 1, day);
            //expiry = d2;

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

            //if (!expires) {
            //    expiry = new Date();
            //    exp_day = 32;
            //    expiry_time = expiry;
            //}

            Puds.create(content, notify, priority, priority_int, duration, repeatType, repeat_int,
                repeat, notifyWhen, expires, escalate, expiry, exp_day, expiry_time).then(pudSuccess);

            function pudSuccess(data, status, headers, config) {
                Snackbar.show('Success! PUD added to Kalendr');
                $rootScope.$broadcast('pud.created', {});
            }
        }

        function validateEvent(fields) {

        }

        function parseCreateEvent(fields) {

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
