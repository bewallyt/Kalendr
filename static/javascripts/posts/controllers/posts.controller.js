/**
 * PostsController
 * @namespace kalendr.posts.controllers
 */
(function () {
    'use strict';

    angular
        .module('kalendr.posts.controllers')
        .controller('PostsController', PostsController);

    PostsController.$inject = ['$timeout', '$scope'];

    /**
     * @namespace PostsController
     */
    function PostsController($timeout, $scope) {
        var vm = this;

        vm.columns = [];

        activate();


        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf kalendr.posts.controllers.PostsController
         */
        function activate() {

            var i;
            for (i = 0; i < $scope.posts.length; i++) {
                console.log($scope.posts[i].content);
            }
            $scope.$watchCollection(function () {
                return $scope.posts;
            }, render);
            $scope.$watch(function () {
                return $(window).width();
            }, render);
        }


        /**
         * @name calculateNumberOfColumns
         * @desc Calculate number of columns based on screen width
         * @returns {Number} The number of columns containing Posts
         * @memberOf kalendr.posts.controllers.PostsControllers
         */
        function calculateNumberOfColumns() {
            var width = $(window).width();
            return 7;
        }


        /**
         * @name approximateShortestColumn
         * @desc An algorithm for approximating which column is shortest
         * @returns The index of the shortest column
         * @memberOf kalendr.posts.controllers.PostsController
         */
        function approximateShortestColumn() {
            var scores = vm.columns.map(columnMapFn);

            return scores.indexOf(Math.min.apply(this, scores));


            /**
             * @name columnMapFn
             * @desc A map function for scoring column heights
             * @returns The approximately normalized height of a given column
             */
            function columnMapFn(column) {
                var lengths = column.map(function (element) {
                    return element.content.length;
                });

                return lengths.reduce(sum, 0) * column.length;
            }


            /**
             * @name sum
             * @desc Sums two numbers
             * @params {Number} m The first number to be summed
             * @params {Number} n The second number to be summed
             * @returns The sum of two numbers
             */
            function sum(m, n) {
                return m + n;
            }
        }


        /**
         * @name render
         * @desc Renders Posts into columns of approximately equal height
         * @param {Array} current The current value of `vm.posts`
         * @param {Array} original The value of `vm.posts` before it was updated
         * @memberOf kalendr.posts.controllers.PostsController
         */
        function render(current, original) {

            if (current !== original) {
                vm.columns = [];

                for (var i = 0; i < calculateNumberOfColumns(); ++i) {
                    console.log('numbofcolumns' + calculateNumberOfColumns());
                    vm.columns.push([]);
                }

                for (var i = 0; i < current.length; ++i) {
                    //console.log('column: ' + column + ' pushing current: ' + current[i].content +" "+current[i].day_of_week);

                    if (current[i].day_of_week=='Sunday') {
                        vm.columns[0].push(current[i]);
                    } else if (current[i].day_of_week=='Monday') {
                        vm.columns[1].push(current[i]);
                    } else if (current[i].day_of_week=='Tuesday') {
                        vm.columns[2].push(current[i]);
                    } else if (current[i].day_of_week=='Wednesday') {
                        vm.columns[3].push(current[i]);
                    } else if (current[i].day_of_week=='Thursday') {
                        vm.columns[4].push(current[i]);
                    } else if (current[i].day_of_week=='Friday') {
                        vm.columns[5].push(current[i]);
                    } else {
                        vm.columns[6].push(current[i]);
                    }

                }
            }
        }
    }
})();
