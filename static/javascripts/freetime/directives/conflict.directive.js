/**
 * Conflict
 * @namespace kalendr.freetime.directives
 */
(function () {
    'use strict';

    angular
        .module('kalendr.freetime.directives')
        .directive('conflict', conflict);

    /**
     * @namespace Conflict
     */
    function conflict() {
        /**
         * @name directive
         * @desc The directive to be returned
         * @memberOf kalendr.freetime.directives.Conflict
         */
        var directive = {
            restrict: 'E',
            scope: {
                conflict: '='
            },
            templateUrl: '/static/templates/freetime/conflict.html'
        };

        return directive;
    }
})();
