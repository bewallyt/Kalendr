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
            return $http.patch('/api/v1/access/',{
                post: postId,
                response: response,
                emailNotification: emailNotification
                //emailNotifyWhen: emailNotifyWhen
            });
        }

        function getConfirmedResponses(postId){
            return $http.patch('/api/v1/notification_response/',{
                post: postId,
                response: 'CONFIRM'

            });
        }

        function getRemovedResponses(postId){
            return $http.patch('/api/v1/notification_response/',{
                post: postId,
                response: 'REMOVED'

            });
        }

        function getDeclinedResponses(postId){
            return $http.patch('/api/v1/notification_response/',{
                post: postId,
                response: 'DECLINE'

            });
        }

        function getNoResponses(postId){
            return $http.patch('/api/v1/notification_response/',{
                post: postId,
                response: 'NO_RESP'

            });
        }

    }
})();
