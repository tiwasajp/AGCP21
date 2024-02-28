(function (window, $) {
    'use strict';

    function ConversationController() {
        this._conversation = undefined;
        this._isDraftConversation = false;
        this._conversationParticipants = undefined;
        this._messages = undefined;
        this._message = undefined;

        this._conversationWith = '';

        this._conversationView = new window.ConversationView({
            handleCreateMessage: function (messageBody) {
                this.createMessage(messageBody);
            }.bind(this),
            handleSendMessage: function (messageBody) {
                this.sendMessage(messageBody);
            }.bind(this),
            handleAddAttachmentToMessage: function (file) {
                this.addAttachmentToMessage(file);
            }.bind(this),
            handleDeleteAttachment: function () {
                this.deleteAttachment();
            }.bind(this)
        });
    }


    ConversationController.prototype = {
        /**
         * Init function for Conversation service.
         * Registration callbacks releated with Conversation service.
         */
        init: function (conversation, participantAddress) {
            if (!this._conversation || this._conversation.getId() !== conversation.getId()) {
                this._resetConversationController();
                if (!participantAddress) {
                    this._isDraftConversation = true;
                    this._conversation = conversation;
                    this._messages = conversation.getMessages();
                    this._conversationParticipants = conversation.getParticipants();

                    this._conversation.subscribeForTypingEvents(this.showTypingEvents.bind(this));
                    this._messages.addOnDataSetChangedCallback(this.addMessages.bind(this));

                    this.addMessages(this._messages);

                    this._conversationParticipants.forEach(function (participant) {
                        if (!participant.isSelf()) {
                            this._conversationWith = this._conversationWith + participant.getDisplayName() + ' ';
                        }
                    }.bind(this));
                    this._conversationView.setConversationWith(this._conversationWith);

                    this._conversationView.showConversationPanel();
                } else {
                    var participants = participantAddress.split(" ");
                    conversation.addParticipantAddresses(participants).then(function () {
                        this._conversation = conversation;
                        this._messages = conversation.getMessages();

                        this._conversationParticipants = this._conversation.getParticipants();
                        this._conversationParticipants.forEach(function (participant) {
                            if (!participant.isSelf()) {
                                this._conversationWith = this._conversationWith + participant.getDisplayName() + ' ';
                            }
                        }.bind(this));
                        this._conversationView.setConversationWith(this._conversationWith);

                        this._messages.addOnDataSetChangedCallback(this.addMessages.bind(this));
                        this._conversation.addOnStatusChangedCallback(this.conversationStatusChanged.bind(this));

                        this._conversation.setSubject(participantAddress);

                        this._conversationView.showConversationPanel();
                    }.bind(this), function (err) {
                        this._conversationView.appendMessagingError(err);
                    }.bind(this));
                }
            }
        },

        /**
         * Function show typing events.
         *
         * @param {Object} chatStateEvent
         */
        showTypingEvents: function (chatStateEvent) {
            var typingId = chatStateEvent.getParticipant().getAddress().replace(/[^a-zA-Z0-9]/g, '');
            var name = chatStateEvent.getParticipant().getDisplayName();
            var state = chatStateEvent.getState();

            this._conversationView.newTypingEvent(typingId, name, state);
        },

        /**
         * Function show messages in conversation.
         *
         * @param {Array} messages
         */
        addMessages: function (messages) {
            messages.forEach(function (message) {
                var id, sender, time, messageBody, attachment, attachmentLocation, attachmentType;
                id = message.getId();
                messageBody = message.getBody();
                if (id && message.getType() === AvayaClientServices.Services.Messaging.MessageType.MESSAGE) {
                    sender = message.getFromParticipant().getDisplayName();
                    if (message.getReceivedDate().toString() !== 'Invalid Date') {
                        time = message.getReceivedDate();
                    } else {
                        time = message.getLastModifiedDate();
                    }
                    if (message.hasAttachment()) {
                        attachment = message.getAttachments()[0];
                        attachmentLocation = attachment.getDownloadURL();
                        attachmentType = attachment.getMimeType();
                    }
                    this._conversationView.addMessage(id, sender, time, messageBody, attachmentType, attachmentLocation);
                }
            }.bind(this));
        },

        /**
         * Function create new message.
         *
         * @param {String} messageBody
         */
        createMessage: function (messageBody) {
            if (!this._message) {
                this._message = this._conversation.createMessage();
            }
            this._message.setBodyAndReportTyping(messageBody);
        },

        /**
         * Function create new message if is not created already
         * and add attachment to that new message.
         *
         * @param {Object} file
         */
        addAttachmentToMessage: function (file) {
            if (this._message) {
                this._message.createAttachment(file);
            } else {
                this.createMessage('');
                this._message.createAttachment(file);
            }
            this._conversationView.hideAttachmentFileInput(file.name);
        },

        /**
         * Function delete existing attachment from message.
         */
        deleteAttachment: function () {
            if (this._message) {
                var attachment = this._message.getAttachments();
                if (attachment[0]) {
                    this._message.removeDraftAttachment(attachment[0]);
                }
            }
            this._conversationView.hideDeleteAttachmentBtn();
        },

        /**
         * Function send message.
         */
        sendMessage: function () {
            this._message.send().then(function () {
                this._message = undefined;
            }.bind(this));
        },

        /**
         * Function subscribe for typing event when conversation change status.
         *
         * @param {Object} conversation
         * @param {String} resourceStatus
         */
        conversationStatusChanged: function (conversation, resourceStatus) {
            if (resourceStatus === AvayaClientServices.Services.Messaging.ResourceStatus.PUBLISHED) {
                this._isDraftConversation = false;
                this._conversation.subscribeForTypingEvents(this.showTypingEvents.bind(this));
                this._conversation.removeOnStatusChangedCallback(this.conversationStatusChanged.bind(this));
            }
        },

        /**
         * Function clear all conversation data and remove conversation callback.
         *
         * @private
         */
        _resetConversationController: function () {
            if (this._conversation && !this._isDraftConversation) {
                this._conversationView.hideConversationPanel();
                this._conversation.unsubscribeForTypingEvents();
                this._messages.removeOnDataSetChangedCallback(this.addMessages.bind(this));
                if (this._message) {
                    this._conversation.removeMessage(this._message).then(function () {
                        this._message = undefined;
                    }.bind(this));
                }
                this._conversationWith = '';
                this._conversationParticipants = undefined;
                this._messages = undefined;
                this._conversation = undefined;
                this._conversationView.clearConversationView();
            } else if (this._conversation && this._isDraftConversation) {
                this._conversationView.hideConversationPanel();
                this._messages.removeOnDataSetChangedCallback(this.addMessages.bind(this));
                if (this._message) {
                    this._conversation.removeMessage(this._message).then(function () {
                        this._message = undefined;
                    }.bind(this));
                }
                this._conversationWith = '';
                this._messages = undefined;
                this._conversation = undefined;
                this._conversationView.clearConversationView();
            }
        }

    };

    window.ConversationController = ConversationController;

})(window, jQuery);
