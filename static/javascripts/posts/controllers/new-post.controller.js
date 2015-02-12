/**
 * NewPostController
 * @namespace kalendr.posts.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.posts.controllers')
        .controller('NewPostController', NewPostController);

    NewPostController.$inject = ['$rootScope', '$scope', '$routeParams', 'Authentication', 'Snackbar', 'Posts'];

    /**
     * @namespace NewPostController
     */
    function NewPostController($rootScope, $scope, $routeParams, Authentication, Snackbar, Posts) {
        var vm = this;
        vm.submit = submit;
        vm.need_repeat = false;


        /**
         * @name submit
         * @desc Create a new Post
         * @memberOf kalendr.posts.controllers.NewPostController
         */
        function submit() {

            var num_day = vm.start_time.getDay();
            var dayOfWeek;
            if (num_day == 0) dayOfWeek = 'Sunday';
            else if (num_day == 1) dayOfWeek = 'Monday';
            else if (num_day == 2) dayOfWeek = 'Tuesday';
            else if (num_day == 3) dayOfWeek = 'Wednesday';
            else if (num_day == 4) dayOfWeek = 'Thursday';
            else if (num_day == 5) dayOfWeek = 'Friday';
            else dayOfWeek = 'Saturday';


            if (vm.begin_time === null) vm.begin_time = '';
            if (vm.end_time === null) vm.end_time = '';

            if (vm.notification === undefined) vm.notification = false;


            if (vm.repeat == 'Weekly' ||
                vm.repeat == 'Monthly' ||
                vm.repeat == 'Daily') vm.need_repeat = true;

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


            /**
             * @name createPostSuccessFn
             * @desc Show snackbar with success message
             */
            function createPostSuccessFn(data, status, headers, config) {
                Snackbar.show('Success! Event added to Kalendr');
            }


            /**
             * @name createPostErrorFn
             * @desc Propogate error event and show snackbar with error message
             */
            function createPostErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('post.created.error');
                Snackbar.error(data.error);
            }
        }
    }
})();
