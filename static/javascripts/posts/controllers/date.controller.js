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
            var weekNum = vm.changed_week.getWeekNum();
            console.log(weekNum);
            console.log(vm.changed_week);


            //Posts.getWeek(username, weekNum).then(createPostSuccessFn, createPostErrorFn);
            //$http.get('/api/v1/accounts/' + username + '/posts/' + weekNum + '/week/');

            $rootScope.$broadcast('post.getWeek', {
                weekNum: weekNum,
                date: vm.changed_week
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

    Date.prototype.getWeekNum = function () {
        var determinedate = new Date();
        determinedate.setFullYear(this.getFullYear(), this.getMonth(), this.getDate());
        var D = determinedate.getDay();
        var addForSunday = 0;
        if (D == 0){
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
