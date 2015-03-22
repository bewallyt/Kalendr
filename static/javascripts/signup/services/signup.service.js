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
        function create(content, dates, location, beginTimes, endTimes, dayOfWeek,
                 weekNum, minTimes, maxTimes, numSlotsPerUser) {

            return $http.post('/api/v1/signup/', {
                content: content,
                dates: dates,
                location: location,
                beginTimes: beginTimes,
                endTimes: endTimes,
                dayOfWeek: dayOfWeek,
                weekNum: weekNum,
                minTimes: minTimes,
                maxTimes: maxTimes,
                numSlotsPerUser: numSlotsPerUser
            });
        }

    }
})();
