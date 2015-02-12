/**
 * DateController
 * @namespace thinkster.posts.controllers
 */
(function () {
    'use strict';

    angular
        .module('thinkster.posts.controllers')
        .controller('DateController', DateController);

    DateController.$inject = ['$rootScope', '$scope', '$routeParams', 'Authentication', 'Snackbar', 'Posts'];

    /**
     * @namespace DateController
     */
    function DateController($rootScope, $scope,Authentication, Snackbar, Posts) {
        var vm = this;
        vm.submit = submit;

        function submit() {


            Posts.create(vm.content, vm.start_time, vm.notification, vm.repeat, vm.location_event,
                vm.description_event, vm.begin_time, vm.end_time, vm.end_repeat, vm.not_all_day, dayOfWeek,
                vm.need_repeat).then(createPostSuccessFn, createPostErrorFn);

            $rootScope.$broadcast('post.created', {
                content: vm.content,
                repeat: vm.repeat,
                start_time: vm.start_time,
                notification: vm.notification,
                location_event: vm.location_event,
                description_event: vm.description_event,
                begin_time: vm.begin_time,
                end_time: vm.end_time,
                end_repeat: vm.end_repeat,
                not_all_day: vm.not_all_day,
                dayOfWeek: dayOfWeek,
                author: {
                    username: Authentication.getAuthenticatedAccount().username
                }
            });

            $scope.closeThisDialog();



            function createPostSuccessFn(data, status, headers, config) {
                Snackbar.show('Success! Event added to Kalendr');
            }


            function createPostErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('post.created.error');
                Snackbar.error(data.error);
            }
        }
    }
})();
