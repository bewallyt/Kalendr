/**
 * Authentication
 * @namespace kalendr.authentication.services
 */
(function () {
    'use strict';

    angular
        .module('kalendr.authentication.services')
        .factory('Authentication', Authentication);

    Authentication.$inject = ['$rootScope', '$cookies', '$http', 'Posts'];

    /**
     * @namespace Authentication
     * @returns {Factory}
     */
    function Authentication($rootScope, $cookies, $http, Posts) {
        /**
         * @name Authentication
         * @desc The Factory to be returned
         */
        var Authentication = {
            getAuthenticatedAccount: getAuthenticatedAccount,
            isAuthenticated: isAuthenticated,
            login: login,
            logout: logout,
            register: register,
            setAuthenticatedAccount: setAuthenticatedAccount,
            unauthenticate: unauthenticate,
            getUsers: getUsers
        };

        return Authentication;

        ///////////////////

        /**
         * @name getAuthenticatedAccount
         * @desc Return the currently authenticated account
         * @returns {object|undefined} Account if authenticated, else `undefined`
         * @memberOf kalendr.authentication.services.Authentication
         */
        function getAuthenticatedAccount() {
            if (!$cookies.authenticatedAccount) {
                return;
            }

            return JSON.parse($cookies.authenticatedAccount);
        }


        /**
         * @name isAuthenticated
         * @desc Check if the current user is authenticated
         * @returns {boolean} True is user is authenticated, else false.
         * @memberOf kalendr.authentication.services.Authentication
         */
        function isAuthenticated() {
            return !!$cookies.authenticatedAccount;
        }

        function getUsers() {
            return $http.get('api/v1/accounts/')
        }


        /**
         * @name login
         * @desc Try to log in with email `email` and password `password`
         * @param {string} email The email entered by the user
         * @param {string} password The password entered by the user
         * @returns {Promise}
         * @memberOf kalendr.authentication.services.Authentication
         */
        function login(email, password) {
            return $http.post('/api/v1/auth/login/', {
                email: email, password: password
            }).then(loginSuccessFn, loginErrorFn);

            /**
             * @name loginSuccessFn
             * @desc Set the authenticated account and redirect to index
             */
            function loginSuccessFn(data, status, headers, config) {
                Authentication.setAuthenticatedAccount(data.data);

                window.location = '/+' + data.data.username;
                var now = Date();
                Posts.getWeek(data.data.username, now.getWeekNum()).then(postsSuccessFn, postsErrorFn);


            }

            function postsSuccessFn(data, status, headers, config) {
                var posts = data.data;
                var

                var i;
                for(i = 0; i < posts.length; i++){
                    if(posts[i].start_time.getDay() !=)
                }

            }


            /**
             * @name loginErrorFn
             * @desc Log "Epic failure!" to the console
             */
            function loginErrorFn(data, status, headers, config) {
                console.error('BLAH!');
            }
        }


        /**
         * @name logout
         * @desc Try to log the user out
         * @returns {Promise}
         * @memberOf kalendr.authentication.services.Authentication
         */
        function logout() {
            return $http.post('/api/v1/auth/logout/')
                .then(logoutSuccessFn, logoutErrorFn);

            /**
             * @name logoutSuccessFn
             * @desc Unauthenticate and redirect to index with page reload
             */
            function logoutSuccessFn(data, status, headers, config) {
                Authentication.unauthenticate();

                window.location = '/';
            }

            /**
             * @name logoutErrorFn
             * @desc Log "Epic failure!" to the console
             */
            function logoutErrorFn(data, status, headers, config) {
                console.error('Epic failure!');
            }
        }


        /**
         * @name register
         * @desc Try to register a new user
         * @param {string} email The email entered by the user
         * @param {string} password The password entered by the user
         * @param {string} username The username entered by the user
         * @returns {Promise}
         * @memberOf kalendr.authentication.services.Authentication
         */
        function register(email, password, username) {
            return $http.post('/api/v1/accounts/', {
                username: username,
                password: password,
                email: email
            }).then(registerSuccessFn, registerErrorFn);

            /**
             * @name registerSuccessFn
             * @desc Log the new user in
             */
            function registerSuccessFn(data, status, headers, config) {
                $rootScope.$broadcast('post.created', {
                    content: 'New Year\'s Day',


                    author: {
                        username: username
                    }
                });
                Authentication.login(email, password);
            }

            /**
             * @name registerErrorFn
             * @desc Log "Epic failure!" to the console
             */
            function registerErrorFn(data, status, headers, config) {
                console.error('Epic failure!');
            }
        }


        /**
         * @name setAuthenticatedUser
         * @desc Stringify the account object and store it in a cookie
         * @param {Object} account The acount object to be stored
         * @returns {undefined}
         * @memberOf kalendr.authentication.services.Authentication
         */
        function setAuthenticatedAccount(account) {
            $cookies.authenticatedAccount = JSON.stringify(account);
        }


        /**
         * @name unauthenticate
         * @desc Delete the cookie where the account object is stored
         * @returns {undefined}
         * @memberOf kalendr.authentication.services.Authentication
         */
        function unauthenticate() {
            delete $cookies.authenticatedAccount;
        }
    }

    function getTimeOfDay(hour){
        if(hour < 5 && hour > 20) return 'Night';
        else if (hour >= 5 && hour < 12) return 'Morning';
        else if (hour < 12 && hour < 6) return 'Afternoon';
        else return 'Evening';
    }

    Date.prototype.getWeekNum = function () {
        var determinedate = new Date();
        determinedate.setFullYear(this.getFullYear(), this.getMonth(), this.getDate());
        var D = determinedate.getDay();
        var addForSunday = 0;
        if (D == 0) {
            D = 7;
            addForSunday = 1
        }
        determinedate.setDate(determinedate.getDate() + (4 - D));
        var YN = determinedate.getFullYear();
        var ZBDoCY = Math.floor((determinedate.getTime() - new Date(YN, 0, 1, -6)) / 86400000);
        var WN = 1 + Math.floor(ZBDoCY / 7) + addForSunday;
        return WN;
    }
})();
