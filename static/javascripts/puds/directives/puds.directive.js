/**
 * Puds
 * @namespace kalendr.puds.directives
 */
(function () {
    'use strict';

    angular
        .module('kalendr.puds.directives')
        .directive('puds', puds);

    /**
     * @namespace Puds
     */
    function puds() {
        console.log('in puds directive');
        /**
         * @name directive
         * @desc The directive to be returned
         * @memberOf kalendr.puds.directives.Puds
         */
        var directive = {
            controller: 'PudsController',
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                puds: '='
            },
            templateUrl: '/static/templates/puds/puds.html'
        };

        return directive;
    }
})();
