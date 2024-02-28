(function (window, $) {
    'use strict';

    function ContactView(handlers) {
        this.contactModal = $('#contactModal');
        this.contactForm = $("#contactForm");

        this.phoneNumbersContainer = $("#phoneNumbersContainer");
        this.emailAddressesContainer = $("#emailAddressesContainer");
        this.IMAddressesContainer = $("#IMAddressesContainer");
        this.addPhoneNumberBtn = $("#addPhoneNumberBtn");
        this.addEmailAddressBtn = $("#addEmailAddressBtn");
        this.addIMAddressBtn = $("#addIMAddressBtn");

        this.contactModalTitle = $("#contactModalTitle");
        this.saveContact = $("#saveContact");
        this.addContact = $("#addContact");
        this.deleteContact = $("#deleteContact");

        this.contactFirstName = $("#contactFirstName");
        this.contactFirstNameASCII = $("#contactFirstNameASCII");
        this.contactAlias = $("#contactAlias");
        this.contactCompany = $("#contactCompany");

        this.contactLastName = $("#contactLastName");
        this.contactLastNameASCII = $("#contactLastNameASCII");
        this.contactLocation = $("#contactLocation");
        this.contactManager = $("#contactManager");

        this.contactDisplayName = $("#contactDisplayName");
        this.contactDisplayNameASCII = $("#contactDisplayNameASCII");
        this.contactWorkRoomNumber = $("#contactWorkRoomNumber");
        this.contactDepartment = $("#contactDepartment");

        this.contactStreetAddress = $("#contactStreetAddress");
        this.contactCity = $("#contactCity");

        this.contactState = $("#contactState");
        this.contactNotes = $("#contactNotes");
        this.contactTerminalName = $("#contactTerminalName");

        this.contactCountry = $("#contactCountry");
        this.contactScopiaUserId = $("#contactScopiaUserID");

        this.contactPostalCode = $("#contactPostalCode");
        this.contactTerminalId = $("#contactTerminalID");

        this.contactDetailErrorMsg = $("#contactDetailErrorMsg");

        this.phoneNumbersContainer.on('click', '.deleteContactBlock', function (event) {
            this._deletePhoneNumberBlock($(event.target).prop('id'));
        }.bind(this));

        this.emailAddressesContainer.on('click', '.deleteContactBlock', function (event) {
            this._deleteEmailAddressBlock($(event.target).prop('id'));
        }.bind(this));

        this.IMAddressesContainer.on('click', '.deleteContactBlock', function (event) {
            this._deleteIMAddressBlock($(event.target).prop('id'));
        }.bind(this));

        this.saveContact.on('click', function () {
            var contactData = this._getAllContactData();
            handlers.handleUpdateContact(contactData);
        }.bind(this));

        this.addContact.on('click', function () {
            var contactData = this._getAllContactData();
            handlers.handleAddContact(contactData);
        }.bind(this));

        this.deleteContact.on('click', function () {
            handlers.handleDeleteContact();
        }.bind(this));

        this.addPhoneNumberBtn.on('click', function () {
            this.addPhoneNumber({
                index: this._phoneNumbers.length,
                default: false,
                label1: undefined,
                label2: undefined,
                phoneNumber: undefined,
                speedDialEnabled: undefined,
                phoneNumberCapability: true
            });
            handlers.handleAddPhoneNumber();
        }.bind(this));

        this.addEmailAddressBtn.on('click', function () {
            this.addEmailAddress({
                index: this._emailAddresses.length,
                default: false,
                emailAddress: undefined,
                emailAddressCapability: true
            });
            handlers.handleAddEmailAddress();
        }.bind(this));

        this.addIMAddressBtn.on('click', function () {
            this.addIMAddress({
                index: this._IMAddresses.length,
                default: false,
                IMAddress: undefined,
                IMAddressCapability: true
            });
            handlers.handleAddIMAddress();
        }.bind(this));

        this.contactModal.modal({
            show: false
        });

        this._phoneNumbers = [];
        this._emailAddresses = [];
        this._IMAddresses = [];
    }


    ContactView.prototype = {
        /**
         * Function set detail modal title.
         *
         * @param {String} displayName
         */
        setContactModalTitle: function (displayName) {
            if (displayName) {
                this.contactModalTitle.text('Contact ' + displayName);
            } else {
                this.contactModalTitle.text('New contact');
            }
        },

        /**
         * Function show appropriate buttons for contact.
         *
         * @param {Boolean} inContactList
         */
        setContactButtonsState: function (inContactList) {
            if (inContactList) {
                this.saveContact.show();
                this.addContact.hide();
                this.deleteContact.show();
            } else {
                this.saveContact.hide();
                this.addContact.show();
                this.deleteContact.hide();
            }
        },

        /**
         * Function set all contacts data in form inputs.
         *
         * @param {Object} contactData
         */
        setAllContactData: function (contactData) {
            this.contactFirstName.val(contactData.contactFirstName);
            this.contactFirstName.prop('disabled', !contactData.contactFirstNameCapability);
            this.contactFirstNameASCII.val(contactData.contactFirstNameASCII);
            this.contactFirstNameASCII.prop('disabled', !contactData.contactFirstNameASCIICapability);
            this.contactAlias.val(contactData.contactAlias);
            this.contactAlias.prop('disabled', !contactData.contactAliasCapability);
            this.contactCompany.val(contactData.contactCompany);
            this.contactCompany.prop('disabled', !contactData.contactCompanyCapability);

            this.contactLastName.val(contactData.contactLastName);
            this.contactLastName.prop('disabled', !contactData.contactLastNameCapability);
            this.contactLastNameASCII.val(contactData.contactLastNameASCII);
            this.contactLastNameASCII.prop('disabled', !contactData.contactLastNameASCIICapability);
            this.contactLocation.val(contactData.contactLocation);
            this.contactLocation.prop('disabled', !contactData.contactLocationCapability);
            this.contactManager.val(contactData.contactManager);
            this.contactManager.prop('disabled', !contactData.contactManagerCapability);

            this.contactDisplayName.val(contactData.contactDisplayName);
            this.contactDisplayName.prop('disabled', !contactData.contactDisplayNameCapability);
            this.contactDisplayNameASCII.val(contactData.contactDisplayNameASCII);
            this.contactDisplayNameASCII.prop('disabled', !contactData.contactDisplayNameASCIICapability);
            this.contactWorkRoomNumber.val(contactData.contactWorkRoomNumber);
            this.contactWorkRoomNumber.prop('disabled', !contactData.contactWorkRoomNumberCapability);
            this.contactDepartment.val(contactData.contactDepartment);
            this.contactDepartment.prop('disabled', !contactData.contactDepartmentCapability);

            this.contactStreetAddress.val(contactData.contactStreetAddress);
            this.contactStreetAddress.prop('disabled', !contactData.contactStreetAddressCapability);
            this.contactCity.val(contactData.contactCity);
            this.contactCity.prop('disabled', !contactData.contactCityCapability);

            this.contactState.val(contactData.contactState);
            this.contactState.prop('disabled', !contactData.contactStateCapability);
            this.contactNotes.val(contactData.contactNotes);
            this.contactNotes.prop('disabled', !contactData.contactNotesCapability);
            this.contactTerminalName.val(contactData.contactTerminalName);
            this.contactCountry.val(contactData.contactCountry);
            this.contactCountry.prop('disabled', !contactData.contactCountryCapability);
            this.contactScopiaUserId.val(contactData.contactScopiaUserId);
            this.contactScopiaUserId.prop('disabled', !contactData.contactScopiaUserIdCapability);

            this.contactPostalCode.val(contactData.contactPostalCode);
            this.contactPostalCode.prop('disabled', !contactData.contactPostalCodeCapability);
            this.contactTerminalId.val(contactData.contactTerminalId);
        },

        /**
         * Function clear contact details modal.
         */
        resetContactForm: function () {
            this.contactForm.trigger('reset');

            this.contactFirstName.prop('disabled', false);
            this.contactFirstNameASCII.prop('disabled', false);
            this.contactAlias.prop('disabled', false);
            this.contactCompany.prop('disabled', false);

            this.contactLastName.prop('disabled', false);
            this.contactLastNameASCII.prop('disabled', false);
            this.contactLocation.prop('disabled', false);
            this.contactManager.prop('disabled', false);

            this.contactDisplayName.prop('disabled', false);
            this.contactDisplayNameASCII.prop('disabled', false);
            this.contactWorkRoomNumber.prop('disabled', false);
            this.contactDepartment.prop('disabled', false);

            this.contactStreetAddress.prop('disabled', false);
            this.contactCity.prop('disabled', false);

            this.contactState.prop('disabled', false);
            this.contactNotes.prop('disabled', false);
            this.contactCountry.prop('disabled', false);
            this.contactScopiaUserId.prop('disabled', false);

            this.contactPostalCode.prop('disabled', false);

            this._phoneNumbers = [];
            this.phoneNumbersContainer.empty();
            this._emailAddresses = [];
            this.emailAddressesContainer.empty();
            this._IMAddresses = [];
            this.IMAddressesContainer.empty();
        },

        /**
         * Function show contact modal.
         */
        showContactModal: function () {
            this.contactModal.modal('show');
        },

        /**
         * Function hide contact modal.
         */
        hideContactModal: function () {
            this.contactModal.modal('hide');
        },

        /**
         * Function block or unblock add Phone number button.
         *
         * @param {Boolean} phoneNumbersCapability
         */
        setPhoneNumbersAdding: function (phoneNumbersCapability) {
            this.addPhoneNumberBtn.prop('disabled', !phoneNumbersCapability);
        },

        /**
         * Function block or unblock add Email address button.
         *
         * @param {Boolean} emailAddressesCapability
         */
        setEmailAddressesAdding: function (emailAddressesCapability) {
            this.addEmailAddressBtn.prop('disabled', !emailAddressesCapability);
        },

        /**
         * Function block or unblock add IM address button.
         *
         * @param {Boolean} IMAddressesCapability
         */
        setIMAddressesAdding: function (IMAddressesCapability) {
            this.addIMAddressBtn.prop('disabled', !IMAddressesCapability);
        },

        /**
         * Show contact details error.
         *
         * @param {String} displayMsg
         */
        writeContactErrorMsg: function (displayMsg) {
            this.contactDetailErrorMsg.text(displayMsg);
        },

        /**
         * Add phone numbers HTML container to contact details.
         *
         * @param {Object} phoneNumberData
         */
        addPhoneNumber: function (phoneNumberData) {
            var phoneNumber = '<div class="row" id="phoneNumberId' + phoneNumberData.index + '"><hr>' +
                                '<div class="col-md-4">' +
                                    '<div class="form-group">' +
                                        '<label for="phoneNumber' + phoneNumberData.index + '">Phone Number</label>' +
                                        '<input type="text" class="form-control" id="phoneNumber' + phoneNumberData.index + '" placeholder="Phone Number" />' +
                                    '</div>' +
                                    '<div class="form-group">' +
                                        '<label for="phoneNumberType' + phoneNumberData.index + '">Phone Number Type</label>' +
                                        '<select class="form-control" id="phoneNumberType' + phoneNumberData.index + '">' +
                                            '<option>Work</option>' +
                                            '<option>SIP Handle</option>' +
                                            '<option>Mobile</option>' +
                                            '<option>Home</option>' +
                                            '<option>Fax</option>' +
                                            '<option>Pager</option>' +
                                        '</select>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="col-md-4">' +
                                    '<div class="form-group">' +
                                        '<label for="label1_' + phoneNumberData.index + '">Label 1</label>' +
                                        '<input type="text" class="form-control" id="label1_' + phoneNumberData.index + '" placeholder="Label 1" />' +
                                    '</div>' +
                                    '<div class="form-group">' +
                                        '<div class="checkbox">' +
                                            '<label for="speedDialEnabled' + phoneNumberData.index + '">' +
                                                '<input id="speedDialEnabled' + phoneNumberData.index + '" type="checkbox" />' +
                                                'Speed Dial Enabled' +
                                            '</label>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="form-group">' +
                                        '<div class="checkbox">' +
                                            '<label for="phoneNumberDefault' + phoneNumberData.index + '">' +
                                                '<input id="phoneNumberDefault' + phoneNumberData.index + '" type="checkbox" />' +
                                                'Default Phone Number' +
                                            '</label>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="col-md-4">' +
                                    '<div class="form-group">' +
                                        '<label for="label2_' + phoneNumberData.index + '">Label 2</label>' +
                                        '<input type="text" class="form-control" id="label2_' + phoneNumberData.index + '" placeholder="Label 2" />' +
                                    '</div>' +
                                    '<div class="form-group">' +
                                        '<button id="deletePhoneNumber' + phoneNumberData.index + '" type="button" class="btn btn-link deleteContactBlock">Delete</button>' +
                                    '</div>' +
                                '</div>' +
                               '</div>';
            this.phoneNumbersContainer.append(phoneNumber);
            this._phoneNumbers[phoneNumberData.index] = phoneNumberData;
            this._setPhoneNumberData(phoneNumberData);
        },

        /**
         * Add email addresses HTML container to contact details.
         *
         * @param {Object} emailAddressData
         */
        addEmailAddress: function (emailAddressData) {
            var emailAddress = '<div class="row" id="emailAddressId' + emailAddressData.index + '"><hr>' +
                                '<div class="col-md-4">' +
                                    '<div class="form-group">' +
                                        '<label for="emailAddress' + emailAddressData.index + '">Email Address</label>' +
                                        '<input type="text" class="form-control" id="emailAddress' + emailAddressData.index + '" placeholder="Email Address" />' +
                                    '</div>' +
                                '</div>' +
                                '<div class="col-md-4">' +
                                    '<div class="form-group">' +
                                        '<label for="emailAddressType' + emailAddressData.index + '">Email Address Type</label>' +
                                        '<select class="form-control" id="emailAddressType' + emailAddressData.index + '">' +
                                            '<option>Work</option>' +
                                            '<option>Other</option>' +
                                        '</select>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="col-md-4">' +
                                    '<div class="form-group">' +
                                        '<div class="checkbox">' +
                                            '<label for="emailAddressDefault' + emailAddressData.index + '">' +
                                                '<input id="emailAddressDefault' + emailAddressData.index + '" type="checkbox" disabled />' +
                                                'Default Email Address' +
                                            '</label>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="form-group">' +
                                        '<button id="deleteEmailAddress' + emailAddressData.index + '" type="button" class="btn btn-link deleteContactBlock">Delete</button>' +
                                    '</div>' +
                                '</div>' +
                               '</div>';
            this.emailAddressesContainer.append(emailAddress);
            this._emailAddresses[emailAddressData.index] = emailAddressData;
            this._setEmailAddressData(emailAddressData);
        },

        /**
         * Add IM addresses HTML container to contact details.
         *
         * @param {Object} IMAddressData
         */
        addIMAddress: function (IMAddressData) {
            var IMAddress = '<div class="row" id="IMAddressId' + IMAddressData.index + '"><hr>' +
                                '<div class="col-md-4">' +
                                    '<div class="form-group">' +
                                        '<label for="IMAddress' + IMAddressData.index + '">IM Address</label>' +
                                        '<input type="text" class="form-control" id="IMAddress' + IMAddressData.index + '" placeholder="IM Address" />' +
                                    '</div>' +
                                '</div>' +
                                '<div class="col-md-4">' +
                                    '<div class="form-group">' +
                                        '<label for="IMAddressType' + IMAddressData.index + '">IM Address Type</label>' +
                                        '<select class="form-control" id="IMAddressType' + IMAddressData.index + '">' +
                                            '<option>Work</option>' +
                                            '<option>Other</option>' +
                                        '</select>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="col-md-4">' +
                                    '<div class="form-group">' +
                                        '<div class="checkbox">' +
                                            '<label for="IMAddressDefault' + IMAddressData.index + '">' +
                                                '<input id="IMAddressDefault' + IMAddressData.index + '" type="checkbox" disabled />' +
                                                'Default IM Address' +
                                            '</label>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="form-group">' +
                                        '<button id="deleteIMAddress' + IMAddressData.index + '" type="button" class="btn btn-link deleteContactBlock">Delete</button>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';
            this.IMAddressesContainer.append(IMAddress);
            this._IMAddresses[IMAddressData.index] = IMAddressData;
            this._setIMAddressData(IMAddressData);
        },

        /**
         * Set phone number input fields values.
         *
         * @param {Object} phoneNumberData
         * @private
         */
        _setPhoneNumberData: function (phoneNumberData) {
            var phoneNumber = $("#phoneNumber" + phoneNumberData.index),
                phoneNumberType = $("#phoneNumberType" + phoneNumberData.index),
                label1 = $("#label1_" + phoneNumberData.index),
                speedDialEnabled = $("#speedDialEnabled" + phoneNumberData.index),
                phoneNumberDefault = $("#phoneNumberDefault" + phoneNumberData.index),
                label2 = $("#label2_" + phoneNumberData.index),
                deletePhoneNumber = $("#deletePhoneNumber" + phoneNumberData.index);

            phoneNumber.val(phoneNumberData.phoneNumber);
            phoneNumberType.val(phoneNumberData.phoneNumberType);
            label1.val(phoneNumberData.label1);
            speedDialEnabled.prop('checked', phoneNumberData.speedDialEnabled);
            phoneNumberDefault.prop('checked', phoneNumberData.default);
            label2.val(phoneNumberData.label2);

            if (!phoneNumberData.phoneNumberCapability) {
                phoneNumber.prop('disabled', true);
                phoneNumberType.prop('disabled', true);
                label1.prop('disabled', true);
                speedDialEnabled.prop('disabled', true);
                phoneNumberDefault.prop('disabled', true);
                label2.prop('disabled', true);
                deletePhoneNumber.prop('disabled', true);
            }
        },

        /**
         * Set email address input fields values.
         *
         * @param {Object} emailAddressData
         * @private
         */
        _setEmailAddressData: function (emailAddressData) {
            var emailAddress = $("#emailAddress" + emailAddressData.index),
                emailAddressType = $("#emailAddressType" + emailAddressData.index),
                emailAddressDefault = $("#emailAddressDefault" + emailAddressData.index),
                deleteEmailAddress = $("#deleteEmailAddress" + emailAddressData.index);

            emailAddress.val(emailAddressData.emailAddress);
            emailAddressType.val(emailAddressData.emailAddressType);
            emailAddressDefault.prop('checked', emailAddressData.default);

            if (!emailAddressData.emailAddressCapability) {
                emailAddress.prop('disabled', true);
                emailAddressType.prop('disabled', true);
                emailAddressDefault.prop('disabled', true);
                deleteEmailAddress.prop('disabled', true);
            }
        },

        /**
         * Set IM address input fields values.
         *
         * @param {Object} IMAddressData
         * @private
         */
        _setIMAddressData: function (IMAddressData) {
            var IMAddress = $("#IMAddress" + IMAddressData.index),
                IMAddressType = $("#IMAddressType" + IMAddressData.index),
                IMAddressDefault = $("#IMAddressDefault" + IMAddressData.index),
                deleteIMAddress = $("#deleteIMAddress" + IMAddressData.index);

            IMAddress.val(IMAddressData.IMAddress);
            IMAddressType.val(IMAddressData.IMAddressType);
            IMAddressDefault.prop('checked', IMAddressData.default);

            if (!IMAddressData.IMAddressCapability) {
                IMAddress.prop('disabled', true);
                IMAddressType.prop('disabled', true);
                IMAddressDefault.prop('disabled', true);
                deleteIMAddress.prop('disabled', true);
            }
        },

        /**
         * Function return all input values from contact detail modal.
         *
         * @returns {Object}
         * @private
         */
        _getAllContactData: function () {
            var contactData = {
                contactFirstName: this.contactFirstName.val(),
                contactFirstNameASCII: this.contactFirstNameASCII.val(),
                contactAlias: this.contactAlias.val(),
                contactCompany: this.contactCompany.val(),

                contactLastName: this.contactLastName.val(),
                contactLastNameASCII: this.contactLastNameASCII.val(),
                contactLocation: this.contactLocation.val(),
                contactManager: this.contactManager.val(),

                contactDisplayName: this.contactDisplayName.val(),
                contactDisplayNameASCII: this.contactDisplayNameASCII.val(),
                contactWorkRoomNumber: this.contactWorkRoomNumber.val(),
                contactDepartment: this.contactDepartment.val(),

                contactStreetAddress: this.contactStreetAddress.val(),
                contactCity: this.contactCity.val(),

                contactState: this.contactState.val(),
                contactNotes: this.contactNotes.val(),
                contactTerminalName: this.contactTerminalName.val(),

                contactCountry: this.contactCountry.val(),
                contactScopiaUserId: this.contactScopiaUserId.val(),

                contactPostalCode: this.contactPostalCode.val(),
                contactTerminalId: this.contactTerminalId.val()
            };

            contactData.phoneNumbers = this._getAllPhonesData();
            contactData.emailAddresses = this._getAllEmailsData();
            contactData.IMAddresses = this._getAllIMData();

            return contactData;
        },

        /**
         * Function return phone numbers data from inputs.
         *
         * @returns {Array}
         * @private
         */
        _getAllPhonesData: function () {
            this._phoneNumbers.forEach(function (phoneNumber, index) {
                if (phoneNumber && phoneNumber.index === index) {
                    phoneNumber.default = $("#phoneNumberDefault" + phoneNumber.index).is(":checked");
                    phoneNumber.label1 = $("#label1_" + phoneNumber.index).val();
                    phoneNumber.label2 = $("#label2_" + phoneNumber.index).val();
                    phoneNumber.phoneNumber = $("#phoneNumber" + phoneNumber.index).val();
                    phoneNumber.speedDialEnabled = $("#speedDialEnabled" + phoneNumber.index).is(":checked");
                    phoneNumber.phoneNumberType = $("#phoneNumberType" + phoneNumber.index).val();
                }
            });

            return this._phoneNumbers;
        },

        /**
         * Function return email addresses data from inputs.
         *
         * @returns {Array}
         * @private
         */
        _getAllEmailsData: function () {
            this._emailAddresses.forEach(function (emailAddress, index) {
                if (emailAddress && emailAddress.index === index) {
                    emailAddress.default = $("#emailAddressDefault" + emailAddress.index).is(":checked");
                    emailAddress.emailAddress = $("#emailAddress" + emailAddress.index).val();
                    emailAddress.emailAddressType = $("#emailAddressType" + emailAddress.index).val();
                }
            });

            return this._emailAddresses;
        },

        /**
         * Function return IM addresses data from inputs.
         *
         * @returns {Array}
         * @private
         */
        _getAllIMData: function () {
            this._IMAddresses.forEach(function (IMAddress, index) {
                if (IMAddress && IMAddress.index === index) {
                    IMAddress.default = $("#IMAddressDefault" + IMAddress.index).is(":checked");
                    IMAddress.IMAddress = $("#IMAddress" + IMAddress.index).val();
                    IMAddress.IMAddressType = $("#IMAddressType" + IMAddress.index).val();
                }
            });

            return this._IMAddresses;
        },

        /**
         * Function delete phone number block.
         *
         * @param {String} id
         * @private
         */
        _deletePhoneNumberBlock: function (id) {
            var index = id.replace('deletePhoneNumber', '');
            $("#phoneNumberId" + index).remove();
            this._phoneNumbers[index] = undefined;
        },

        /**
         * Function delete email address block.
         *
         * @param {String} id
         * @private
         */
        _deleteEmailAddressBlock: function (id) {
            var index = id.replace('deleteEmailAddress', '');
            $("#emailAddressId" + index).remove();
            this._emailAddresses[index] = undefined;
        },

        /**
         * Function delete IM address block.
         *
         * @param {String} id
         * @private
         */
        _deleteIMAddressBlock: function (id) {
            var index = id.replace('deleteIMAddress', '');
            $("#IMAddressId" + index).remove();
            this._IMAddresses[index] = undefined;
        }
    };

    window.ContactView = ContactView;

})(window, jQuery);
