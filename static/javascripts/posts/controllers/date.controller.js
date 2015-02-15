/**
 * DateController
 * @namespace kalendr.posts.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.posts.controllers')
        .controller('DateController', DateController);

    DateController.$inject = ['$http', '$rootScope', '$scope', '$routeParams', '$routeParams', 'Authentication', 'Snackbar', 'Posts'];

    /**
     * @namespace DateController
     */
    function DateController($http, $rootScope, $scope, Authentication, $routeParams, Snackbar, Posts) {
        var vm = this;
        vm.submit = submit;
        var username = $routeParams.username.substr(1);
        console.log('username changedate: ' + username);


        function submit() {

            console.log(vm.changed_week.getFullYear());
            console.log(vm.changed_week.getMonth());
            console.log(vm.changed_week.getDate());
            var weekNum = getWeekNum(y2k(vm.changed_week.getFullYear()),vm.changed_week.getMonth(),vm.changed_week.getDate()) + 1;
            console.log(weekNum);


            //Posts.getWeek(username, weekNum).then(createPostSuccessFn, createPostErrorFn);
            $http.get('/api/v1/accounts/' + username + '/posts/' + weekNum + '/week/');

            $rootScope.$broadcast('post.getWeek', {
                weekNum: weekNum,
                author: {
                    username: username
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

    function getWeekNum(year, month, day) {
        var when = new Date(year, month, day);
        var newYear = new Date(year, 0, 1);
        var offset = 7 + 1 - newYear.getDay();
        if (offset == 8) offset = 1;
        var daynum = ((Date.UTC(y2k(year), when.getMonth(), when.getDate(), 0, 0, 0) - Date.UTC(y2k(year), 0, 1, 0, 0, 0)) / 1000 / 60 / 60 / 24) + 1;
        var weeknum = Math.floor((daynum - offset + 7) / 7);
        if (weeknum == 0) {
            year--;
            var prevNewYear = new Date(year, 0, 1);
            var prevOffset = 7 + 1 - prevNewYear.getDay();
            if (prevOffset == 2 || prevOffset == 8) weeknum = 53; else weeknum = 52;
        }
        return weeknum;
    }

    function y2k(number) {
        return (number < 1000) ? number + 1900 : number;
    }
})();
