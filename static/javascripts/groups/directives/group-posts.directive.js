/**
 * Posts
 * @namespace kalendr.posts.directives
 */
(function () {
  'use strict';

  angular
    .module('kalendr.groups.directives')
    .directive('groups', groups);

  /**
   * @namespace Posts
   */
  function groups() {
      console.log('in groups directive');
    /**
     * @name directive
     * @desc The directive to be returned
     * @memberOf kalendr.posts.directives.Posts
     */
    var directive = {
      controller: 'GroupPostsController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        groups: '='
      },
      //templateUrl: '/static/templates/groups/group-posts.html'
    };

    return directive;
  }
})();
