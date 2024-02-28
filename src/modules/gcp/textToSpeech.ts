// Imports the Google Cloud client library
import tts from '@google-cloud/text-to-speech';

// Import other required libraries
import fs from 'fs';
//import util from 'util';

import { _stdout, _stdout_log, _stdout_table } from "../lib/stdout.js";
const INFO: boolean = true;
const DEBUG: boolean = true;

export class TextToSpeech {
	private client: any = null;
	
	constructor() {
		this.client = new tts.TextToSpeechClient();
	}
	
	async generateSpeechAudio(text: string, languageCode: string, name: string, ssmlGender: string, audioEncoding: string, path: string, file: string) {
		// Construct the request
		const request: any = {
			input: { text: text },
			// Select the language and SSML voice gender (optional)
			voice: { languageCode: languageCode, name: name, ssmlGender: ssmlGender },
			// select the type of audio encoding
			audioConfig: { audioEncoding: audioEncoding },
		};
		_stdout_log(DEBUG, request); 
		
		// Performs the text-to-speech request
		await this.client.synthesizeSpeech(request).then(async ([response]: any) => {
			//const writeFile = util.promisify(fs.writeFile);
			//await writeFile(filePath, response.audioContent, 'binary');
			fs.writeFileSync(`${path}/${file}`, response.audioContent, 'binary');
			_stdout(DEBUG, `Audio content written to file: ${path}/${file}`);
		});
		return { result: 'ok', file: file };
	}
}
