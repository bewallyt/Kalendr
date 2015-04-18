/**
 * LoginController
 * @namespace kalendr.authentication.controllers
 */
(function () {
    'use static';

    angular
        .module('kalendr.authentication.controllers')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', '$scope', 'Authentication'];

    /**
     * @namespace LoginController
     */
    function LoginController($location, $scope, Authentication) {
        var vm = this;

        vm.login = login;

        vm.register = register;

        activate();

        vm.showLogin = showLogin;
        vm.isPrompted = false;

        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf kalendr.authentication.controllers.LoginController
         */
        function activate() {
            // If the user is authenticated, they should not be here.
            if (Authentication.isAuthenticated()) {
                $location.url('/kalendr');
            }

            var tabs = [
                    {title: 'Login', content: "Tabs will become paginated if there isn't enough room for them."},
                    {title: 'Register', content: "You can swipe left and right on a mobile device to change tabs."},

                ],
                selected = null,
                previous = null;
            $scope.tabs = tabs;
            $scope.selectedIndex = 2;
            $scope.$watch('selectedIndex', function (current, old) {
                previous = selected;
                selected = tabs[current];
            });

        }

        /**
         * @name login
         * @desc Log the user in
         * @memberOf kalendr.authentication.controllers.LoginController
         */
        function login() {
            Authentication.login(vm.email, vm.password);
        }

        function register() {
            Authentication.register(vm.email, vm.password, vm.username);
        }

        function showLogin(){
            console.log('is prompted');
            vm.isPrompted = true;
        }


    }
})();