/**
 * Signup
 * @namespace kalendr.signup.services
 */
(function () {
    'use strict';

    angular
        .module('kalendr.signup.services')
        .factory('Signup', Signup);

    Signup.$inject = ['$http'];

    /**
     * @namespace Signup
     * @returns {Factory}
     */
    function Signup($http) {
        var Signup = {
        create: create
        };

        return Signup;


        /**
         * @name create
         * @desc Create a new Post
         * @returns {Promise}
         * @memberOf kalendr.signup.services.Signup
         */
        function create(content, start_time, location_event, begin_time, end_time,
                        day_of_week, week_num) {

            return $http.post('/api/v1/signup/', {
                content: content,
                start_time: start_time,
                location_event: location_event,
                begin_time: begin_time,
                end_time: end_time,
                day_of_week: day_of_week,
                week_num: week_num
            });
        }

    }
})();
