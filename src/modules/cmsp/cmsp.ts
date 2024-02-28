// 
// Contact Management Service Platform
// T.Iwasa
//

import { _stdout, _stdout_log, _stdout_table, _stderror } from "../lib/stdout";
const INFO: boolean = true;
const DEBUG: boolean = false;

interface Profile {
	name: string;
	address: string,
	phones: string[],
	emails: string[],
	data: any,
}

export interface ContactState {
	active: boolean
	created: any
	deleted: any
	error: any
}

export interface Message {
	id: string
	type: string
	channel: string
	ticker: string
	body: any
}

export interface DigitalChannel {
	credentialId: string
	session: any
	engagement: any
	contactReason: any
	contextData: any
	message: any
}

export interface Contact {
	contactId: string
	contactState: ContactState
	profile: Profile
	customerIdentifers: any
	digitalChannel: DigitalChannel
	messages: any[]
	summary: string
}

export class CMSP {
	private contacts: Contact[] = new Array();
	
	constructor() {
		this.contacts = [];
	}
	
	dump(tag?: string) {
		_stdout(DEBUG, `${tag} **************************************************************************`);
		_stdout_log(DEBUG, this.contacts);
	}
	
	appendContact(contactId: string): Contact {
		_stdout(INFO || DEBUG, `appendContact ${contactId}`);
		const contact: any = this.contacts.find((contact: Contact) => contact.contactId === contactId);
		if (contact === undefined) {
			this.contacts.push({
					contactId: contactId, 
					contactState: {	active: true, created: (new Date()), deleted: "", error: {}},
					profile: {
						name: "",
						address: "",
						phones: [],
						emails: [],
						data: {},
					},
					customerIdentifers: {},
					digitalChannel: {
						credentialId: "",
						session: {},
						engagement: {},
						contactReason: {},
						contextData: {},
						message: {},
					},
					messages: [],
					summary: "",
				});
			_stdout_log(INFO || DEBUG, this.contacts[this.contacts.length - 1]);
			return this.contacts[this.contacts.length - 1];
		}
		else {
			_stdout(INFO || DEBUG, `appendContact ${contactId} exists.`);
			return contact;
		}
	}
	
	getContact(contactId: string): any {
		_stdout(INFO || DEBUG, `getContact ${contactId}`);
		const contact: any = this.contacts.find((contact: Contact) => contact.contactId === contactId);
		if (contact !== undefined) {
			_stdout_log(DEBUG, contact);
			return contact;
		}
		else {
			_stdout(INFO || DEBUG, `getContact error`);
			return {};
		}
	}
	
	clearContacts(contactId: string) {
		_stdout(INFO || DEBUG, `clearContact ${contactId}`);
		const contacts: Contact[] = this.contacts.filter((contact: Contact) => contact.contactId !== contactId);
		this.contacts = contacts;
	}
	
 	setProfile(contactId: string, profile: Profile): any {
		_stdout(INFO || DEBUG, `setSession ${contactId}`);
		const contact: any = this.contacts.find((contact: Contact) => contact.contactId === contactId);
		if (contact !== undefined) {
			contact.profile = profile;
			_stdout_log(DEBUG, contact.profile);
			return contact.profile;
		}
		else {
			_stdout(INFO || DEBUG, `setProfile error`);
			return {};
		}
	}
	
	getProfile(contactId: string): any {
		_stdout(INFO || DEBUG, `getSession ${contactId}`);
		const contact: any = this.contacts.find((contact: Contact) => contact.contactId === contactId);
		if (contact !== undefined) {
			_stdout_log(DEBUG, contact.profile);
			return contact.profile;
		}
		else {
			_stdout(INFO || DEBUG, `getProfile error`);
			return {};
		}
	}
	
 	setSession(contactId: string, session: any): any {
		_stdout(INFO || DEBUG, `setSession ${contactId}`);
		const contact: any = this.contacts.find((contact: Contact) => contact.contactId === contactId);
		if (contact !== undefined) {
			contact.digitalChannel.session = session;
			_stdout_log(DEBUG, contact.digitalChannel.session);
			return contact.digitalChannel.session;
		}
		else {
			_stdout(INFO || DEBUG, `setSession error`);
			return {};
		}
	}
	
	getSession(contactId: string): any {
		_stdout(INFO || DEBUG, `getSession ${contactId}`);
		const contact: any = this.contacts.find((contact: Contact) => contact.contactId === contactId);
		if (contact !== undefined && contact.digitalChannel.session !== undefined) {
			_stdout_log(DEBUG, contact.digitalChannel.session);
			return contact.digitalChannel.session;
		}
		else {
			_stdout(INFO || DEBUG, `getSession error`);
			return {};
		}
	}
		
	setEngagement(contactId: string, engagement: any): any {
		_stdout(INFO || DEBUG, `setEngagement ${contactId}`);
		const contact: any = this.contacts.find((contact: Contact) => contact.contactId === contactId);
		if (contact !== undefined) {
			contact.digitalChannel.engagement = engagement;
			_stdout_log(DEBUG, contact.digitalChannel.engagement);
			return contact.digitalChannel.engagement;
		}
		else {
			_stdout(INFO || DEBUG, `setEngagement error`);
			return {};
		}
	}
	
	getEngagement(contactId: string): any {
		_stdout(INFO || DEBUG, `getEngagegment ${contactId}`);
		const contact: any = this.contacts.find((contact: Contact) => contact.contactId === contactId);
		if (contact !== undefined && contact.digitalChannel.engagement !== undefined) {
			_stdout_log(DEBUG, contact.digitalChannel.engagement);
			return contact.digitalChannel.engagement;
		}
		else {
			_stdout(INFO || DEBUG, `getEngagegment error`);
			return {};
		}
	}
	
	setDigitalChannel(contactId: string, digitalChannel: DigitalChannel): any {
		_stdout(INFO || DEBUG, `setDigitalChannel ${contactId}`);
		const contact: any = this.contacts.find((contact: Contact) => contact.contactId === contactId);
		if (contact !== undefined) {
			contact.digitalChannel = digitalChannel;
			_stdout_log(DEBUG, contact.digitalChannel);
			return contact.digitalChannel;
		}
		else {
			_stdout(INFO || DEBUG, `setDigitalChannel error`);
			return {};
		}
	}
	
	getDigitalChannel(contactId: string): any {
		_stdout(INFO || DEBUG, `getDigitalChannel ${contactId}`);
		const contact: any = this.contacts.find((contact: Contact) => contact.contactId === contactId);
		if (contact !== undefined) {
			_stdout_log(DEBUG, contact.digitalChannel);
			return contact.digitalChannel;
		}
		else {
			_stdout(INFO || DEBUG, `getDigitalChannel error`);
			return {};
		}
	}
	
	appendMessage(contactId: string, message: Message): any {
		_stdout(INFO || DEBUG, `appendMessage ${contactId}`);
		const contact: any = this.contacts.find((contact: Contact) => contact.contactId === contactId);
		if (contact !== undefined) {
			contact.messages.push(message); 
			_stdout_log(DEBUG, contact.messages[contact.messages.length - 1]);
			return contact.messages[contact.messages.length - 1];
		}
		else {
			_stdout(INFO || DEBUG, `appendMessage error`);
			return {};
		}
	}

	setSummary(contactId: string, summary: string): any {
		_stdout(INFO || DEBUG, `setSummary ${contactId}`);
		const contact: any = this.contacts.find((contact: Contact) => contact.contactId === contactId);
		if (contact !== undefined) {
			contact.summary = summary;
			_stdout_log(DEBUG, contact.digitalChannel);
			return contact.summary;
		}
		else {
			_stdout(INFO || DEBUG, `setSummary error`);
			return {};
		}
	}
	
	getSummary(contactId: string): string {
		_stdout(INFO || DEBUG, `getSummary ${contactId}`);
		const contact: any = this.contacts.find((contact: Contact) => contact.contactId === contactId);
		if (contact !== undefined) {
			_stdout_log(DEBUG, contact.summary);
			return contact.summary;
		}
		else {
			_stdout(INFO || DEBUG, `getSummary error`);
			return "";
		}
	}
}
