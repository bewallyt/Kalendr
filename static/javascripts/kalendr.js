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
            'kalendr.signup',
            'kalendr.access',
            'kalendr.utils',
            'kalendr.freetime',
            'kalendr.enmasse',
            'kalendr.email',
            'ui.bootstrap',
            'angucomplete',
            'ngAnimate',
            'ngMaterial'
        ]).config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('blue', {
                    'default': '500', // by default use shade 400 from the blue palette for primary intentions
                    'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                    'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                    'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
                })
                .accentPalette('orange');
        });

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
