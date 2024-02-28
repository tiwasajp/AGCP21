(function (window) {
    'use strict';

    function CollaborationController(user, call, callsView) {
        this._user = user;
        this._call = call;
        this._collaborations = this._user.getCollaborations();
        this._collaboration = undefined;
        this._whiteboard = undefined;
        this._contentSharing = undefined;
        this._isStarted = false;
        this._callsView = callsView;
        this._template = this._callsView.createCollaborationTemplate();

        this._whiteboardRenderer = new AvayaClientServices.Renderer.Konva.KonvaWhiteboardRenderer();
        this._contentSharingRenderer = new AvayaClientServices.Renderer.Konva.KonvaContentSharingRenderer();

        this._collaborationView = new window.CollaborationView(this._template, {
            handleApplicationSharing: function () {
                this.startApplicationSharing();
            }.bind(this),
            handleFullSharing: function () {
                this.startFullSharing();
            }.bind(this),
            handleEndSharing: function () {
                this.endSharing();
            }.bind(this)
        });

        this._init();
    }

    CollaborationController.prototype = {
        /**
         * Init function for Collaboration.
         * Registration callbacks releated with Collaboration.
         */
        _init: function () {
            var callId = this._call.getCallId();
            this._collaboration = this._collaborations.getCollaborationForCall(callId);

            if (this._collaboration) {
                this._collaboration.start().then(function () {
                    this._whiteboard = this._collaboration.getWhiteboard();
                    this._contentSharing = this._collaboration.getContentSharing();

                    var canvasId = 'collaborationCanvas_' + callId;
                    this._collaborationView.setCollaborationCanvasId(canvasId);
                    this._whiteboardRenderer.init(this._whiteboard, canvasId);
                    this._contentSharingRenderer.init(this._contentSharing, canvasId);

                    this._contentSharing.addOnContentSharingStartedCallback(this.startContentSharingCallback.bind(this));
                    this._contentSharing.addOnContentSharingEndedCallback(this.stopContentSharingCallback.bind(this));

                    this._callsView.addCollaborationTemplate(this._template);
                    this._collaborationView.setCallId(callId);
                    this._collaborationView.showCollaborationModule();
                }.bind(this));
            }
        },

        /**
         * Function invoked onContentSharingStartedCallback.
         */
        startContentSharingCallback: function () {
            this._isStarted = true;
            this._collaborationView.hideScreenSharingButtons();
        },

        /**
         * Function invoked onContentSharingEndedCallback.
         */
        stopContentSharingCallback: function () {
            this._isStarted = false;
            this._collaborationView.showScreenSharingButtons();
        },

        /**
         * Function start application window sharing.
         */
        startApplicationSharing: function () {
            var capability = this._contentSharing.getShareApplicationWindowCapability().isAllowed;
            if (!this._isPresenting() && capability) {
                this._contentSharing.startSharingApplicationWindow();
            } else {
                this._collaborationView.showCollaborationErrorMsg("You don't have the Screen Sharing Extension or someone is already sharing their screen.");
            }
        },

        /**
         * Function start full window sharing.
         */
        startFullSharing: function () {
            var capability = this._contentSharing.getShareFullScreenCapability().isAllowed;
            if (!this._isPresenting() && capability) {
                this._contentSharing.startScreenSharingFullScreen();
            } else {
                this._collaborationView.showCollaborationErrorMsg("You don't have Screen Sharing Extension or someone already sharing screen.");
            }
        },

        /**
         * Function stop screen sharing.
         */
        endSharing: function () {
            if (this._isPresenting()) {
                this._contentSharing.end();
            } else {
                this._collaborationView.showCollaborationErrorMsg("Screen Sharing is already stopped.");

            }
        },

        /**
         * Function remove callbacks and clear collaboration View.
         */
        removeCollaboration: function () {
            this._callsView.removeTemplate(this._template);
            this._collaborationView.hideCollaborationModule();
            this._contentSharing.removeOnContentSharingStartedCallback(this.startContentSharingCallback.bind(this));
            this._contentSharing.removeOnContentSharingEndedCallback(this.stopContentSharingCallback.bind(this));
        },

        /**
         * Function checks if someone has already started screen sharing.
         *
         * @returns {Boolean}
         * @private
         */
        _isPresenting: function () {
            return this._contentSharing && this._contentSharing.isContentSharingActive();
        }

    };

    window.CollaborationController = CollaborationController;

})(window);
