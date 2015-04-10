(function () {
    'use strict';

    angular
        .module('kalendr.routes')
        .config(config);

    config.$inject = ['$routeProvider'];

    /**
     * @name config
     * @desc Define valid application routes
     */
    function config($routeProvider) {
        $routeProvider.when('/kalendr', {
            controller: 'AccountController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/accounts/account.html'
        }).when('/', {
            controller: 'LoginController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/authentication/login.html'
        }).when('/:username', {
            controller: 'AccountController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/accounts/account.html'
        }).when('/:user/settings', {
            controller: 'AccountSettingsController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/accounts/settings.html'
        }).when('/:username/groups', {
            controller: 'GroupController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/groups/groups.html'
        }).otherwise('/');
    }
})();
