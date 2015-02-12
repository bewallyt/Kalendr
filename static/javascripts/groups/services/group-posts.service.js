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
      create: create
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
    function create(name, members, owner, is_private) {
        console.log('creating groups');
        console.log('name of group: ' + name);
        console.log('members of group: ' + members);
        console.log('owner of group: ' + owner);
      return $http.post('/api/v1/groups/', {
        name: name,
          owner: owner,
        members: members
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
  }
})();