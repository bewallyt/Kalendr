/**
 * Posts
 * @namespace kalendr.posts.services
 */
(function () {
    'use strict';

    angular
        .module('kalendr.groups.services')
        .factory('Groups', Groups);

    Groups.$inject = ['$http'];

    /**
     * @namespace Posts
     * @returns {Factory}
     */
    function Groups($http) {
        var Groups = {
            all: all,
            get: get,
            create: create,
            getFollowing: getFollowing,
            getSpecific: getSpecific
        };

        return Groups;

        ////////////////////

        /**
         * @name all
         * @desc Get all Posts
         * @returns {Promise}
         * @memberOf kalendr.posts.services.Posts
         */
        function all() {
            console.log('showing all groups');
            debugger;
            return $http.get('/api/v1/groups/');
        }


        /**
         * @name create
         * @desc Create a new Post
         * @param {string} content The content of the new Post
         * @returns {Promise}
         * @memberOf kalendr.posts.services.Posts
         */
        function create(name, members, owner, isFollower) {
            console.log('creating groups');
            console.log('name of group: ' + name);
            console.log('members of group: ' + members);
            console.log('owner of group: ' + owner);
            return $http.post('/api/v1/groups/', {
                name: name,
                owner: owner,
                members: members,
                is_follow_group: isFollower
            });
        }


        /**
         * @name get
         * @desc Get the Posts of a given user
         * @param {string} username The username to get Posts for
         * @returns {Promise}
         * @memberOf kalendr.posts.services.Posts
         */
        function get(id) {
            console.log('getting groups');
            return $http.get('/api/v1/accounts/' + id + '/groups/');
        }

        function getFollowing(id) {
            console.log('getting following');
            return $http.get('/api/v1/accounts/' + id + '/following/');
        }

        function getSpecific(id) {
            console.log('getting specific group');
            return $http.get('/api/v1/accounts/' + id + '/specific_group/');
        }
    }
})();