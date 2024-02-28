(function (window, $) {
    'use strict';

    function CallsView(handlers) {
        this.makeAudioCallBtn = $("#audioCallBtn");
        this.makeVideoCallBtn = $("#videoCallBtn");
        this.calleeAddress = $('#calleeAddress');

        this.makeAudioCallBtn.off('click').on('click', function () {
            var remoteAddress = this.calleeAddress.val();
            handlers.handleAudioMakeCall(remoteAddress);
        }.bind(this));

        this.makeVideoCallBtn.off('click').on('click', function () {
            var remoteAddress = this.calleeAddress.val();
            handlers.handleVideoMakeCall(remoteAddress);
        }.bind(this));

        this._initCollapse();
    }

    CallsView.prototype = {
        _initCollapse: function(){
            $('#servicesPanel').on('click','.view .viewHeader', function(){
                $(this).closest('.view').find('.collapse').collapse('toggle');
                $(this).toggleClass('selected');
            });
        },

        collapseAll: function(){
            $('#servicesPanel .view .collapse').collapse('hide');
            $('#servicesPanel .view .viewHeader').removeClass('selected');
        },
        
        /**
         * Function disable inputs in calls panel.
         */
        disableCallsPanel: function () {
            this.makeAudioCallBtn.prop('disabled', true);
            this.makeVideoCallBtn.prop('disabled', true);
            this.calleeAddress.prop('disabled', true);
        },

        /**
         * Function enable inputs in calls panel.
         */
        enableCallsPanel: function () {
            this.makeAudioCallBtn.prop('disabled', false);
            this.makeVideoCallBtn.prop('disabled', false);
            this.calleeAddress.prop('disabled', false);
        },

        createCallTemplate: function(){
           return $('#templates .callView').clone(true, true);
        },

        createCollaborationTemplate: function(){
            return $('#templates .collaborationView').clone(true, true);
        },

        addCallTemplate: function(template){
            $('#calls').prepend(template);
        },

        addCollaborationTemplate: function(template){
            $('#collaborationService').prepend(template);
        },

        removeTemplate: function(template){
            template.remove();
        }
    };

    window.CallsView = CallsView;

})(window, jQuery);
