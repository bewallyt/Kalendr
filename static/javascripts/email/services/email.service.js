(function () {
    'use strict';

    angular
        .module('kalendr.email.services')
        .factory('Email', Email);

    Email.$inject = ['$http'];

    /**
     * @namespace Email
     * @returns {Factory}
     */
    function Email($http) {
        var Email = {
            create: create
        };

        return Email;


        function create(start_date, end_date, format) {
            console.log(start_date);
            console.log(end_date);
            console.log(format);
            return $http.post('/api/v1/schedule/', {
               start_date: start_date,
               end_date: end_date,
               format: format
            });
        }
    }
})();
