/*
const agentId = '3b1a8527-01be-4d31-a227-b5293db11d30';
const query = '今日の東京は晴れです';
const languageCode = 'ja'
*/

// Imports the Google Cloud Some API library
import { SessionsClient } from '@google-cloud/dialogflow-cx';

import { _stdout, _stdout_log, _stdout_table } from "../lib/stdout.js";
const INFO: boolean = true;
const DEBUG: boolean = false;

export class DetectIntent {
	private projectId: string = '';
	private location:string = '';
	private client:any = null;
	
	constructor(projectId: string, location: string) {
		this.projectId = projectId;
		this.location = location;
		this.client = new SessionsClient({ apiEndpoint: `${this.location}-dialogflow.googleapis.com` });
	}
		
	async detectIntentText(agentId: string, sessionId: string, query: string, languageCode: string) {
		//const sessionId = Math.random().toString(36).substring(7);
		const sessionPath: any = this.client.projectLocationAgentSessionPath(
		this.projectId,
		this.location,
		agentId,
		sessionId
		);
	
		const request: any = {
		session: sessionPath,
		queryInput: {
		text: {
		text: query,
		},
		languageCode,
		},
		};
		
		const [response]: any = await this.client.detectIntent(request);
		for (const message of response.queryResult.responseMessages) {
			if (message.text) {
				_stdout(DEBUG, `Agent Response: ${message.text.text}`);
			}
		}
		if (response.queryResult.match.intent) {
			_stdout(DEBUG, `Matched Intent: ${response.queryResult.match.intent.displayName}`);
		}
		_stdout(DEBUG, `Current Page: ${response.queryResult.currentPage.displayName}`);

		return response;
	}
}
 


