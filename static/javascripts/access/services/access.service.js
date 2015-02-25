/**
 * Access
 * @namespace kalendr.access.services
 */
(function () {

    angular
        .module('kalendr.access.services')
        .factory('Access', Access);

    Access.$inject = ['$http'];

    /**
     * @namespace Access
     */
    function Access($http) {
        /**
         * @name Access
         * @desc The factory to be returned
         * @memberOf kalendr.access.services.Access
         */
        var Access = {
            createShareable: createShareable,
            reply: reply,
            getConfirmedResponses: getConfirmedResponses,
            getRemovedResponses: getRemovedResponses,
            getDeclinedResponses: getDeclinedResponses,
            getNoResponses: getNoResponses
        };

        return Access;

        function createShareable(post, groupRuleDict) {
            // Updating dictionary values to condensed strings
            for (var groupName in groupRuleDict) {
                if (groupRuleDict[groupName] == "Modify") groupRuleDict[groupName] = 'MOD';
                else if (groupRuleDict[groupName] == "Busy") groupRuleDict[groupName] = 'BUS';
                else groupRuleDict[groupName] = 'ALL';
            }
            return $http.post('/api/v1/access/', {
                post: post,
                rules: groupRuleDict
            });
        }

        function reply(postId, response, emailNotification, emailNotifyWhen){
            emailNotification = false;
            return $http.post('/api/v1/access_update/',{
                post_id: postId,
                receiver_response: response,
                emailNotification: emailNotification
                //emailNotifyWhen: emailNotifyWhen
            });
        }

        // We cannot pass in data through HTTP get requests
        // reference: $http.get('/api/v1/accounts/' + id + '/posts/' + weekNum + '/week/');
        function getConfirmedResponses(postId, resp_type){
            return $http.get('/api/v1/notification_response/'+ postId +'/response/' + resp_type + '/list/');
        }

        function getRemovedResponses(postId, resp_type){
            return $http.get('/api/v1/notification_response/'+ postId +'/response/' + resp_type + '/list/');
        }

        function getDeclinedResponses(postId, resp_type){
            return $http.get('/api/v1/notification_response/'+ postId +'/response/' + resp_type + '/list/');

        }

        function getNoResponses(postId, resp_type){
            return $http.get('/api/v1/notification_response/'+ postId +'/response/' + resp_type + '/list/');
        }

    }
})();
