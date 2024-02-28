(function (window, $) {
    'use strict';

    function LoginView(handlers) {

        this.callServerAddress = $('#callServerAddress');
        this.callPort = $('#callPort');
        this.callTls = $('#callTls');
        this.tokenAuthentication = $('#tokenAuthentication');
        this.callUsername = $('#callUsername');
        this.callUsernameLabel = $('#callUsernameLabel');
        this.callPassword = $('#callPassword');
        this.callPasswordLabel = $('#callPasswordLabel');

        this.tokenServiceHost = $('#tokenServiceHost');
        this.tokenServiceHostLabel = $('#tokenServiceHostLabel');
        this.tokenServicePort = $('#tokenServicePort');
        this.tokenServicePortLabel = $('#tokenServicePortLabel');
        this.tokenServiceURLPath = $('#tokenServiceURLPath');
        this.tokenServiceURLPathLabel = $('#tokenServiceURLPathLabel');

        this.callingNumber = $('#callingNumber');
        this.callingNumberLabel = $('#callingNumberLabel');

        this.callsServiceTab = $('#callsServiceTab');
        this.contactsServiceTab = $('#contactsServiceTab');
        this.messagingServiceTab = $('#messagingServiceTab');
        this.callService = $('#callService');
        this.messagingService = $('#messagingService');
        this.contactsService = $('#contactsService');

        this.messagingServerAddress = $('#messagingServerAddress');
        this.messagingPort = $('#messagingPort');
        this.messagingTls = $('#messagingTls');
        this.messagingUsername = $('#messagingUsername');
        this.messagingPassword = $('#messagingPassword');

        this.deviceServicesServerAddress = $('#deviceServicesServerAddress');
        this.deviceServicesPort = $('#deviceServicesPort');
        this.deviceServicesTls = $('#deviceServicesTls');
        this.deviceServicesUsername = $('#deviceServicesUsername');
        this.deviceServicesPassword = $('#deviceServicesPassword');

        this.loginBtn = $("#loginBtn");
        this.logoutBtn = $("#logoutBtn");
        this.SDKVersion = $('#SDKVersion');
        this.serviceTitle = $('#servicesTitle');
        this.errorLog = $('#errorLog');
        this.servicesPanel = $('#servicesPanel');

        this.SDKVersion.text(handlers.clientVersion);

        this.loginBtn.on('click', function () {
            var callSettings = {
                address: this.callServerAddress.val(),
                port: this.callPort.val(),
                tls: this.callTls.prop("checked"),
                username: this.callUsername.val(),
                password: this.callPassword.val(),
                tokenAuthenticationEnabled: this.tokenAuthentication.prop("checked"),
                tokenServiceAddress: "https://" + this.tokenServiceHost.val() + ":" + this.tokenServicePort.val() + "/" + this.tokenServiceURLPath.val(),
                callingNumber: this.callingNumber.val()
            };
            var messagingSettings = {
                address: this.messagingServerAddress.val(),
                port: this.messagingPort.val(),
                tls: this.messagingTls.prop("checked"),
                username: this.messagingUsername.val(),
                password: this.messagingPassword.val()
            };
            var deviceServicesSettings = {
                address: this.deviceServicesServerAddress.val(),
                port: this.deviceServicesPort.val(),
                tls: this.deviceServicesTls.prop("checked"),
                username: this.deviceServicesUsername.val(),
                password: this.deviceServicesPassword.val()
            };

			this.errorLog.empty();
            handlers.handleLogin(callSettings, messagingSettings, deviceServicesSettings);
            this.loginBtn.prop('disabled', true);
        }.bind(this));

        this.logoutBtn.on('click', function () {
            this.logoutBtn.prop('disabled', true);
            handlers.handleLogout();
        }.bind(this));

        this.tokenAuthentication.on('change', function() {
            if(this.tokenAuthentication.prop('checked')){
                // Hide Username related input
                this.callUsername.hide();
                this.callPassword.hide();
                this.callUsernameLabel.hide();
                this.callPasswordLabel.hide();

                // Show Token Generation related input 
                this.tokenServiceHost.show();
                this.tokenServiceHostLabel.show();
                this.tokenServicePort.show();
                this.tokenServicePortLabel.show();
                this.tokenServiceURLPath.show();
                this.tokenServiceURLPathLabel.show();
                this.callingNumber.show();
                this.callingNumberLabel.show();
            } else {
                // Hide Token Generation related input 
                this.tokenServiceHost.hide();
                this.tokenServiceHostLabel.hide();
                this.tokenServicePort.hide();
                this.tokenServicePortLabel.hide();
                this.tokenServiceURLPath.hide();
                this.tokenServiceURLPathLabel.hide();
                this.callingNumber.hide();
                this.callingNumberLabel.hide();

                // Show Username related input
                this.callUsername.show();
                this.callPassword.show();
                this.callUsernameLabel.show();
                this.callPasswordLabel.show();
            }
        }.bind(this));
    }

    LoginView.prototype = {
        /**
         * Function disable login buttons and settings. Show Services.
         */
        userRegistrationSuccessful: function () {
            this.callServerAddress.prop('disabled', true);
            this.callPort.prop('disabled', true);
            this.callTls.bootstrapToggle('disable');
            this.callUsername.prop('disabled', true);
            this.callPassword.prop('disabled', true);

            this.tokenAuthentication.bootstrapToggle('disable');
            this.tokenServiceHost.prop('disabled', true);
            this.tokenServicePort.prop('disabled', true);
            this.tokenServiceURLPath.prop('disabled', true);
            this.callingNumber.prop('disabled', true);

            this.messagingServerAddress.prop('disabled', true);
            this.messagingPort.prop('disabled', true);
            this.messagingTls.bootstrapToggle('disable');
            this.messagingUsername.prop('disabled', true);
            this.messagingPassword.prop('disabled', true);

            this.deviceServicesServerAddress.prop('disabled', true);
            this.deviceServicesPort.prop('disabled', true);
            this.deviceServicesTls.bootstrapToggle('disable');
            this.deviceServicesUsername.prop('disabled', true);
            this.deviceServicesPassword.prop('disabled', true);

            this.logoutBtn.prop('disabled', false);
            this.servicesPanel.show();
            this.errorLog.empty();

            if (this.callUsername.val()) {
                this.serviceTitle.text('Services Registered as: ' + this.callUsername.val());
            } else if (this.messagingUsername.val()) {
                this.serviceTitle.text('Services Registered as: ' + this.messagingUsername.val());
            } else if (this.deviceServicesUsername.val()) {
                this.serviceTitle.text('Services Registered as: ' + this.deviceServicesUsername.val());
            }
        },

        /**
         * Function add information that registration failed.
         */
        userRegistrationFailed: function () {
            this.loginBtn.prop('disabled', false);
            this.errorLog.append('<div>Login failed</div>');
        },

        /**
         * Function hide Services buttons and show login buttons.
         */
        userUnregistrationSuccessful: function () {
            this.callServerAddress.prop('disabled', false);
            this.callPort.prop('disabled', false);
            this.callTls.bootstrapToggle('enable');
            this.callUsername.prop('disabled', false);
            this.callPassword.prop('disabled', false);

            this.tokenAuthentication.bootstrapToggle('enable');
            this.tokenServiceHost.prop('disabled', false);
            this.tokenServicePort.prop('disabled', true);
            this.tokenServiceURLPath.prop('disabled', true);
            this.callingNumber.prop('disabled', false);

            this.messagingServerAddress.prop('disabled', false);
            this.messagingPort.prop('disabled', false);
            this.messagingTls.bootstrapToggle('enable');
            this.messagingUsername.prop('disabled', false);
            this.messagingPassword.prop('disabled', false);

            this.deviceServicesServerAddress.prop('disabled', false);
            this.deviceServicesPort.prop('disabled', false);
            this.deviceServicesTls.bootstrapToggle('enable');
            this.deviceServicesUsername.prop('disabled', false);
            this.deviceServicesPassword.prop('disabled', false);

            this.loginBtn.prop('disabled', false);
			this.logoutBtn.prop('disabled', true);
            this.servicesPanel.hide();
            this.serviceTitle.text('Services');

            this.callsServiceTab.removeClass('active');
            this.contactsServiceTab.removeClass('active');
            this.messagingServiceTab.removeClass('active');
            this.callService.removeClass('active');
            this.messagingService.removeClass('active');
            this.contactsService.removeClass('active');
            this.callsServiceTab.addClass('hide');
            this.contactsServiceTab.addClass('hide');
            this.messagingServiceTab.addClass('hide');
            this.callService.addClass('hide');
            this.messagingService.addClass('hide');
            this.contactsService.addClass('hide');
        },

        /**
         * Function add information that un-registration failed.
         */
        userUnregistrationFailed: function () {
            this.logoutBtn.prop('disabled', false);
            this.errorLog.append('<div>Logout failed</div>');
        },

        /**
         * Function active Call tab.
         */
        activeCallTab: function () {
            this.callsServiceTab.addClass('active');
            this.callService.addClass('active');
        },

        /**
         * Function show Call tab.
         */
        showCallTab: function () {
            this.callsServiceTab.removeClass('hide');
            this.callService.removeClass('hide');
        },

        /**
         * Function active Messaging tab.
         */
        activeMessagingTab: function () {
            this.messagingServiceTab.addClass('active');
            this.messagingService.addClass('active');
        },

        /**
         * Function show Messaging tab.
         */
        showMessagingTab: function () {
            this.messagingServiceTab.removeClass('hide');
            this.messagingService.removeClass('hide');
        },

        /**
         * Function active Contacts tab.
         */
        activeContactsTab: function () {
            this.contactsServiceTab.addClass('active');
            this.contactsService.addClass('active');
        },

        /**
         * Function show Contacts tab.
         */
        showContactsTab: function () {
            this.contactsServiceTab.removeClass('hide');
            this.contactsService.removeClass('hide');
        }
    };

    window.LoginView = LoginView;

})
(window, jQuery);
