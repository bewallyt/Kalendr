/**
 * Posts
 * @namespace kalendr.posts.services
 */
(function () {
    'use strict';

    angular
        .module('kalendr.posts.services')
        .factory('Posts', Posts);

    Posts.$inject = ['$http'];

    /**
     * @namespace Posts
     * @returns {Factory}
     */
    function Posts($http) {
        var Posts = {
            all: all,
            get: get,
            create: create
        };

        return Posts;

        ////////////////////

        /**
         * @name all
         * @desc Get all Posts
         * @returns {Promise}
         * @memberOf kalendr.posts.services.Posts
         */
        function all() {
            return $http.get('/api/v1/posts/');
        }


        /**
         * @name create
         * @desc Create a new Post
         * @param {string} content The content of the new Post
         * @returns {Promise}
         * @memberOf kalendr.posts.services.Posts
         */
        function create(content, start_time, notification, repeat, location_event, description_event, begin_time, end_time,
                        end_repeat, not_all_day, day_of_week, need_repeat) {

            if (end_repeat === null) end_repeat = start_time;
            //console.log('start_time of event: ' + start_time);
            console.log('asked for notification: ' + notification);
            console.log('repeats: ' + repeat);
            console.log('begin_time ' + begin_time);
            console.log('end_time ' + end_time);
            console.log('description: ' + description_event);
            console.log('location_event: ' + location_event);
            return $http.post('/api/v1/posts/', {
                content: content,
                start_time: start_time,
                notification: notification,
                location_event: location_event,
                repeat: repeat,
                description_event: description_event,
                begin_time: begin_time,
                end_time: end_time,
                end_repeat: end_repeat,
                not_all_day: not_all_day,
                day_of_week: day_of_week,
                need_repeat: need_repeat
            });
        }


        /**
         * @name get
         * @desc Get the Posts of a given user
         * @param {string} username The username to get Posts for
         * @returns {Promise}
         * @memberOf kalendr.posts.services.Posts
         */
        function get(id) {
            return $http.get('/api/v1/accounts/' + id + '/posts/');
        }
    }
})();
