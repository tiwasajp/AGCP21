(function (window, $) {
    'use strict';

    function ConversationView(handlers) {
        this.errorLog = $('#errorLog');
        this.conversationPanel = $("#conversationPanel");
        this.conversationChat = $("#conversationChat");
        this.conversationWith = $("#conversationWith");
        this.isTypingInfo = $("#isTypingInfo");

        this.attachmentButtons = $(".attachmentButtons");
        this.attachmentFile = $("#attachmentFile");
        this.addAttachmentBtn = $("#addAttachmentBtn");
        this.deleteAttachmentBtn = $("#deleteAttachmentBtn");

        this.conversationMessage = $("#conversationMessage");
        this.sendConversationMessage = $("#sendConversationMessage");

        this.conversationMessage.on('keyup', function () {
            handlers.handleCreateMessage(this.conversationMessage.val());
        }.bind(this));

        this.sendConversationMessage.on('click', function () {
            handlers.handleSendMessage(this.conversationMessage.val());
            this.conversationMessage.val('');
            if (this.attachmentFile.val()) {
                this.hideDeleteAttachmentBtn();
                this.attachmentFile.val('');
            }
        }.bind(this));

        this.attachmentFile.on('change', function (e) {
            if(e.target.files.length > 0) {
                handlers.handleAddAttachmentToMessage(e.target.files[0]);
            }
        });

        this.deleteAttachmentBtn.on('click', function () {
            this.attachmentFile.val('');
            handlers.handleDeleteAttachment();
        }.bind(this));
    }

    ConversationView.prototype = {
        /**
         * Function show conversation panel.
         */
        showConversationPanel: function () {
            this.conversationPanel.show();
        },

        /**
         * Function hide conversation panel.
         */
        hideConversationPanel: function () {
            this.conversationPanel.hide();
        },

        /**
         * Function add HTML element to conversation chat.
         *
         * @param {String} id
         * @param {String} sender
         * @param {Object} time
         * @param {String} messageBody
         * @param {String} attachmentType
         * @param {String} attachmentLocation
         */
        addMessage: function (id, sender, time, messageBody, attachmentType, attachmentLocation) {
            var message = '<div id="' + id + '" class="row message-bubble">' +
                '<p class="text-muted">' +
                '<span class="chatTime pull-right">' + time.toLocaleDateString() + ' ' + time.toLocaleTimeString() + '</span>' +
                '</p>' +
                '<p class="text-muted">From: ' + sender + '</p>' +
                '<p>' + messageBody + '</p>';

            if (attachmentType && attachmentType.indexOf('image') !== -1) {
                message = message + '<p><img src="' + attachmentLocation + '" /></p>';
            } else if (attachmentType && attachmentType.indexOf('video') !== -1) {
                message = message + '<p><video controls><source src="' + attachmentLocation + '" type="' + attachmentType + '">Your browser does not support the video tag.</video></p>';
            } else if (attachmentType && attachmentType.indexOf('audio') !== -1) {
                message = message + '<p><audio controls><source src="' + attachmentLocation + '" type="' + attachmentType + '">Your browser does not support the audio tag.</audio></p>';
            }
            else if(attachmentLocation) {
                message = message +'<a target="_blank" href="'+ attachmentLocation +'">Attached file ( '+ attachmentType +' )</a>';
            }
            message = message + '</div>';
            this.conversationChat.prepend(message);
        },

        /**
         * Function set converation title.
         *
         * @param {String} conversationWith
         */
        setConversationWith: function (conversationWith) {
            this.conversationWith.text(conversationWith);
        },

        /**
         * Function add or remove typing HTML elements.
         *
         * @param {String} typingId
         * @param {String} name
         * @param {String} state
         */
        newTypingEvent: function (typingId, name, state) {
            if (this.isTypingInfo.find("#typing-" + typingId).length === 0 && state === 'composing') {
                var typingMessage = '<p id="typing-' + typingId + '">' + name + ' is composing...</p>';
                this.isTypingInfo.append(typingMessage);
            } else if (this.isTypingInfo.find("#typing-" + typingId).length > 0 && state === 'paused') {
                this.isTypingInfo.find("#typing-" + typingId).remove();
            }
        },

        /**
         * Function append messaging Errors.
         *
         * @param {String} err
         */
        appendMessagingError: function (err) {
            this.errorLog.append('<div>Messaging: ' + err + '</div>');
        },

        /**
         * Function hide attachment input and add preview of attached file.
         *
         * @param {String} fileName
         */
        hideAttachmentFileInput: function (fileName) {
            this.attachmentButtons.append('<div id="attachmentName">' + fileName + '</div>');
            this.addAttachmentBtn.hide();
            this.deleteAttachmentBtn.show();
        },

        /**
         * Function hide delete attachment button, clear attachment preview
         * and show attachment input button.
         */
        hideDeleteAttachmentBtn: function () {
            this.attachmentButtons.find("#attachmentName").remove();
            this.addAttachmentBtn.show();
            this.deleteAttachmentBtn.hide();
        },

        /**
         * Function clear all conversation HTML containers.
         */
        clearConversationView: function () {
            this.conversationChat.empty();
            this.conversationWith.text('');
            this.isTypingInfo.empty();
            this.conversationMessage.val('');
        }
    };

    window.ConversationView = ConversationView;

})
(window, jQuery);
