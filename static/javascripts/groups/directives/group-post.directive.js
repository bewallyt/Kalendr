/**
 * Post
 * @namespace kalendr.posts.directives
 */
(function () {
  'use strict';

  angular
    .module('kalendr.groups.directives')
    .directive('group', group);

  /**
   * @namespace Post
   */
  function group() {
    /**
     * @name directive
     * @desc The directive to be returned
     * @memberOf kalendr.posts.directives.Post
     */
    var directive = {
      restrict: 'E',
      scope: {
        group: '='
      },
      //templateUrl: '/static/templates/groups/group-post.html'
    };

    return directive;
  }
})();
