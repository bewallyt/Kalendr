(function () {
    'use strict';

    angular
        .module('kalendr.freetime.services')
        .factory('FreeTimes', FreeTimes);

    FreeTimes.$inject = ['$http'];

    /**
     * @namespace FreeTime
     * @returns {Factory}
     */
    function FreeTimes($http) {
        var FreeTimes = {
            create: create
        };

        return FreeTimes;

        /**
         * @name create
         * @desc Create a new FreeTime request
         * @param {string} event_type The type of event to search freetime for (one-time or recurring)
         * @param {*} start_date
         * @param {*} end_date
         * @param {number} duration_hrs Minimum hour duration of freetime
         * @param {number} duration_min Minimum minute duration of freetime
         * @param {*} start_time Search start time
         * @param {*} end_time Search end time
         * @param {Object[]} which_days Which days to search
         * @param {Object[]} users_following Which users to search amongst
         * @returns {Promise}
         * @memberOf kalendr.puds.services.Puds
         */
        function create(event_type, start_date, end_date, duration_hrs, duration_min, start_time, end_time,
                        which_days, users_following) {
            console.log('made it here');
            console.log(event_type + " event type");
            console.log(start_date + " start date");
            console.log(end_date + " end date");
            console.log(duration_hrs + " hours");
            console.log(duration_min + " minutes");
            console.log(start_time + " start time");
            console.log(end_time + " end time");
            which_days.forEach(function (entry) {
                console.log(entry + " day");
            });
            users_following.forEach(function (entry) {
                console.log(entry + " following");
            });
            /**
             return $http.post('correct url goes here', {
                event_type: event_type,
                start_date: start_date,
                end_date: end_date,
                duration_hrs: duration_hrs,
                duration_min: duration_min,
                start_time: start_time,
                end_time: end_time,
                which_days: which_days,
                users_following: users_following
            });
             */
        }
    }
})();
