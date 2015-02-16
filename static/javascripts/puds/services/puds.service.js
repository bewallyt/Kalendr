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
            return $http.get('/api/v1/puds/');
        }


        /**
         * @name create
         * @desc Create a new Post
         * @param {string} content The content of the new Post
         * @returns {Promise}
         * @memberOf kalendr.puds.services.Puds
         */
        function create() {
            return $http.post('/api/v1/puds/', {});
        }


        /**
         * @name get
         * @desc Get the Puds of a given user
         * @param {string} username The username to get Puds for
         * @returns {Promise}
         * @memberOf kalendr.puds.services.Puds
         */

        function get(id) {
            return $http.get('/api/v1/accounts/' + id + '/puds/');
        }
    }
})();
