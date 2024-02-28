(function (window, $) {
    'use strict';

    function ContactsController(user) {
        this._user = user;
        this._contactsService = user.getContacts();
        this._contactDetails = new window.ContactController(this._contactsService);
        this._contactsRetrieval = undefined;
        this._contactsSet = undefined;
        this._searchRequest = undefined;
        this._searchRetrieval = undefined;
        this._searchDataSet = undefined;

        this._contactsView = new window.ContactsView({
            handleStartSearch: function (searchString) {
                this.startSearch(searchString);
            }.bind(this),
            handleAddNewContact: function () {
                this.openContactDetails();
            }.bind(this),
            handleShowDetails: function (contactId) {
                this.openContactDetails(contactId);
            }.bind(this)
        });

        this._contacts = [];
        this._searchContacts = [];

        this._init();
    }


    ContactsController.prototype = {
        /**
         * Init function for Contacts service.
         * Registration callbacks releated with Contacts service.
         */
        _init: function () {
            this._contactsRetrieval = this._contactsService.getContacts();
            this._contactsSet = this._contactsRetrieval.getDataSet();

            this._contactsSet.addOnDataSetChangedCallback(function (contacts, type) {
                if (type === AvayaClientServices.Base.DataSetChangeTypes.ADDED) {
                    this._addContacts(contacts, this._contacts, 'localContacts');
                } else if (type === AvayaClientServices.Base.DataSetChangeTypes.UPDATED) {
                    this._updateContacts(contacts, this._contacts, 'localContacts');
                } else if (type === AvayaClientServices.Base.DataSetChangeTypes.REMOVED) {
                    this._removeContacts(contacts, this._contacts, 'localContacts');
                }
            }.bind(this));

            this._contactsRetrieval.addOnDataRetrievalFailedCallback(function (error) {
                console.log('Failed to retrieve contacts', error);
            });

            this._contactsRetrieval.addOnDataRetrievalDoneCallback(function () {
                console.log('All contacts have been downloaded');
            });
        },

        /**
         * Function start contact searching.
         *
         * @param {String} searchString
         */
        startSearch: function (searchString) {
            if (this._searchRequest) {
                this._contactsService.changeSearchContactsRequest(this._searchRetrieval, searchString);
                this._contactsView.setSearchTitle(searchString);
                console.log('Search criteria were updated.');
            } else {
                this._searchRequest = new AvayaClientServices.Services.Contacts.ContactSearchRequest(searchString, "ALL", "ALL", 0, 0);
                this._contactsView.setSearchTitle(searchString);

                this._searchRetrieval = this._contactsService.searchContacts(this._searchRequest);
                this._searchDataSet = this._searchRetrieval.getDataSet();

                this._searchRetrieval.addOnDataRetrievalProgressCallback(function () {
                    console.log('Received search results');
                });

                this._searchRetrieval.addOnDataRetrievalDoneCallback(function () {
                    console.log('Search completed');
                }.bind(this));

                this._contactsView.clearContactsSearchTable();
                this._searchDataSet.addOnDataSetChangedCallback(function (contacts, type) {
                    if (type === AvayaClientServices.Base.DataSetChangeTypes.ADDED) {
                        console.log('Received ' + contacts.length + ' search results');
                        this._addContacts(contacts, this._searchContacts, 'searchContacts');
                    } else if (type === AvayaClientServices.Base.DataSetChangeTypes.REMOVED) {
                        console.log(contacts.length + ' search results were invalidated');
                        this._removeContacts(contacts, this._searchContacts);
                    }
                }.bind(this));
            }
        },
        /**
         * Function open modal with contact details.
         *
         * @param {String} [contactId]
         */
        openContactDetails: function(contactId) {
            if (contactId) {
                if (this._contacts[contactId]) {
                    this._contactDetails.init(this._contacts[contactId]);
                } else if (this._searchContacts[contactId]) {
                    this._contactDetails.init(this._searchContacts[contactId]);
                } else {
                    console.log('Contact not found');
                }
            } else {
                this._contactDetails.init();
            }
        },

        /**
         * Function add contact and presence state to local/search contacts list.
         *
         * @param {Array} contacts
         * @param {Array} contactsArray
         * @param {String} contactsType
         * @private
         */
        _addContacts: function (contacts, contactsArray, contactsType) {
            contacts.forEach(function (contact) {
                var fname, lname;
                var contactId = this._getContactId(contact);
                if (contact.getFirstName().getValue()) {
                    fname = contact.getFirstName().getValue();
                } else if (contact.getASCIIFirstName().getValue()) {
                    fname = contact.getASCIIFirstName().getValue();
                }

                if (contact.getLastName().getValue()) {
                    lname = contact.getLastName().getValue();
                } else if (contact.getASCIILastName().getValue()) {
                    lname = contact.getASCIILastName().getValue();
                }
                this._contactsView.addContact(contactId, fname, lname, contactsType);
                contact.addOnPresenceChangedCallback(function (data, presence) {
                    if (contact._getPresenceAddress() === presence.getPresentity()) {
                        switch (contact.getPresence().getOverallState()) {
                            case AvayaClientServices.Services.Presence.PresenceState.PRESENCE_STATE_UNKNOWN:
                                this._contactsView.setContactPresence(contactId, 'unknown');
                                break;
                            case AvayaClientServices.Services.Presence.PresenceState.PRESENCE_STATE_UNSPECIFIED:
                                this._contactsView.setContactPresence(contactId, 'unspecified');
                                break;
                            case AvayaClientServices.Services.Presence.PresenceState.PRESENCE_STATE_AVAILABLE:
                                this._contactsView.setContactPresence(contactId, 'available');
                                break;
                            case AvayaClientServices.Services.Presence.PresenceState.PRESENCE_STATE_ON_A_CALL:
                                this._contactsView.setContactPresence(contactId, 'onACall');
                                break;
                            case AvayaClientServices.Services.Presence.PresenceState.PRESENCE_STATE_BUSY:
                                this._contactsView.setContactPresence(contactId, 'busy');
                                break;
                            case AvayaClientServices.Services.Presence.PresenceState.PRESENCE_STATE_AWAY:
                                this._contactsView.setContactPresence(contactId, 'away');
                                break;
                            case AvayaClientServices.Services.Presence.PresenceState.PRESENCE_STATE_DO_NOT_DISTURB:
                                this._contactsView.setContactPresence(contactId, 'doNotDisturb');
                                break;
                            case AvayaClientServices.Services.Presence.PresenceState.PRESENCE_STATE_OUT_OF_OFFICE:
                                this._contactsView.setContactPresence(contactId, 'outOfOffice');
                                break;
                            case AvayaClientServices.Services.Presence.PresenceState.PRESENCE_STATE_OFFLINE:
                                this._contactsView.setContactPresence(contactId, 'offline');
                                break;
                            default:
                                this._contactsView.setContactPresence(contactId, 'unknown');
                        }
                    }
                }.bind(this));
                contact.startPresence();
                contactsArray[contactId] = contact;
            }.bind(this));
        },

        /**
         * Function update contact and presence state in local/search contacts list.
         *
         * @param {Array} contacts
         * @param {Array} contactsArray
         * @param {String} contactsType
         * @private
         */
        _updateContacts: function (contacts, contactsArray, contactsType) {
            contacts.forEach(function (contact) {
                var fname, lname;
                var contactId = this._getContactId(contact);
                if (contact.getFirstName().getValue()) {
                    fname = contact.getFirstName().getValue();
                } else if (contact.getASCIIFirstName().getValue()) {
                    fname = contact.getASCIIFirstName().getValue();
                }

                if (contact.getLastName().getValue()) {
                    lname = contact.getLastName().getValue();
                } else if (contact.getASCIILastName().getValue()) {
                    lname = contact.getASCIILastName().getValue();
                }
                contactsArray[contactId] = contact;
                this._contactsView.updateContact(contactId, fname, lname);
            }.bind(this));
        },

        /**
         * Function remove contact from local/search contacts list.
         *
         * @param {Array} contacts
         * @param {Array} contactsArray
         * @param {String} contactsType
         * @private
         */
        _removeContacts: function (contacts, contactsArray, contactsType) {
            contacts.forEach(function (contact) {
                var contactId = this._getContactId(contact);
				if (!!contactsArray[contactId]) {
				    contactsArray[contactId].stopPresence();
				    delete contactsArray[contactId];
				}
                this._contactsView.removeContact(contactId, contactsType);
            }.bind(this));
        },

        /**
         * Function generate contact id.
         *
         * @param {Object} contact
         * @returns {string}
         * @private
         */
        _getContactId: function (contact) {
            return "contact_" + contact.getUniqueAddressForMatching().replace(/[^a-zA-Z0-9]/g, '');
        }

    };

    window.ContactsController = ContactsController;

})(window, jQuery);
