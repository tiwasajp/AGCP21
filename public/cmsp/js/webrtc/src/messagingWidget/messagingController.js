(function (window, $) {
    'use strict';

    function MessagingController(user) {
        this._user = user;
        this._messagingService = user.getMessaging();
        this._conversationDetails = new window.ConversationController(this._messagingService);
        this._conversationsRetrieval = undefined;
        this._conversationsSet = undefined;
        this._conversationsArray = [];

        this._messagingView = new window.MessagingView({
            handleShowConversation: function (id) {
                this.showConversation(id);
            }.bind(this),
            handleCreateNewConversation: function (participantAddress) {
                this.showNewConversation(participantAddress);
            }.bind(this)
        });

        this._init();
    }


    MessagingController.prototype = {
        /**
         * Init function for Messaging service.
         * Registration callbacks releated with Messaging service.
         */
        _init: function () {
            this._conversationsRetrieval = this._messagingService.getActiveConversations();
            this._conversationsSet = this._conversationsRetrieval.getDataSet();

            this._conversationsSet.addOnDataSetChangedCallback(function (conversations, type) {
                if (type === AvayaClientServices.Base.DataSetChangeTypes.ADDED) {
                    this._addConversation(conversations);
                } else if (type === AvayaClientServices.Base.DataSetChangeTypes.UPDATED) {
                    this._updateConversation(conversations);
                } else if (type === AvayaClientServices.Base.DataSetChangeTypes.REMOVED) {
                    this._removeConversation(conversations);
                }
            }.bind(this));

            this._conversationsRetrieval.addOnDataRetrievalFailedCallback(function (error) {
                console.log('Failed to retrieve conversation', error);
            });

            this._conversationsRetrieval.addOnDataRetrievalDoneCallback(function () {
                console.log('All conversations have been downloaded');
            });
        },

        /**
         * Function chosen show conversation.
         * @param {String} id
         */
        showConversation: function (id) {
            this._conversationDetails.init(this._conversationsArray[id]);
        },

        /**
         * Function create and show new conversation.
         *
         * @param {String} participantAddress
         */
        showNewConversation: function (participantAddress) {
            var newConversation = this._messagingService.createConversation();
            this._conversationDetails.init(newConversation, participantAddress);
        },

        /**
         * Function add existing conversations to conversations list.
         *
         * @param {Array} conversations
         * @private
         */
        _addConversation: function (conversations) {
            conversations.forEach(function (conversation) {
                if (conversation.getStatus() !== AvayaClientServices.Services.Messaging.ResourceStatus.DRAFT_UNSENT) {
                    var id = conversation.getId(),
                        subject = conversation.getSubject(),
                        previevText = conversation.getPreviewText();

                    this._messagingView.addConversationToList(id, subject, previevText);

                    this._conversationsArray[id] = conversation;
                }
            }.bind(this));
        },

        /**
         * Function update existing conversations in conversations list,
         * Or add new if conversation was update from DRAFT mode.
         *
         * @param {Array} conversations
         * @private
         */
        _updateConversation: function (conversations) {
            conversations.forEach(function (conversation) {
                var id = conversation.getId(),
                    subject = conversation.getSubject(),
                    previevText = conversation.getPreviewText();

                if (this._conversationsArray[id]) {
                    this._conversationsArray[id] = conversation;
                    this._messagingView.updateConversationInList(id, subject, previevText);
                } else {
                    this._conversationsArray[id] = conversation;
                    this._messagingView.addConversationToList(id, subject, previevText);
                }
            }.bind(this));
        },

        /**
         * Function remove existing conversations from conversations list.
         *
         * @param {Array} conversations
         * @private
         */
        _removeConversation: function (conversations) {
            conversations.forEach(function (conversation) {
                var id = conversation.getId();

                this._messagingView.removeConversationFromList(id);

                delete this._conversationsArray[id];
            }.bind(this));
        }

    };

    window.MessagingController = MessagingController;

})(window, jQuery);
