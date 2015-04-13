/**
 * Puds
 * @namespace kalendr.puds.services
 */
(function () {
    'use strict';

    angular
        .module('kalendr.puds.services')
        .factory('Puds', Puds);

    Puds.$inject = ['$http'];

    /**
     * @namespace Puds
     * @returns {Factory}
     */
    function Puds($http) {
        var Puds = {
            all: all,
            create: create,
            get: get,
            saveComplete: saveComplete
        };

        return Puds;


        /**
         * @name all
         * @desc Get all Puds
         * @returns {Promise}
         * @memberOf kalendr.puds.services.Puds
         */
        function all() {
            console.log("in all puds");
            return $http.get('/api/v1/puds/');
        }


        /**
         * @name create
         * @desc Create a new Post
         * @param {string} content The content of the new Post
         * @returns {Promise}
         * @memberOf kalendr.puds.services.Puds
         */
        function create(content, notification, priority, priority_int, duration, repeatType, repeat_int,
                        need_repeat, notifyWhen, expires, escalate, expiry, exp_day, expiry_time) {
            //console.log("expires " + expires);
            //console.log("escalates " + escalate);
            //console.log("when " + expiry);
            //console.log("what day " + exp_day);
            //console.log("what time " + expiry_time);
            return $http.post('/api/v1/puds/', {
                content: content,
                notification: notification,
                priority: priority,
                priority_int: priority_int,
                duration: duration,
                repeat: repeatType,
                repeat_int: repeat_int,
                need_repeat: need_repeat,
                notify_when: notifyWhen,
                escalate: escalate,
                expires: expires,
                expiry: expiry,
                expiry_day: exp_day,
                expiry_time: expiry_time
            });
        }


        /**
         * @name get
         * @desc Get the Puds of a given user
         * @param {string} username The username to get Puds for
         * @returns {Promise}
         * @memberOf kalendr.puds.services.Puds
         */

        function get(username) {
            return $http.get('/api/v1/accounts/' + username + '/puds/');
        }

        /**
         * @name saveComplete
         * @desc Set the id'ed pud as complete
         * @param {string} username The username to get Puds for
         * @param {int} pud_id The specific pud
         * @param {boolean} complete The pud completion value to assign
         * @returns {Promise}
         * @memberOf kalendr.puds.services.Puds
         */

        function saveComplete(username, pud_id, complete) {
            return $http.get('/api/v1/accounts/' + username + '/puds/' + pud_id + '/savePud/' + complete + '/pudComplete/');
        }
    }
})();
