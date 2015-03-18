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
            savePost: savePost,
            pudPostUpdate: pudPostUpdate,
            getNotificationPosts: getNotificationPosts,
            getSharedFollowing: getSharedFollowing,
            updateEvent: updateEvent
        };

        return Posts;


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

        function updateEvent(content, start_time, notification, notify_when, repeat, location_event, description_event, begin_time, end_time,
                        end_repeat, not_all_day, day_of_week, need_repeat, week_num, is_week_set, pud_time, pud, duration, postId) {

            if (end_repeat === null) end_repeat = start_time;
            //console.log('duration of calendar event: ' + duration);
            return $http.post('/api/v1/post_update/', {
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
                duration: duration,
                post_id: postId,
                is_updated: true
            });
        }



        /**
         * @name get
         * @desc Get the Posts of a given user for a certain week
         * @returns An array of post objects
         * @memberOf kalendr.posts.services.Posts
         */

        function getWeek(id, weekNum) {
            return $http.get('/api/v1/accounts/' + id + '/posts/' + weekNum + '/week/');
        }

        /**
         * @name get
         * @desc Get the Posts of a given user for a certain week, after assigning a specific pud to the id'ed post
         * @returns An array of post objects
         * @memberOf kalendr.posts.services.Posts
         */

        function savePost(id, post_id, weekNum) {
            return $http.get('/api/v1/accounts/' + id + '/posts/' + post_id + '/savePostPud/' + weekNum + '/pudContent/');
        }

        function pudPostUpdate(username, pud_id) {
            return $http.get('/api/v1/accounts/' + username + '/posts/' + pud_id + '/updatePostPud/');
        }

        function getSharedFollowing(id) {
            console.log('in get week');
            return $http.get('/api/v1/accounts/' + id + '/get_shared/');
        }

        function getNotificationPosts(){
            return $http.get('/api/v1/notification_posts/');
        }
    }
})();
