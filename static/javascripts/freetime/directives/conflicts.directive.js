/**
 * Conflicts
 * @namespace kalendr.freetime.directives
 */
(function () {
    'use strict';

    angular
        .module('kalendr.freetime.directives')
        .directive('conflicts', conflicts);

    /**
     * @namespace Conflicts
     */
    function conflicts() {
        console.log('in conflicts directive');
        /**
         * @name directive
         * @desc The directive to be returned
         * @memberOf kalendr.freetime.directives.Conflicts
         */
        var directive = {
            controller: 'ConflictsController',
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                conflicts: '='
            },
            templateUrl: '/static/templates/freetime/conflicts.html'
        };

        return directive;
    }
})();
