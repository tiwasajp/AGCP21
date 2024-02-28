(function (window, $) {
    'use strict';

    function ContactsView(handlers) {
        this.contactListTableBody = $("#contactListTableBody");
        this.contactSearchListTableBody = $("#contactSearchListTableBody");
        this.searchContactInput = $("#searchContactInput");
        this.searchBtn = $("#searchBtn");
        this.searchResults = $("#searchResults");
        this.addNewContactBtn = $("#addNewContactBtn");

        this.searchBtn.on('click', function () {
            handlers.handleStartSearch(this.searchContactInput.val());
        }.bind(this));

        this.addNewContactBtn.on('click', function () {
            handlers.handleAddNewContact();
        }.bind(this));

        this.contactListTableBody.on('click', '.detailsContactBtn', function (event) {
            handlers.handleShowDetails($(event.target).attr('data-id'));
        });

        this.contactSearchListTableBody.on('click', '.detailsContactBtn', function (event) {
            handlers.handleShowDetails($(event.target).attr('data-id'));
        });
    }


    ContactsView.prototype = {
        /**
         * Function add contacts.
         *
         * @param {String} contactId
         * @param {String} fname
         * @param {String} lname
         * @param {String} contactsType
         */
        addContact: function (contactId, fname, lname, contactsType) {
            var contact;
            contact = '<tr id="' + contactId + '">' +
                        '<th scope="row" class="presenceTh"><span class="unknown glyphicon glyphicon-question-sign"></span></th>' +
                        '<td>' + fname + '</td>' +
                        '<td>' + lname + '</td>' +
                        '<td><button class="btn btn-link detailsContactBtn" data-id="' + contactId + '" type="button">Details</button></td>' +
                      '</tr>';

            if (contactsType === 'localContacts') {
                this.contactListTableBody.append(contact);
            } else {
                this.contactSearchListTableBody.append(contact);
            }
        },

        /**
         * Function update contacts.
         *
         * @param {String} contactId
         * @param {String} fname
         * @param {String} lname
         */
        updateContact: function (contactId, fname, lname) {
            var contact = $("#" + contactId);
            var presence = contact.find('.glyphicon')[0].outerHTML;
            var contactHtml = '<th scope="row" class="presenceTh">' + presence + '</th>' +
                              '<td>' + fname + '</td>' +
                              '<td>' + lname + '</td>' +
                              '<td><button class="btn btn-link detailsContactBtn" data-id="' + contactId + '" type="button">Details</button></td>';


            contact.html(contactHtml);
        },

        /**
         * Function remove contacts.
         *
         * @param {String} contactId
         * @param {String} contactsType
         */
        removeContact: function (contactId, contactsType) {
            var contact;
            if (contactsType === 'localContacts') {
                contact = this.contactListTableBody.find($("#" + contactId));
            } else {
                contact = this.contactSearchListTableBody.find($("#" + contactId));
            }
            contact.remove();
        },

        /**
         * Function set contact presence state.
         *
         * @param {String} contactId
         * @param {String} presenceState
         */
        setContactPresence: function (contactId, presenceState) {
            var contactPresence = $("#" + contactId).find($(".presenceTh"));
            var presenceStateHtml;
            switch(presenceState) {
                case 'unknown':
                    presenceStateHtml = '<span class="unknown glyphicon glyphicon-question-sign"></span>';
                    break;
                case 'unspecified':
                    presenceStateHtml = '<span class="unspecified glyphicon glyphicon-question-sign"></span>';
                    break;
                case 'available':
                    presenceStateHtml = '<span class="available glyphicon glyphicon-ok-sign"></span>';
                    break;
                case 'onACall':
                    presenceStateHtml = '<span class="onACall glyphicon glyphicon-earphone"></span>';
                    break;
                case 'busy':
                    presenceStateHtml = '<span class="busy glyphicon glyphicon-minus-sign"></span>';
                    break;
                case 'away':
                    presenceStateHtml = '<span class="away glyphicon glyphicon-ok-sign"></span>';
                    break;
                case 'doNotDisturb':
                    presenceStateHtml = '<span class="doNotDisturb glyphicon glyphicon-minus-sign"></span>';
                    break;
                case 'outOfOffice':
                    presenceStateHtml = '<span class="outOfOffice glyphicon glyphicon-ok-sign"></span>';
                    break;
                case 'offline':
                    presenceStateHtml = '<span class="offline glyphicon glyphicon-remove-sign"></span>';
                    break;
                default:
                    presenceStateHtml = '<span class="unknown glyphicon glyphicon-question-sign"></span>';
            }
            contactPresence.html(presenceStateHtml);
        },

        /**
         * Function set search title.
         *
         * @param {String} searchString
         */
        setSearchTitle: function (searchString) {
            this.searchResults.text('"' + searchString + '"');
        },

        clearContactsSearchTable: function () {
            this.contactSearchListTableBody.empty();
        },

        clearContactsTable: function () {
            this.contactListTableBody.empty();
        }
    };

    window.ContactsView = ContactsView;

})(window, jQuery);
