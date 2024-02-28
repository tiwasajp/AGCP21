(function (window, $) {
    'use strict';

    function ConferenceChatController(call, conference, template) {
        this._call = call;
        this._conference = conference;
        this._conferenceChat = conference.getInConferenceChat();
        this._allMessages = undefined;
        this._template = template;

        this._conferenceChatView = new window.ConferenceChatView(this._template, {
            handleSendChatConferenceMessage: function (message, sendTo) {
                this.sendMessage(message, sendTo);
            }.bind(this)
        });

        this._init();
    }


    ConferenceChatController.prototype = {
        /**
         * Init function for Conference chat.
         * Registration callbacks releated with Conference chat.
         */
        _init: function () {

            this._call.addOnCallEndedCallback(function () {
                this._conferenceChatView.hideConferenceChatPanels();
            }.bind(this));

            this._conference.addOnConferenceParticipantsAddedCallback(function (conference, participants) {
                participants.forEach(function (participant) {
                    this._conferenceChatView.addParticipantToChatSelect(participant.getParticipantId(), participant.getDisplayName());
                }.bind(this));
            }.bind(this));

            this._conference.addOnConferenceParticipantsRemovedCallback(function (conference, participants) {
                participants.forEach(function (participant) {
                    this._conferenceChatView.removeParticipantFromChatSelect(participant.getParticipantId());
                }.bind(this));
            }.bind(this));

            this._conferenceChat.addOnChatMessageReceivedCallback(function (conferenceChat, message) {
                if (message.isPrivate()) {
                    this._conferenceChatView.addMessage(message.getSender().getDisplayName(), message.isPrivate(), message.getTime(), message.getMessageContent(), message.getRecipient().getDisplayName());
                } else {
                    this._conferenceChatView.addMessage(message.getSender().getDisplayName(), message.isPrivate(), message.getTime(), message.getMessageContent());
                }
            }.bind(this));

            this._conferenceChatView.showConferenceChatPanels();
        },

        /**
         * Function used to send message in conference chat.
         *
         * @param {String} message
         * @param {String} sendTo
         */
        sendMessage: function (message, sendTo) {
            if (sendTo === 'all') {
                this._conferenceChat.sendPublicMessage(message);
            } else {
                var participants = this._conference.getActiveParticipants();
                participants.forEach(function (participant) {
                    if (participant.getParticipantId() === sendTo) {
                        this._conferenceChat.sendPrivateMessage(participant, message);
                        return true;
                    }
                }.bind(this));

            }
        }



    };

    window.ConferenceChatController = ConferenceChatController;

})(window, jQuery);
