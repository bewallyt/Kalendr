/**
 * GroupController
 * @namespace kalendr.Group.controllers
 */

/**
 * BENSON: FYI this code is currently superfluous..
 */
(function () {
    'use strict';

    angular
        .module('kalendr.groups.controllers')
        .controller('GroupController', GroupController);

    GroupController.$inject = ['$scope', '$rootScope', '$window', 'Groups'];

    /**
     * @namespace GroupController
     */
    function GroupController($scope, $rootScope, $window, Groups) {
        var vm = this;
        $rootScope.name;



        $rootScope.$on('group.clicked', function (event, group) {
            console.log('group clicked: ');
            Groups.getSpecific(group.created_at).then(groupSuccessFn, groupErrorFn);
        });

        function groupSuccessFn(data, status, headers, config) {

            console.log(data.data);
            vm.name = data.data[0].name;
            $rootScope.name = data.data[0].name;
            vm.owner = data.data[0].owner.username;
            vm.members = data.data[0].members;

            console.log('vm.name: ' + vm.name);
            console.log('vm.owner: ' + vm.owner);
            console.log('vm.members: ' + vm.members);
        }


        function groupErrorFn(data, status, headers, config) {
            Snackbar.error(data.data.error);
        }

        $scope.$watch(function () {
                console.log('rootscopename: ' + $rootScope.name);
                return vm.name
            },
            function () {
            }
        );


    }
})();
