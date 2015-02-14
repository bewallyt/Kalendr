/**
 * DateController
 * @namespace kalendr.posts.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.posts.controllers')
        .controller('DateController', DateController);

    DateController.$inject = ['$rootScope', '$scope', '$routeParams','$routeParams', 'Authentication', 'Snackbar', 'Posts'];

    /**
     * @namespace DateController
     */
    function DateController($rootScope, $scope, Authentication, $routeParams, Snackbar, Posts) {
        var vm = this;
        vm.submit = submit;
        var username = $routeParams.username.substr(1);


        function submit() {

            var weekNum = vm.start_time.isocalendar()[1];

            Posts.getWeek(username, weekNum).then(createPostSuccessFn, createPostErrorFn);

            $rootScope.$broadcast('post.getWeek', {
                weekNum: weekNum,
                author: {
                    username: Authentication.getAuthenticatedAccount().username
                }
            });

            $scope.closeThisDialog();



            function createPostSuccessFn(data, status, headers, config) {
                Snackbar.show('Success! Week Changed');
            }


            function createPostErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('post.created.error');
                Snackbar.error(data.error);
            }
        }
    }
})();
