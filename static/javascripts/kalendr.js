(function () {
    'use strict';

    angular
        .module('kalendr', [
            'kalendr.config',
            'kalendr.routes',
            'kalendr.accounts',
            'kalendr.authentication',
            'kalendr.groups',
            'kalendr.layout',
            'kalendr.posts',
            'kalendr.puds',
            'kalendr.utils',
            'ui.bootstrap',
            'angucomplete'
        ]);

    angular
        .module('kalendr.config', []);

    angular
        .module('kalendr.routes', ['ngRoute']);

    angular
        .module('kalendr')
        .run(run);

    run.$inject = ['$http'];

    /**
     * @name run
     * @desc Update xsrf $http headers to align with Django's defaults
     */
    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }
})();
