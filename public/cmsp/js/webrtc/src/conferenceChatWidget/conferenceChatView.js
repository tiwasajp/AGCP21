(function (window, $) {
    'use strict';

    function ConferenceChatView(template, handlers) {
        this._template = template;
        this.confMessagesPanel = this._template.find(".confMessagesPanel");
        this.sendMessage = this._template.find(".sendMessage");
        this.sendTo = this._template.find(".sendTo");
        this.message = this._template.find(".message");
        this.conferenceChatMessages = this._template.find(".conferenceChatMessages");

        this.sendMessage.on('click', function () {
            var participantId = this.sendTo.children(":selected").val();
            handlers.handleSendChatConferenceMessage(this.message.val(), participantId);
            this.message.val('');
        }.bind(this));

    }

    ConferenceChatView.prototype = {
        /**
         * Function show conference chat panel.
         */
        showConferenceChatPanels: function () {
            this.confMessagesPanel.show();
        },

        /**
         * Function hide conference chat panel.
         */
        hideConferenceChatPanels: function () {
            this.confMessagesPanel.hide();
        },

        /**
         * Function add option to private messages select.
         *
         * @param {String} id
         * @param {String} displayName
         */
        addParticipantToChatSelect: function (id, displayName) {
            var participant = $('<option/>', {
                text: displayName,
                value: id
            });
            this.sendTo.append(participant);
        },

        /**
         * Function remove option from private messages select.
         *
         * @param id
         */
        removeParticipantFromChatSelect: function (id) {
            var participant = this.sendTo.find('option[value="'+id+'"]');
            participant.remove();
        },

        /**
         * Function add private or public message to chat.
         *
         * @param {String} senderName
         * @param {Boolean} isPrivate
         * @param {Date} time
         * @param {String} messageContent
         * @param {String} recipientName
         */
        addMessage: function (senderName, isPrivate, time, messageContent, recipientName) {
            var message;
            if (isPrivate) {
                message = '<div class="row message-bubble">' +
                            '<p class="text-muted">' +
                                '<span class="chatLabel label label-warning">Private Message</span>' +
                                '<span class="chatTime pull-right">' + time.toLocaleDateString() + ' ' + time.toLocaleTimeString() + '</span>' +
                            '</p>' +
                            '<p class="text-muted">From: ' + senderName + ' To: ' + recipientName + '</p>' +
                            '<p>' + messageContent + '</p>' +
                          '</div>';
            } else {
                message = '<div class="row message-bubble">' +
                            '<p class="text-muted">' +
                                '<span class="chatLabel label label-success">Public Message</span>' +
                                '<span class="chatTime pull-right">' + time.toLocaleDateString() + ' ' + time.toLocaleTimeString() + '</span>' +
                            '</p>' +
                            '<p class="text-muted">From: ' + senderName + '</p>' +
                            '<p>' + messageContent + '</p>' +
                          '</div>';
            }
            this.conferenceChatMessages.prepend(message);
        }
    };

    window.ConferenceChatView = ConferenceChatView;

})
(window, jQuery);
