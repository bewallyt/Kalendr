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
            get: get
        };

        return Puds;

        ////////////////////

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
                        need_repeat, notifyWhen) {
            console.log('in puds.service.js create()');
            console.log('pud content: ' + content);
            console.log('notification: ' + notification);
            console.log('priority: ' + priority);
            console.log('priority int: ' + priority_int);
            console.log('duration: ' + duration);
            console.log('repeat: ' + repeatType);
            console.log('repeat_int: ' + repeat_int);
            console.log('need_repeat: ' + need_repeat);
            console.log('notifyWhen: ' + notifyWhen);
            return $http.post('/api/v1/puds/', {
                content: content,
                notification: notification,
                priority: priority,
                priority_int: priority_int,
                duration: duration,
                repeat: repeatType,
                repeat_int: repeat_int,
                need_repeat: need_repeat,
                notify_when: notifyWhen
            });
        }


        /**
         * @name get
         * @desc Get the Puds of a given user
         * @param {string} username The username to get Puds for
         * @returns {Promise}
         * @memberOf kalendr.puds.services.Puds
         */

        function get(id) {
            console.log('in get puds');
            return $http.get('/api/v1/accounts/' + id + '/puds/');
        }
    }
})();
