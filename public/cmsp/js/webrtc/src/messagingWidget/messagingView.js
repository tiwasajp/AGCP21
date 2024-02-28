(function (window, $) {
    'use strict';

    function MessagingView(handlers) {
        this.conversationsListGroup = $("#conversationsListGroup");
        this.createConversationWith = $("#createConversationWith");
        this.createConversationBtn = $("#createConversationBtn");
        this.listGroupItem = $(".list-group-item");

        this.conversationsListGroup.on('click', '.list-group-item', function () {
            var id = $(this).attr('id').replace('conversation_','');
            handlers.handleShowConversation(id);
        });

        this.createConversationBtn.on('click', function () {
            var participantAddress = this.createConversationWith.val();
            if (participantAddress) {
                handlers.handleCreateNewConversation(this.createConversationWith.val());
            }
        }.bind(this));
    }

    MessagingView.prototype = {
        /**
         * Add conversation HTML element to conversations list.
         *
         * @param {String} id
         * @param {String} subject
         * @param {String} previevText
         */
        addConversationToList: function (id, subject, previevText) {
            var conversation = '<a id="conversation_' + id + '" href="#" class="list-group-item">' +
                                '<h4 class="list-group-item-heading conversationSubject">' + subject + '</h4>' +
                                '<p class="list-group-item-text conversationPreview">' + previevText + '</p>' +
                               '</a>';

            this.conversationsListGroup.append(conversation);
        },

        /**
         * Update conversation HTML element in conversations list.
         *
         * @param {String} id
         * @param {String} subject
         * @param {String} previevText
         */
        updateConversationInList: function (id, subject, previevText) {
            $("#conversation_" + id + " .conversationSubject").text(subject);
            $("#conversation_" + id + " .conversationPreview").text(previevText);
        },

        /**
         * Remove conversation HTML element from conversations list.
         *
         * @param {String} id
         */
        removeConversationFromList: function (id) {
            $("#conversation_" + id).remove();
        }
    };

    window.MessagingView = MessagingView;

})
(window, jQuery);
