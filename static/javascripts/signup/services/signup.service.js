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
            create: create,
            get: get
        };

        return Signup;


        /**
         * @name create
         * @desc Create a new Post
         * @returns {Promise}
         * @memberOf kalendr.signup.services.Signup
         */
        function create(content, location, beginDateTimes, endDateTimes, minTimes, maxTimes, numSlotsPerUser, dayOfWeek, weekNum) {

            return $http.post('/api/v1/signup/', {
                content: content,
                location: location,
                beginDateTimes: beginDateTimes,
                endDateTimes: endDateTimes,
                minTimes: minTimes,
                maxTimes: maxTimes,
                numSlotsPerUser: numSlotsPerUser,
                dayOfWeek: dayOfWeek,
                weekNum: weekNum
            });
        }

        function get(postId){
            return $http.get('/api/v1/signup/' + postId + '');
        }

    }
})();
