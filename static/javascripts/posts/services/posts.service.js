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
            create: create,
            getWeek: getWeek,
            getNotificationPosts: getNotificationPosts
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
         * @returns {Promise}
         * @memberOf kalendr.posts.services.Posts
         */
        function create(content, start_time, notification, notify_when, repeat, location_event, description_event, begin_time, end_time,
                        end_repeat, not_all_day, day_of_week, need_repeat, week_num, is_week_set, pud_time, pud, duration) {

            if (end_repeat === null) end_repeat = start_time;
            //console.log('duration of calendar event: ' + duration);
            return $http.post('/api/v1/posts/', {
                content: content,
                start_time: start_time,
                notification: notification,
                notify_when: notify_when,
                location_event: location_event,
                repeat: repeat,
                description_event: description_event,
                begin_time: begin_time,
                end_time: end_time,
                end_repeat: end_repeat,
                not_all_day: not_all_day,
                day_of_week: day_of_week,
                need_repeat: need_repeat,
                week_num: week_num,
                is_week_set: is_week_set,
                pud_time: pud_time,
                pud: pud,
                duration: duration
            });
        }



        /**
         * @name get
         * @desc Get the Posts of a given user
         * @returns {Promise}
         * @memberOf kalendr.posts.services.Posts
         */
        //function get(id) {
        //    return $http.get('/api/v1/accounts/' + id + '/posts/');
        //}

        function getWeek(id, weekNum) {
            console.log('in get week');
            return $http.get('/api/v1/accounts/' + id + '/posts/' + weekNum + '/week/');
        }

        function getNotificationPosts(){
            return $http.get('/api/v1/notification_posts/');
        }
    }
})();
