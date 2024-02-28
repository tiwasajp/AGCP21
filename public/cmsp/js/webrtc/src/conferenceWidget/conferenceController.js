(function (window, $) {
    'use strict';

    function ConferenceController(call, uccpConfig, template, user, callsView, hasVideo) {
        this._call = call;
        this._conference = this._call.getConference();
        this._conferenceChat = undefined;
        this._user = user;
        this._callsView = callsView;
        this._collaborationController = undefined;
        this._isConferenceMuted = false;
        this._participants = [];
        this._template = template;

        this._conferenceView = new window.ConferenceView(this._template, {
            handleLockUnlockConference: function () {
                this.lockConference();
            }.bind(this),
            handleMuteUnmuteAll: function () {
                this.muteAll();
            }.bind(this),
            handleLeaveConference: function () {
                this.leaveConference();
            }.bind(this)
        }, hasVideo);

        this._init(uccpConfig);
    }


    ConferenceController.prototype = {
        /**
         * Init function for Conference.
         * Registration callbacks releated with Conference.
         */
        _init: function (uccpConfig) {
            this._call.addOnCallEndedCallback(function () {
                console.log('Client: CallEnded');
                this._conferenceView.hideConferencePanels();
            }.bind(this));

            this._conference.addOnConferenceLockStatusChangedCallback(function (conference, isLocked) {
                console.log('Client: ConferenceLockStatus', conference, isLocked);
                this._conferenceView.changeLockUnlockBtn(isLocked);
            }.bind(this));

            this._conference.addOnConferenceAllParticipantsMutedCallback(function (conference) {
                console.log('Client: ParticipantsMuted', conference);
                this._isConferenceMuted = true;
                this._conferenceView.changeMuteUnmuteAllBtn(true);
            }.bind(this));

            this._conference.addOnConferenceAllParticipantsUnmutedCallback(function (conference) {
                console.log('Client: ParticipantsUnmuted', conference);
                this._isConferenceMuted = false;
                this._conferenceView.changeMuteUnmuteAllBtn(false);
            }.bind(this));

            this._conference.addOnConferenceParticipantsAddedCallback(function (conference, participants) {
                console.log('Client: ParticipantsAdded', conference, participants);
                participants.forEach(function (participant) {
                    participant.addOnParticipantVideoStatusChangedCallback(function (participant) {
                        this._updateParticipantRoster(participant);
                    }.bind(this));
                    participant.addOnParticipantAudioStatusChangedCallback(function (participant) {
                        this._updateParticipantRoster(participant);
                    }.bind(this));

                    this._participants.push(participant);
                    this._conferenceView.addParticipantToRoster(participant.getParticipantId(), participant.getDisplayName(), participant.isVideoBlocked(), participant.isAudioMuted());
                }.bind(this));
            }.bind(this));

            this._conference.addOnConferencePendingParticipantCallback(function (conference, participant) {
                console.log('Client: PendingParticipantAdded', conference, participant);
                this._conferenceView.addPendingParticipantToRoster(participant);
            }.bind(this));


            this._conference.addOnConferenceParticipantsRemovedCallback(function (conference, participants) {
                console.log('Client: ParticipantsRemoved', conference, participants);
                participants.forEach(function (participant) {
                    this._conferenceView.removeParticipantFromRoster(participant.getParticipantId());
                }.bind(this));
            }.bind(this));

            this._conference.addOnConferencePendingParticipantRemovedCallback(function (conference, participant) {
                console.log('Client: PendingParticipantRemoved', conference, participant);
                this._conferenceView.removeParticipantFromRoster(participant.getParticipantId());
            }.bind(this));

            this._conference.addOnConferenceCollaborationURIChangedCallback(function (conference, collaborationURI) {
                console.log('Client: CollaborationURIChanged');
                if (this._call.getCallId() && collaborationURI) {
                    this._collaborationController = new window.CollaborationController(this._user, this._call, this._callsView);
                }
            }.bind(this));

            this._conference.getUpdateLockStatusCapability().addOnChangedCallback(function (capability) {
                this._conferenceView.unlockConferenceLockControls(capability.isAllowed);
            }.bind(this));

            this._conference.getMuteAllParticipantsCapability().addOnChangedCallback(function (capability) {
                this._conferenceView.unlockMuteAllControls(capability.isAllowed);
            }.bind(this));

            this._conference.getUnmuteAllParticipantsCapability().addOnChangedCallback(function (capability) {
                this._conferenceView.unlockUnmuteAllControls(capability.isAllowed);
            }.bind(this));

            this._conference.start(uccpConfig).then(function () {
                this.onSuccessStartConference();
            }.bind(this), function(error){
                if(error.name === AvayaClientServices.Services.Conference.ConferenceStartStatus.ADMISSION_NEEDED){
                    if(error.admissionPermissionNeeded){
                        this.confirmAdmission(this._conference);
                    } else if(error.admissionPasscodeNeeded){
                        this.promptAdmissionPasscode(this._conference, error.admissionPermissionNeeded);
                    }
                }
            }.bind(this));
        },

        onSuccessStartConference: function(){
            console.log("Client: Call conference started.");
            this._conferenceView.showConferencePanels();
            this._conferenceChat = new window.ConferenceChatController(this._call, this._conference, this._template);
        },

        confirmAdmission: function (conference) {

            var onSuccess = function () {
                console.log("Admission permission allowed");
                this.onSuccessStartConference();
            }.bind(this);

            var onError = function (error) {
                console.log("Admission permission failed: ", (error && error.code));
                this.leaveConference();
            }.bind(this);

            var value = confirm('This meeting is locked. Click OK to ask the moderator to join, or hang up.');
            if (value) {
                conference.sendRequestToEnterLockedConference().then(onSuccess, onError);
            } else {
                console.log('Joining to the meeting was cancelled by user');
                this.leaveConference();
            }
        },

        promptAdmissionPasscode: function (conference, permissionToEnterLockedConferenceRequired) {

            var onSuccess = function() {
                console.log("Admission passcode allowed");
                this.onSuccessStartConference();
            }.bind(this);

            var onError = function(error) {
                console.log("Admission passcode denied: " + error);
                if (error.code === AvayaClientServices.Services.Conference.AdmissionResponseCode.INCORRECT_PASSCODE_TRY_AGAIN) {
                    this.promptAdmissionPasscode(conference);
                } else {
                    console.log('Joining to the meeting was cancelled by user');
                    this.leaveConference(conference);
                }
            }.bind(this);

            var promptMessage = permissionToEnterLockedConferenceRequired ?
                'The meeting is locked. Enter the meeting PIN to ask permission to join:' : 'Enter Meeting PIN:';

            var value = prompt(promptMessage);

            if (value) {
                conference.sendPasscode(value).then(onSuccess.bind(this), onError.bind(this));
            } else {
                console.log('Joining to the meeting was cancelled by user');
                this.leaveConference();
            }
        },

        /**
         * Function used to leave from conference.
         */
        leaveConference: function () {
            this._call.end();
        },

        /**
         * Function used to mute all participants in conference.
         */
        muteAll: function () {
            if (this._isConferenceMuted) {
                this._conference.unmuteAllParticipants();
            } else {
                this._conference.muteAllParticipants();
            }
        },

        /**
         * Function used to lock conference.
         */
        lockConference: function () {
            if (this._conference.isLocked()) {
                this._conference.setLocked(false);
            } else {
                this._conference.setLocked(true);
            }
        },

        /**
         * Function update participants roster label.
         *
         * @param participant
         * @private
         */
        _updateParticipantRoster: function (participant) {
            this._conferenceView.updateParticipantInRoster(participant.getParticipantId(), participant.getDisplayName(), participant.isVideoBlocked(), participant.isAudioMuted());
        }

    };

    window.ConferenceController = ConferenceController;

})(window, jQuery);
