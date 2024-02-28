(function (window, $) {
    'use strict';

    function ContactController(contactsService) {
        this._contactsService = contactsService;
        this._contact = undefined;
        this._editableContact = undefined;
        this._contactView = new window.ContactView({
            handleAddContact: function (contactData) {
                this.addContact(contactData);
            }.bind(this),
            handleDeleteContact: function () {
                this.deleteContact();
            }.bind(this),
            handleUpdateContact: function (contactData) {
                this.updateContact(contactData);
            }.bind(this),
            handleAddPhoneNumber: function () {
                this.addPhoneNumber();
            }.bind(this),
            handleAddEmailAddress: function () {
                this.addEmailAddress();
            }.bind(this),
            handleAddIMAddress: function () {
                this.addIMAddress();
            }.bind(this)
        });
    }


    ContactController.prototype = {
        /**
         * Init function for Contact service.
         * Registration callbacks releated with Contact service.
         *
         * @param {Object} contact
         */
        init: function (contact) {
            this._contact = contact;

            if (this._contact) {
                this._editableContact = this._contactsService.createEditableContactFromContact(this._contact);
                this._contactView.resetContactForm();
                this._contactView.setContactModalTitle(this._editableContact.getDisplayName().getValue());
                this._contactView.setContactButtonsState(this._editableContact._isInContactList());

                var contactData = {
                    contactFirstName: this._editableContact.getFirstName().getValue(),
                    contactFirstNameCapability: this._editableContact.getFirstName().getWriteCapability().isAllowed,
                    contactFirstNameASCII: this._editableContact.getASCIIFirstName().getValue(),
                    contactFirstNameASCIICapability: this._editableContact.getASCIIFirstName().getWriteCapability().isAllowed,
                    contactAlias: this._editableContact.getAlias().getValue(),
                    contactAliasCapability: this._editableContact.getAlias().getWriteCapability().isAllowed,
                    contactCompany: this._editableContact.getCompany().getValue(),
                    contactCompanyCapability: this._editableContact.getCompany().getWriteCapability().isAllowed,

                    contactLastName: this._editableContact.getLastName().getValue(),
                    contactLastNameCapability: this._editableContact.getLastName().getWriteCapability().isAllowed,
                    contactLastNameASCII: this._editableContact.getASCIILastName().getValue(),
                    contactLastNameASCIICapability: this._editableContact.getASCIILastName().getWriteCapability().isAllowed,
                    contactLocation: this._editableContact.getLocation().getValue(),
                    contactLocationCapability: this._editableContact.getLocation().getWriteCapability().isAllowed,
                    contactManager: this._editableContact.getManager().getValue(),
                    contactManagerCapability: this._editableContact.getManager().getWriteCapability().isAllowed,

                    contactDisplayName: this._editableContact.getDisplayName().getValue(),
                    contactDisplayNameCapability: this._editableContact.getDisplayName().getWriteCapability().isAllowed,
                    contactDisplayNameASCII: this._editableContact.getASCIIDisplayName().getValue(),
                    contactDisplayNameASCIICapability: this._editableContact.getASCIIDisplayName().getWriteCapability().isAllowed,
                    contactWorkRoomNumber: this._editableContact.getWorkRoomNumber().getValue(),
                    contactWorkRoomNumberCapability: this._editableContact.getWorkRoomNumber().getWriteCapability().isAllowed,
                    contactDepartment: this._editableContact.getDepartment().getValue(),
                    contactDepartmentCapability: this._editableContact.getDepartment().getWriteCapability().isAllowed,

                    contactStreetAddress: this._editableContact.getStreetAddress().getValue(),
                    contactStreetAddressCapability: this._editableContact.getStreetAddress().getWriteCapability().isAllowed,
                    contactCity: this._editableContact.getCity().getValue(),
                    contactCityCapability: this._editableContact.getCity().getWriteCapability().isAllowed,

                    contactState: this._editableContact.getState().getValue(),
                    contactStateCapability: this._editableContact.getState().getWriteCapability().isAllowed,
                    contactNotes: this._editableContact.getNotes().getValue(),
                    contactNotesCapability: this._editableContact.getNotes().getWriteCapability().isAllowed,

                    contactCountry: this._editableContact.getCountry().getValue(),
                    contactCountryCapability: this._editableContact.getCountry().getWriteCapability().isAllowed,
                    contactScopiaUserId: this._editableContact.getScopiaUserId().getValue(),
                    contactScopiaUserIdCapability: this._editableContact.getScopiaUserId().getWriteCapability().isAllowed,

                    contactPostalCode: this._editableContact.getPostalCode().getValue(),
                    contactPostalCodeCapability: this._editableContact.getPostalCode().getWriteCapability().isAllowed,

                    phoneNumbers: this._editableContact.getPhoneNumbers().getValues(),
                    phoneNumbersCapability: this._editableContact.getPhoneNumbers().getWriteCapability().isAllowed,
                    emailAddresses: this._editableContact.getEmailAddresses().getValues(),
                    emailAddressesCapability: this._editableContact.getEmailAddresses().getWriteCapability().isAllowed,
                    IMAddresses: this._editableContact.getIMAddresses().getValues(),
                    IMAddressesCapability: this._editableContact.getIMAddresses().getWriteCapability().isAllowed,

                    custom1: this._editableContact.getCustom1().getValues(),
                    custom1Capability: this._editableContact.getCustom1().getWriteCapability().isAllowed,
                    custom2: this._editableContact.getCustom2().getValues(),
                    custom2Capability: this._editableContact.getCustom2().getWriteCapability().isAllowed,
                    custom3: this._editableContact.getCustom3().getValues(),
                    custom3Capability: this._editableContact.getCustom3().getWriteCapability().isAllowed
                };
                if (this._contact.getTerminal()) {
                    contactData.contactTerminalName = this._contact.getTerminal().getTerminalName();
                    contactData.contactTerminalId = this._contact.getTerminal().getTerminalId();
                }
                this._contactView.setAllContactData(contactData);

                var phoneNumbers = this._editableContact.getPhoneNumbers().getValues(),
                    phoneNumbersCapability = this._editableContact.getPhoneNumbers().getWriteCapability().isAllowed;
                this._addExistedPhoneNumbers(phoneNumbers, phoneNumbersCapability);

                var emailAddresses = this._editableContact.getEmailAddresses().getValues(),
                    emailAddressesCapability = this._editableContact.getEmailAddresses().getWriteCapability().isAllowed;
                this._addExistedEmailAddresses(emailAddresses, emailAddressesCapability);

                var IMAddresses = this._editableContact.getIMAddresses().getValues(),
                    IMAddressesCapability = this._editableContact.getIMAddresses().getWriteCapability().isAllowed;
                this._addExistedIMAddresses(IMAddresses, IMAddressesCapability);

            } else {
                this._editableContact = this._contactsService.createEditableContact();
                this._contactView.resetContactForm();
                this._contactView.setContactModalTitle(this._editableContact.getDisplayName().getValue());
                this._contactView.setContactButtonsState(this._editableContact._isInContactList());
            }

            this._contactView.showContactModal();
        },

        /**
         * Function add contact to account.
         *
         * @param {Object} contactData
         */
        addContact: function (contactData) {
            this._setEditableContactData(contactData);
            this._contactsService.addContact(this._editableContact).then(function () {
                this._contactView.hideContactModal();
            }.bind(this), function (error) {
                if (error && error.getReason()) {
                    this._contactView.writeContactErrorMsg(error.getReason());
                }
            }.bind(this));
        },

        /**
         * Function remove contact from account.
         */
        deleteContact: function () {
            this._contactsService.deleteContact(this._contact).then(function () {
                this._contactView.hideContactModal();
            }.bind(this), function (error) {
                if (error && error.getReason()) {
                    this._contactView.writeContactErrorMsg(error.getReason());
                }
            }.bind(this));
        },

        /**
         * Function update account contact.
         *
         * @param contactData
         */
        updateContact: function (contactData) {
            this._setEditableContactData(contactData);
            this._contactsService.updateContact(this._editableContact).then(function () {
                this._contactView.hideContactModal();
            }.bind(this), function (error) {
                if (error && error.getReason()) {
                    this._contactView.writeContactErrorMsg(error.getReason());
                }
            }.bind(this));
        },

        /**
         * Add new phone number.
         */
        addPhoneNumber: function () {
            var editablePhoneNumbers = this._editableContact.getPhoneNumbers().getValues();
            var newPhoneNumber = new AvayaClientServices.Services.Contacts.EditableContactPhoneField();
            editablePhoneNumbers.push(newPhoneNumber);
        },

        /**
         * Add new email address.
         */
        addEmailAddress: function () {
            var editableEmailAddress = this._editableContact.getEmailAddresses().getValues();
            var newEmailAddress = new AvayaClientServices.Services.Contacts.EditableContactEmailAddressField();
            editableEmailAddress.push(newEmailAddress);
        },

        /**
         * Add new IM address.
         */
        addIMAddress: function () {
            var editableIMAddress = this._editableContact.getIMAddresses().getValues();
            var newIMAddress = new AvayaClientServices.Services.Contacts.EditableContactIMAddressField();
            editableIMAddress.push(newIMAddress);
        },

        /**
         * Function add phone numbers to contact details.
         *
         * @param {Array} phoneNumbers
         * @param {Boolean} phoneNumbersCapability
         * @private
         */
        _addExistedPhoneNumbers: function (phoneNumbers, phoneNumbersCapability) {
            this._contactView.setPhoneNumbersAdding(phoneNumbersCapability);
            phoneNumbers.forEach(function (phoneNumber, index) {
                var phoneNumberData = {
                    index: index,
                    default: phoneNumber.isDefault(),
                    label1: phoneNumber.getLabel1(),
                    label2: phoneNumber.getLabel2(),
                    phoneNumber: phoneNumber.getPhoneNumber(),
                    speedDialEnabled: phoneNumber.isSpeedDialEnabled(),
                    phoneNumberCapability: phoneNumber.getWriteCapability().isAllowed
                };
                switch (phoneNumber.getPhoneNumberType()) {
                    case AvayaClientServices.Services.Contacts.ContactPhoneNumberType.PHONE_NUMBER_WORK:
                        phoneNumberData.phoneNumberType = 'Work';
                        break;
                    case AvayaClientServices.Services.Contacts.ContactPhoneNumberType.PHONE_NUMBER_HANDLE:
                        phoneNumberData.phoneNumberType = 'SIP Handle';
                        break;
                    case AvayaClientServices.Services.Contacts.ContactPhoneNumberType.PHONE_NUMBER_MOBILE:
                        phoneNumberData.phoneNumberType = 'Mobile';
                        break;
                    case AvayaClientServices.Services.Contacts.ContactPhoneNumberType.PHONE_NUMBER_HOME:
                        phoneNumberData.phoneNumberType = 'Home';
                        break;
                    case AvayaClientServices.Services.Contacts.ContactPhoneNumberType.PHONE_NUMBER_FAX:
                        phoneNumberData.phoneNumberType = 'Fax';
                        break;
                    case AvayaClientServices.Services.Contacts.ContactPhoneNumberType.PHONE_NUMBER_PAGER:
                        phoneNumberData.phoneNumberType = 'Pager';
                        break;
                    default:
                        phoneNumberData.phoneNumberType = 'Work';
                }
                this._contactView.addPhoneNumber(phoneNumberData);
            }.bind(this));
        },

        /**
         * Function add email addresses to contact details.
         *
         * @param {Object} emailAddresses
         * @param {Boolean} emailAddressesCapability
         * @private
         */
        _addExistedEmailAddresses: function (emailAddresses, emailAddressesCapability) {
            this._contactView.setEmailAddressesAdding(emailAddressesCapability);
            emailAddresses.forEach(function (emailAddress, index) {
                var emailAddressData = {
                    index: index,
                    default: emailAddress.isDefault(),
                    emailAddress: emailAddress.getAddress(),
                    emailAddressCapability: emailAddress.getWriteCapability().isAllowed
                };
                switch (emailAddress.getEmailAddressType()) {
                    case AvayaClientServices.Services.Contacts.ContactEmailAddressType.EMAIL_ADDRESS_WORK:
                        emailAddressData.emailAddressType = 'Work';
                        break;
                    case AvayaClientServices.Services.Contacts.ContactEmailAddressType.EMAIL_ADDRESS_OTHER:
                        emailAddressData.emailAddressType = 'Other';
                        break;
                    default:
                        emailAddressData.emailAddressType = 'Work';
                }
                this._contactView.addEmailAddress(emailAddressData);
            }.bind(this));
        },

        /**
         * Function add IM addresses to contact details.
         *
         * @param {Object} IMAddresses
         * @param {Boolean} IMAddressesCapability
         * @private
         */
        _addExistedIMAddresses: function (IMAddresses, IMAddressesCapability) {
            this._contactView.setIMAddressesAdding(IMAddressesCapability);
            IMAddresses.forEach(function (IMAddress, index) {
                var IMAddressData = {
                    index: index,
                    default: IMAddress.isDefault(),
                    IMAddress: IMAddress.getAddress(),
                    IMAddressCapability: IMAddress.getWriteCapability().isAllowed
                };
                switch (IMAddress.getIMAddressType()) {
                    case AvayaClientServices.Services.Contacts.ContactIMAddressType.IM_ADDRESS_WORK:
                        IMAddressData.IMAddressType = 'Work';
                        break;
                    case AvayaClientServices.Services.Contacts.ContactIMAddressType.IM_ADDRESS_OTHER:
                        IMAddressData.IMAddressType = 'Other';
                        break;
                    default:
                        IMAddressData.IMAddressType = 'Work';
                }
                this._contactView.addIMAddress(IMAddressData);
            }.bind(this));
        },

        /**
         * Function set values in editable contact from details form.
         *
         * @param {Object} contactData
         * @private
         */
        _setEditableContactData: function (contactData) {
            this._editableContact.getFirstName().setValue(contactData.contactFirstName);
            this._editableContact.getASCIIFirstName().setValue(contactData.contactFirstNameASCII);
            this._editableContact.getAlias().setValue(contactData.contactAlias);
            this._editableContact.getCompany().setValue(contactData.contactCompany);

            this._editableContact.getLastName().setValue(contactData.contactLastName);
            this._editableContact.getASCIILastName().setValue(contactData.contactLastNameASCII);
            this._editableContact.getLocation().setValue(contactData.contactLocation);
            this._editableContact.getManager().setValue(contactData.contactManager);

            this._editableContact.getDisplayName().setValue(contactData.contactDisplayName);
            this._editableContact.getASCIIDisplayName().setValue(contactData.contactDisplayNameASCII);
            this._editableContact.getWorkRoomNumber().setValue(contactData.contactWorkRoomNumber);
            this._editableContact.getDepartment().setValue(contactData.contactDepartment);

            this._editableContact.getStreetAddress().setValue(contactData.contactStreetAddress);
            this._editableContact.getCity().setValue(contactData.contactCity);

            this._editableContact.getState().setValue(contactData.contactState);
            this._editableContact.getNotes().setValue(contactData.contactNotes);

            this._editableContact.getCountry().setValue(contactData.contactCountry);
            this._editableContact.getScopiaUserId().setValue(contactData.contactScopiaUserId);

            this._editableContact.getPostalCode().setValue(contactData.contactPostalCode);

            this._updateEditableContactPhoneNumbers(contactData.phoneNumbers);
            this._updateEditableContactEmailAddresses(contactData.emailAddresses);
            this._updateEditableContactIMAddresses(contactData.IMAddresses);

        },

        /**
         * Function update old and delete phone numbers.
         *
         * @param {Array} phoneNumbers
         * @private
         */
        _updateEditableContactPhoneNumbers: function (phoneNumbers) {
            var editablePhoneNumbers = this._editableContact.getPhoneNumbers().getValues();
            phoneNumbers.forEach(function (phoneNumber, index) {
                if (phoneNumber && editablePhoneNumbers[phoneNumber.index].getWriteCapability().isAllowed) {
                    this._setEditableContactPhoneNumbers(editablePhoneNumbers[index], phoneNumber);
                }
            }.bind(this));
            for (var i = editablePhoneNumbers.length; i--;) {
                if (phoneNumbers[i] === undefined && editablePhoneNumbers[i] !== undefined) {
                    editablePhoneNumbers.splice(i, 1);
                }
            }
        },

        /**
         * Function set values for new and old phone numbers.
         *
         * @param {Object} editablePhoneNumber
         * @param {Object} phoneNumberNewData
         * @private
         */
        _setEditableContactPhoneNumbers: function (editablePhoneNumber, phoneNumberNewData) {
            editablePhoneNumber.setDefault(phoneNumberNewData.default);
            editablePhoneNumber.setLabel1(phoneNumberNewData.label1);
            editablePhoneNumber.setLabel2(phoneNumberNewData.label2);
            editablePhoneNumber.setPhoneNumber(phoneNumberNewData.phoneNumber);
            editablePhoneNumber.setSpeedDialEnabled(phoneNumberNewData.speedDialEnabled);
            switch (phoneNumberNewData.phoneNumberType) {
                case 'Work':
                    editablePhoneNumber.setPhoneNumberType(AvayaClientServices.Services.Contacts.ContactPhoneNumberType.PHONE_NUMBER_WORK);
                    break;
                case 'SIP Handle':
                    editablePhoneNumber.setPhoneNumberType(AvayaClientServices.Services.Contacts.ContactPhoneNumberType.PHONE_NUMBER_HANDLE);
                    break;
                case 'Mobile':
                    editablePhoneNumber.setPhoneNumberType(AvayaClientServices.Services.Contacts.ContactPhoneNumberType.PHONE_NUMBER_MOBILE);
                    break;
                case 'Home':
                    editablePhoneNumber.setPhoneNumberType(AvayaClientServices.Services.Contacts.ContactPhoneNumberType.PHONE_NUMBER_HOME);
                    break;
                case 'Fax':
                    editablePhoneNumber.setPhoneNumberType(AvayaClientServices.Services.Contacts.ContactPhoneNumberType.PHONE_NUMBER_FAX);
                    break;
                case 'Pager':
                    editablePhoneNumber.setPhoneNumberType(AvayaClientServices.Services.Contacts.ContactPhoneNumberType.PHONE_NUMBER_PAGER);
                    break;
                default:
                    editablePhoneNumber.setPhoneNumberType(AvayaClientServices.Services.Contacts.ContactPhoneNumberType.PHONE_NUMBER_WORK);
            }
        },

        /**
         * Function update old and delete email addresses.
         *
         * @param {Array} emailAddresses
         * @private
         */
        _updateEditableContactEmailAddresses: function (emailAddresses) {
            var editableEmailAddresses = this._editableContact.getEmailAddresses().getValues();
            emailAddresses.forEach(function (emailAddress) {
                if (emailAddress && editableEmailAddresses[emailAddress.index].getWriteCapability().isAllowed) {
                    this._setEditableContactEmailAddress(editableEmailAddresses[emailAddress.index], emailAddress);
                }
            }.bind(this));
            for (var i = editableEmailAddresses.length; i--;) {
                if (emailAddresses[i] === undefined &&editableEmailAddresses[i] !== undefined) {
                    editableEmailAddresses.splice(i, 1);
                }
            }
        },

        /**
         * Function set values for new and old email addresses.
         *
         * @param {Object} editableEmailAddress
         * @param {Object} emailAddressNewData
         * @private
         */
        _setEditableContactEmailAddress: function (editableEmailAddress, emailAddressNewData) {
            editableEmailAddress.setAddress(emailAddressNewData.emailAddress);
            switch (emailAddressNewData.emailAddressType) {
                case 'Work':
                    editableEmailAddress.setEmailAddressType(AvayaClientServices.Services.Contacts.ContactEmailAddressType.EMAIL_ADDRESS_WORK);
                    break;
                case 'Other':
                    editableEmailAddress.setEmailAddressType(AvayaClientServices.Services.Contacts.ContactEmailAddressType.EMAIL_ADDRESS_OTHER);
                    break;
                default:
                    editableEmailAddress.setEmailAddressType(AvayaClientServices.Services.Contacts.ContactEmailAddressType.EMAIL_ADDRESS_WORK);
            }
        },

        /**
         * Function update old and delete IM addresses.
         *
         * @param {Array} IMAddresses
         * @private
         */
        _updateEditableContactIMAddresses: function (IMAddresses) {
            var editableIMAddresses = this._editableContact.getIMAddresses().getValues();
            IMAddresses.forEach(function (IMAddress) {
                if (IMAddress && editableIMAddresses[IMAddress.index].getWriteCapability().isAllowed) {
                    this._setEditableContactIMAddress(editableIMAddresses[IMAddress.index], IMAddress);
                }
            }.bind(this));
            for (var i = editableIMAddresses.length; i--;) {
                if (IMAddresses[i] === undefined &&editableIMAddresses[i] !== undefined) {
                    editableIMAddresses.splice(i, 1);
                }
            }
        },

        /**
         * Function set values for new and old IM addresses.
         *
         * @param {Object} editableIMAddress
         * @param {Object} IMAddressNewData
         * @private
         */
        _setEditableContactIMAddress: function (editableIMAddress, IMAddressNewData) {
            editableIMAddress.setAddress(IMAddressNewData.IMAddress);
            switch (IMAddressNewData.IMAddressType) {
                case 'Work':
                    editableIMAddress.setIMAddressType(AvayaClientServices.Services.Contacts.ContactIMAddressType.IM_ADDRESS_WORK);
                    break;
                case 'Other':
                    editableIMAddress.setIMAddressType(AvayaClientServices.Services.Contacts.ContactIMAddressType.IM_ADDRESS_OTHER);
                    break;
                default:
                    editableIMAddress.setIMAddressType(AvayaClientServices.Services.Contacts.ContactIMAddressType.IM_ADDRESS_WORK);
            }
        }

    };

    window.ContactController = ContactController;

})(window, jQuery);
