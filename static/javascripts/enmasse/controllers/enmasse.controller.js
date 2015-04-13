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
        vm.lineNumber;

        function check(event, keyCode) {
            var textArea = event.target;
            if (keyCode == 13) {
                vm.lineNumber = textArea.value.substr(0, textArea.selectionStart).split("\n").length;
                //console.log("line number: " + vm.lineNumber);
                var lines = vm.text.split("\n");
                //console.log(lines[vm.lineNumber - 1]);
                directToRule(lines[vm.lineNumber - 1]);
            }
        }

        function directToRule(line) {
            var fields = line.split(";");
            var forFields = [];
            var i;
            for (i = 0; i < fields.length; i++) {
                forFields[i] = fields[i].trim();
            }

            forFields = forFields.slice(0, forFields.length - 1);
            //forFields.forEach(function (entry) {
            //    console.log(entry + " field");
            //});

            if (forFields[0] == 'pud') {
                validatePud(forFields);
            } else if (forFields[0] == 'event') {
                validateEvent(forFields);
            } else if (forFields[0] == 'signup') {
                validateSignUp(forFields);
            }
        }

        function validatePud(fields) {

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

            if (!expires) {
                expiry = new Date();
                exp_day = 32;
                expiry_time = expiry;
            }

            console.log("content: " + content);
            console.log("priority: " + priority);
            console.log("pr int: " + priority_int);
            console.log("duration: " + duration);
            console.log("repeat: " + repeat);
            console.log("re type: " + repeatType);
            console.log("re int: " + repeat_int);
            console.log("expires: " + expires);
            console.log("escalate: " + escalate);
            console.log("ex-time: " + expiry_time);
            console.log("expiry: " + expiry);
            console.log("ex-day: " + exp_day);
            console.log("notify: " + notify);
            console.log("notify when: " + notifyWhen);
            console.log("\n");

            Puds.create(content, notify, priority, priority_int, duration, repeatType, repeat_int,
                repeat, notifyWhen, expires, escalate, expiry, exp_day, expiry_time).then(pudSuccess);

            function pudSuccess(data, status, headers, config) {
                Snackbar.show('Success! PUD added to Kalendr');
                $rootScope.$broadcast('pud.created', {});
            }
        }

        function validateEvent(fields) {

        }

        function validateSignUp(fields) {

        }

        function submit() { //called when all the lines are validated and user clicks submit
        }
    }
})
();
