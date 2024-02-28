(function (window, $) {
    'use strict';

    function ConferenceView(template, handlers, hasVideo) {
        this._template = template;

        this._init();
        this._addHandlers(handlers);

        this._hasVideo = hasVideo;
    }

    ConferenceView.prototype = {
        _init: function(){
            this.conferenceControlBtns = this._template.find(".conferenceControlBtns");
            this.conferencePanelTitle = this._template.find(".conferencePanelTitle");
            this.rosterPanel = this._template.find(".rosterPanel");
            this.participantRoster = this._template.find(".participantRoster");
            this.lockConferenceBtn = this._template.find(".lockConferenceBtn");
            this.unlockConferenceBtn = this._template.find(".unlockConferenceBtn");
            this.muteAllBtn = this._template.find(".muteAllBtn");
            this.unmuteAllBtn = this._template.find(".unmuteAllBtn");
            this.leaveConferenceBtn = this._template.find(".leaveConferenceBtn");
        },

        _addHandlers: function(handlers){
            this.lockConferenceBtn.on('click', function () {
                handlers.handleLockUnlockConference();
            });

            this.unlockConferenceBtn.on('click', function () {
                handlers.handleLockUnlockConference();
            });

            this.muteAllBtn.on('click', function () {
                handlers.handleMuteUnmuteAll();
            });

            this.unmuteAllBtn.on('click', function () {
                handlers.handleMuteUnmuteAll();
            });

            this.leaveConferenceBtn.on('click', function () {
                handlers.handleLeaveConference();
            });
        },

        /**
         * Function show all conference panels.
         */
        showConferencePanels: function () {
            this.conferencePanelTitle.show();
            this.conferenceControlBtns.show();
            this.rosterPanel.show();
        },
        /**
         * Function hide all conference panels.
         */
        hideConferencePanels: function () {
            this.conferenceControlBtns.hide();
            this.conferencePanelTitle.hide();
            this.rosterPanel.hide();
            this.participantRoster.empty();
        },

        /**
         * Allows user to Lock/Unlock the conference.
         */
        unlockConferenceLockControls: function (allowed) {
            this.lockConferenceBtn.prop('disabled', !allowed);
            this.unlockConferenceBtn.prop('disabled', !allowed);
        },

        /**
         * Allows user to Mute All participants.
         */
        unlockMuteAllControls: function (allowed) {
            this.muteAllBtn.prop('disabled', !allowed);
        },

        /**
         * Allows user to Unmute All participants.
         */
        unlockUnmuteAllControls: function (allowed) {
            this.unmuteAllBtn.prop('disabled', !allowed);
        },

        /**
         * Function add participant label to roster.
         *
         * @param {String} id
         * @param {String} displayName
         * @param {Boolean} isVideoBlocked
         * @param {Boolean}  isAudioMuted
         */
        addParticipantToRoster: function (id, displayName, isVideoBlocked, isAudioMuted) {
            var participant = '<li class="list-group-item" id="roster_' + id + '">' + displayName;
            if (this._hasVideo && ( ! isVideoBlocked)) {
                participant = participant + '<span class="pull-right glyphicon glyphicon-facetime-video"></span>';
            }
            if (!isAudioMuted) {
                participant = participant + '<span class="pull-right glyphicon glyphicon-volume-up"></span>';
            } else {
                participant = participant + '<span class="pull-right glyphicon glyphicon-volume-off"></span>';
            }
            participant = participant + '</li>';
            this.participantRoster.append(participant);
        },

        /**
         * Function add pending participant label to roster.
         *
         * @param {Object}  participant
         */
        addPendingParticipantToRoster: function (participant) {
            var id = participant.getParticipantId();
            var displayName = participant.getDisplayName();

            var participantHTML = '<li class="list-group-item" id="roster_' + id + '">' + displayName;
            participantHTML = participantHTML + '<span class="pull-right glyphicon glyphicon-remove" id="denyParticipant"></span>';
            participantHTML = participantHTML + '<span class="pull-right glyphicon glyphicon-ok" id="acceptParticipant"></span>';
            participantHTML = participantHTML + '</li>';
            this.participantRoster.append(participantHTML);

            var participantElem = $('#roster_' + id);

            // Accept handler
            $("#acceptParticipant").on('click', function () {
                participant.accept().then(function(){
                    console.log('Participant ' +  id + ' was accepted successfully');
                }, function(error) {
                    console.log('Attempt to accept participant ' +  id + ' was failed');
                    if(error){
                        console.error(error);
                    }
                });
            });
            
            // Deny handler
            $("#denyParticipant").on('click', function () {
                participant.deny().then(function(){
                    console.log('Participant ' +  id + ' was denied successfully');
                }, function(error) {
                    console.log('Attempt to deny participant ' +  id + ' was failed');
                    if(error) {
                        console.error(error);
                    }
                });
            });
        },

        /**
         * Function remove participant label from roster.
         *
         * @param {String} id
         */
        removeParticipantFromRoster: function (id) {
            var participant = $('#roster_' + id);
            if(!!participant) {
                participant.remove();
            }
        },

        /**
         * Function update participant label in roster.
         *
         * @param {String} id
         * @param {String} displayName
         * @param {Boolean} isVideoBlocked
         * @param {Boolean}  isAudioMuted
         */
        updateParticipantInRoster: function (id, displayName, isVideoBlocked, isAudioMuted) {
            var participant = $('#roster_' + id);
            var html = displayName;
            if (this._hasVideo && ( ! isVideoBlocked)) {
                html = html + '<span class="pull-right glyphicon glyphicon-facetime-video"></span>';
            }
            if (!isAudioMuted) {
                html = html + '<span class="pull-right glyphicon glyphicon-volume-up"></span>';
            } else {
                html = html + '<span class="pull-right glyphicon glyphicon-volume-off"></span>';
            }

            participant.html(html);
        },

        /**
         * Function change muteAll/unmuteAll button.
         *
         * @param {Boolean} isConferenceMuted
         */
        changeMuteUnmuteAllBtn: function (isConferenceMuted) {
            if (isConferenceMuted) {
                this.muteAllBtn.hide();
                this.unmuteAllBtn.show();
            } else {
                this.muteAllBtn.show();
                this.unmuteAllBtn.hide();
            }
        },

        /**
         * Function change lock/unlock button.
         *
         * @param {Boolean} isLocked
         */
        changeLockUnlockBtn: function (isLocked) {
            if (isLocked) {
                this.lockConferenceBtn.hide();
                this.unlockConferenceBtn.show();
            } else {
                this.lockConferenceBtn.show();
                this.unlockConferenceBtn.hide();
            }
        }
    };

    window.ConferenceView = ConferenceView;

})
(window, jQuery);
