/**
 * Pud
 * @namespace kalendr.puds.directives
 */
(function () {
  'use strict';

  angular
    .module('kalendr.puds.directives')
    .directive('pud', pud);

  /**
   * @namespace Pud
   */
  function pud() {
    /**
     * @name directive
     * @desc The directive to be returned
     * @memberOf kalendr.puds.directives.Pud
     */
    var directive = {
      restrict: 'E',
      scope: {
        pud: '='
      },
      templateUrl: '/static/templates/puds/pud.html'
    };

    return directive;
  }
})();
