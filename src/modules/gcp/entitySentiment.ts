// Imports the Google Cloud client library
import language from '@google-cloud/language';

import { _stdout, _stdout_log, _stdout_table } from "../lib/stdout.js";
const INFO: boolean = true;
const DEBUG: boolean = false;

export class EntitySentiment {
	private client: any = null;
	
	constructor() {
	this.client = new language.LanguageServiceClient();
}

async getEntitySentiment(text: string) {
		// Prepares a document, representing the provided text
	const document = {
	content: text,
	type: 'PLAIN_TEXT',
	};

	try {
			// Detects sentiment of entities in the document
		const [result] = await this.client.analyzeEntitySentiment({ document });
		const entities = result.entities;

		_stdout(DEBUG, "Entities and sentiments:");
		_stdout(DEBUG, JSON.stringify(entities));

		entities.forEach((entity: any) => {
			_stdout(DEBUG, ` Name: ${entity.name}`);
			_stdout(DEBUG, ` Type: ${entity.type}`);
			_stdout(DEBUG, ` Score: ${entity.sentiment.score}`);
			_stdout(DEBUG, ` Magnitude: ${entity.sentiment.magnitude}`);
		});

		return result.entities;
	}
	catch (e: any) {
		return [];
	}
}

}
