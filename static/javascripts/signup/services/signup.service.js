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
            createPref: createPref,
            get: get,
            searchSlots: searchSlots,
            confirmSlots: confirmSlots,
            searchPrefSlots: searchPrefSlots,
            confirmPrefSlots: confirmPrefSlots,
            suggestSchedule: suggestSchedule,
            resolveSchedule: resolveSchedule
        };

        return Signup;


        /**
         * @name create
         * @desc Create a new Post
         * @returns {Promise}
         * @memberOf kalendr.signup.services.Signup
         */
        function create(content, location, beginDateTimes, endDateTimes, minTimes, maxTimes, numSlotsPerUser, dayOfWeek, weekNum) {

            console.log('minTimes' + minTimes);
            console.log('maxTimes' + minTimes);

            for(var i = 0; i < minTimes.length; i++) console.log(minTimes);

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


        /*Benson to David: API call for prefBased Signups*/
        function createPref(content, location, beginDateTimes, endDateTimes, dayOfWeek, weekNum, preferenceDuration) {

            return $http.post('/api/v1/signupPref/', {
                content: content,
                location: location,
                beginDateTimes: beginDateTimes,
                endDateTimes: endDateTimes,
                dayOfWeek: dayOfWeek,
                weekNum: weekNum,
                duration: preferenceDuration
            });
        }

        function get(postId) {
            return $http.get('/api/v1/signup/' + postId + '/get_description/');
        }

        function searchSlots(postId, duration) {
            return $http.get('/api/v1/signup/' + postId + '/get_description/' + duration + '/request/');
        }

        //Benson: pref search Slot api call
        function searchPrefSlots(postId) {
            return $http.get('/api/v1/signup/' + postId + '/prefSlots/');
        }

        function confirmSlots(postId, startTimes, endTimes) {
            console.log(startTimes);
            console.log(endTimes);
            return $http.post('/api/v1/signup/' + postId + '/request/', {
                    postPk: postId,
                    beginDateTimes: startTimes,
                    endDateTimes: endTimes
                }
            )

        }

        //Benson: pref confirm pref slot template added
        function confirmPrefSlots(postId, preferenceList, startTimes, endTimes) {
            return $http.post('/api/v1/signup/' + postId + '/requestPref/', {
                    postPk: postId,
                    preference: preferenceList,
                    beginDateTimes: startTimes,
                    endDateTimes: endTimes
                }
            )
        }

        function suggestSchedule(postId) {
            return $http.get('/api/v1/signup/' + postId + '/get_suggestion/');
        }

        function resolveSchedule(postId, usernames) {
            return $http.post('/api/v1/signup/' + postId + '/resolve_schedule/', {
                    postPk: postId,
                    usernames: usernames
                }
            )
        }
    }
})();
