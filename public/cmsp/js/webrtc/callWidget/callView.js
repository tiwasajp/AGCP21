(function (window, $) {
    'use strict';

    function CallView(template, handlers) {
        this._dtmf = '';
        this._template = template;

        this._init();
        this._addHandlers(handlers);
    }

    CallView.prototype = {
        _init: function(){
            this.callId = this._template.find(".callId");

            this.call = this._template.find(".call");
            this.callPanel = this._template.find(".callPanel");
            this.callPanelTitle = this._template.find(".callPanelTitle");

            this.localVideo = this._template.find(".localVideo");
            this.remoteVideo = this._template.find(".remoteVideo");

            this.muteBtn = this._template.find(".muteBtn");
            this.unmuteBtn = this._template.find(".unmuteBtn");
            this.holdBtn = this._template.find(".holdBtn");
            this.unholdBtn = this._template.find(".unholdBtn");
            this.blockVideoBtn = this._template.find(".blockVideoBtn");
            this.unblockVideoBtn = this._template.find(".unblockVideoBtn");

            this.dialButtons = this._template.find(".dialButtons");
            this.dtmfDigits = this._template.find(".dtmfDigit");
            this.hash = this._template.find(".hash");
            this.dialpadTextBox = this._template.find(".dialpadTextBox");

            this.callTimer = this._template.find(".callTimer");
            this.callState = this._template.find(".callState");

            this.callWithAddress = this._template.find(".callWithAddress");
            this.callControlBtns = this._template.find(".callControlBtns");
            this.endCallBtn = this._template.find(".endCallBtn");
            this.videoPanel = this._template.find(".videoPanel");


            this.callIncomingBtns = this._template.find(".callIncomingBtns");
            this.acceptAudioCallBtn = this._template.find(".acceptAudioCallBtn");
            this.acceptVideoCallBtn = this._template.find(".acceptVideoCallBtn");
            this.ignoreCallBtn = this._template.find(".ignoreCallBtn");

            this.errorLog = $("#errorLog");
        },

        _addHandlers: function(handlers){
            this.acceptAudioCallBtn.on('click', function () {
                handlers.handleAcceptAudioCall();
            });

            this.acceptVideoCallBtn.on('click', function () {
                handlers.handleAcceptVideoCall();
            });

            this.ignoreCallBtn.on('click', function () {
                handlers.handleIgnoreCall();
            });

            this.endCallBtn.on('click', function () {
                handlers.handleEndCall();
            });

            this.muteBtn.on('click', function () {
                handlers.handleMuteUnmute();
            });

            this.unmuteBtn.on('click', function () {
                handlers.handleMuteUnmute();
            });

            this.holdBtn.on('click', function () {
                handlers.handleHoldUnholdCall();
            });

            this.unholdBtn.on('click', function () {
                handlers.handleHoldUnholdCall();
            });

            this.blockVideoBtn.on('click', function () {
                handlers.handleBlockUnblockVideo(true);
            });

            this.unblockVideoBtn.on('click', function () {
                handlers.handleBlockUnblockVideo(false);
            });

            this.dtmfDigits.on('click', function (event) {
                var digit = event.target.value;
                this._dtmf = this._dtmf + digit;
                this.dialpadTextBox.text(this._dtmf);
            }.bind(this));

            this.hash.on('click', function (event) {
                var digit = event.target.value;
                this._dtmf = this._dtmf + digit;
                this.dialpadTextBox.text(this._dtmf);
                handlers.handleSendDTMF(this._dtmf);
            }.bind(this));
        },

        /**
         * Function show incoming Audio call.
         *
         * @param {String} remoteAddress
         */
        showIncomingAudioCall: function (remoteAddress) {
            this.callPanel.show();
            this.callIncomingBtns.show();
            this.callWithAddress.text(remoteAddress + ' is calling!!!');
            this.acceptAudioCallBtn.show();
            this.ignoreCallBtn.show();
        },

        /**
         * Function show incoming Video call.
         *
         * @param {String} remoteAddress
         */
        showIncomingVideoCall: function (remoteAddress) {
            this.callPanel.show();
            this.callIncomingBtns.show();
            this.callWithAddress.text(remoteAddress + ' is calling!!!');
            this.acceptAudioCallBtn.show();
            this.acceptVideoCallBtn.show();
            this.ignoreCallBtn.show();
        },

        /**
         * Function show call created localy.
         *
         * @param {String} remoteAddress
         */
        showLocalCall: function (remoteAddress) {
            this.callPanel.show();

            this.callWithAddress.text('You call to: ' + remoteAddress);
            this.callControlBtns.show();
            this.endCallBtn.show();
        },

        /**
         * Function shows call control panel after the connection.
         *
         * @param {Object} call
         * @param {Boolean} hasVideo
         */
        showCallControlPanel: function (call, hasVideo) {
            console.log("Client: call established callback");
            this.callWithAddress.text('Call with ' + call.getRemoteAddress());
            this.callIncomingBtns.hide();
            this.callControlBtns.show();
            this.callPanelTitle.show();
            this.endCallBtn.show();
            this.muteBtn.show();
            this.holdBtn.show();
            this.dialButtons.show();

            if (hasVideo) {
                console.log("Client: Video offer SUPPORTED");
                this.videoPanel.show();
                this.blockVideoBtn.show();
            } else {
                this.videoPanel.hide();
                this.blockVideoBtn.hide();
            }
        },

        /**
         * Function show call error.
         */
        showCallFailedInformation: function (err) {
            console.log("Client: Call failed");
            this.errorLog.append('<div>Call failed: ' + err + '</div>');
        },

        /**
         * Function show remote alerting.
         */
        showRemoteAlerting: function () {
            console.log("Client: Remote party alerting.......");
        },

        /**
         * Function hide call panel.
         */
        hideCallPanel: function () {
            console.log("Client: Call Ended Callback");
            this.callPanel.hide();
            this.callIncomingBtns.hide();
            this.acceptAudioCallBtn.hide();
            this.acceptVideoCallBtn.hide();
            this.ignoreCallBtn.hide();
            this.callControlBtns.hide();
            this.callPanelTitle.hide();
            this.endCallBtn.hide();
            this.videoPanel.hide();
            this.muteBtn.hide();
            this.unmuteBtn.hide();
            this.holdBtn.hide();
            this.unholdBtn.hide();

            this.blockVideoBtn.hide();
            this.unblockVideoBtn.hide();

            this.dialButtons.hide();
            this._dtmf = '';
            this.dialpadTextBox.text(this._dtmf);
        },

        /**
         * Function disable Ignore button.
         */
        disableIgnoreButton: function () {
            this.ignoreCallBtn.prop('disabled', true);
        },

        /**
         * Function change hold/unhold button.
         *
         * @param {Boolean} isHolded
         */
        changeHoldUnholdBtn: function (isHolded) {
            if (isHolded) {
                this.holdBtn.hide();
                this.unholdBtn.show();
            } else {
                this.holdBtn.show();
                this.unholdBtn.hide();
            }
        },

        /**
         * Function change mute/unmute button.
         *
         * @param {Boolean} isMuted
         */
        changeMuteUnmuteBtn: function (isMuted) {
            if (isMuted) {
                this.muteBtn.hide();
                this.unmuteBtn.show();
            } else {
                this.muteBtn.show();
                this.unmuteBtn.hide();
            }
        },

        /**
         * Function change block video button.
         *
         * @param {Boolean} isAllowed
         */
        changeBlockBtn: function (isAllowed) {
            if (isAllowed) {
                this.blockVideoBtn.show();
            } else {
                this.blockVideoBtn.hide();
            }
        },

        /**
         * Function change unblock video button.
         *
         * @param {Boolean} isAllowed
         */
        changeUnblockBtn: function (isAllowed) {
            if (isAllowed) {
                this.unblockVideoBtn.show();
            } else {
                this.unblockVideoBtn.hide();
            }
        },

        /**
         * Function change call state.
         *
         * @param {String} state
         */
        changeCallState: function (state) {
            this.callState.text(state);
        },

        /**
         * Function refresh call timer.
         *
         * @param {Number} timeInSeconds
         */
        refreshCallTimer: function (timeInSeconds) {
            var date = new Date(null);
            date.setSeconds(timeInSeconds);
            var timeString = date.toISOString().substr(11, 8);

            this.callTimer.text(timeString);
        },

        /**
         * Function clear call timer.
         */
        clearCallTimer: function () {
            this.callTimer.text("--:--:--");
        },

        /**
         * Function sets title kind of call.
         */
        setCallTitle: function () {
            this.call.text('Call');
        },

        setCallId: function(callId){
            this.callId.text(callId);
        },

        /**
         * Function sets title kind of call.
         */
        setConferenceTitle: function () {
            this.call.text('Conference');
        },

        /**
         * Function set src parameter to local stream.
         *
         * @param {MediaStream} stream
         */
        setLocalStream: function (stream) { 
            var localVideoElement = this.localVideo.get(0);
            if (stream === null || localVideoElement.srcObject === null || localVideoElement.srcObject.id !== stream.id) {      
		        localVideoElement.srcObject = stream;
            }
        },

        /**
         * Function set src parameter to remote stream.
         *
         * @param {MediaStream} stream
         */
        setRemoteStream: function (stream) {
            var remoteVideoElement = this.remoteVideo.get(0);
            if (stream === null || remoteVideoElement.srcObject === null || remoteVideoElement.srcObject.id !== stream.id) { 
		        remoteVideoElement.srcObject = stream;
            }
        }
    };

    window.CallView = CallView;

})(window, jQuery);
