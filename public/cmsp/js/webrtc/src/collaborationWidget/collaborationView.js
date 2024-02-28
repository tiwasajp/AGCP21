(function (window, $) {
    'use strict';

    function CollaborationView(template, handlers) {
        this._template = template;

        this.applicationSharingBtn = this._template.find(".applicationSharingBtn");
        this.fullSharingBtn = this._template.find(".fullSharingBtn");
        this.endSharingBtn = this._template.find(".endSharingBtn");

        this.callsServiceTab = $("#callsServiceTab");
        this.collaborationServiceTab = $("#collaborationServiceTab");
        this.collaborationService = $("#collaborationService");

        this.collaborationError = this._template.find(".collaborationError");

        this.collaborationCanvas = this._template.find(".collaborationCanvas");

        this.callId = this._template.find(".callId");

        this.applicationSharingBtn.on('click', function () {
            handlers.handleApplicationSharing();
        }.bind(this));

        this.fullSharingBtn.on('click', function () {
            handlers.handleFullSharing();
        }.bind(this));

        this.endSharingBtn.on('click', function () {
            handlers.handleEndSharing();
        }.bind(this));
    }

    CollaborationView.prototype = {
        /**
         * Function show collaboration module.
         */
        showCollaborationModule: function () {
            this.collaborationServiceTab.show();
        },

        /**
         * Function hide collaboration module.
         */
        hideCollaborationModule: function () {
            if(this._getCountCollaborations() === 0){
                this.collaborationServiceTab.hide();
            }

            if (this.collaborationService.hasClass('active')) {
                this.callsServiceTab.click();
            }
        },

        /**
         * Function hide start application window and full window sharing buttons and show end screen sharing button.
         */
        hideScreenSharingButtons: function () {
            this.applicationSharingBtn.hide();
            this.fullSharingBtn.hide();
            this.endSharingBtn.show();
        },

        /**
         * Function show start application window and full window sharing buttons and hide end screen sharing button.
         */
        showScreenSharingButtons: function () {
            this.applicationSharingBtn.show();
            this.fullSharingBtn.show();
            this.endSharingBtn.hide();
        },

        /**
         * Function display problems messages with screen sharing.
         *
         * @param {String} message
         */
        showCollaborationErrorMsg: function (message) {
            this.collaborationError.text(message);
        },

        setCollaborationCanvasId: function(canvasId){
            this.collaborationCanvas.attr('id', canvasId);
        },

        setCallId: function(callId){
            this.callId.text(callId);
        },

        _getCountCollaborations: function () {
            return this.collaborationService.find('.collaborationView').length;
        }
    };

    window.CollaborationView = CollaborationView;

})
(window, jQuery);
