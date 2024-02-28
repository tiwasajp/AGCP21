/**
* TODO(developer): Uncomment these variables before running the sample.
*/

import { TranslationServiceClient } from '@google-cloud/translate';

import { _stdout, _stdout_log, _stdout_table } from "../lib/stdout.js";
const INFO: boolean = true;
const DEBUG: boolean = false;

export class Translate {
	private projectId: string = '';
	private location: string = '';
	private translationClient: any = null;
	
	constructor(p: string, l: string) {
		this.projectId = p;
		this.location = l;
		this.translationClient = new TranslationServiceClient();
	}
	
	async translateText(text: string, sourceLanguageCode: string, targetLanguageCode: string) {
		const request = {
		parent: `projects/${this.projectId}/locations/${this.location}`,
		contents: [text],
		mimeType: 'text/plain', // mime types: text/plain, text/html
		sourceLanguageCode: sourceLanguageCode,
		targetLanguageCode: targetLanguageCode
		};
	  
		const [response] = await this.translationClient.translateText(request);

		for (const translation of response.translations) {
			_stdout(DEBUG, "Translation:" + translation.translatedText);
		}

		return response.translations;
	}
}
