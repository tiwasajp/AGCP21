/**
 * TODO(developer): Uncomment these variables before running the sample.
 */

// Imports the Google Cloud client library
//import { SpeechTranscription } from '@google-cloud/speech';
import SpeechTranscription from "@google-cloud/speech";

import fs from 'fs';

import { _stdout, _stdout_log, _stdout_table } from "../lib/stdout.js";
const INFO: boolean = true;
const DEBUG: boolean = false;


export class Speech8k {
	private transcriptionClient: any = null;

	constructor() {
		this.transcriptionClient = new SpeechTranscription.SpeechClient();
	}
	
	async transcription_gs(fileName: string, languageCode: string) {
		// The audio file's encoding, sample rate in hertz, and BCP-47 language code
		const audio = {
			uri: fileName,
		};
		
		const config = {
			encoding: 'MULAW',
			sampleRateHertz: 8000,
			languageCode: languageCode, //'ja-JP' 'en_US',
			enableWordConfidence: true,
			enableAutomaticPunctuation: true,
		};
	
		const request = {
			audio: audio,
			config: config,
			model: 'phone_call',
		};

		// Detects speech in the audio file
		const [response] = await this.transcriptionClient.recognize(request)

		_stdout_log(DEBUG, response);

		const transcription = response.results
			.map((result: any) => result.alternatives[0].transcript)
			.join('\n');

		let katakana = '';
		let confidence = '';
		
		response.results[0].alternatives[0].words.forEach((word: any) => {
			katakana += `${word.word.split('|')[1]} `;
			katakana = katakana.replace(/undefined/g, '').replace(/,/g, '|').replace(/ +/g, ' ');
			confidence += `${word.word.split('|')[2]},`;
		});

		return { transcription: transcription, katakana: katakana, confidence: confidence };
	}

	async transcription(fileName: string, languageCode: string) {
		// Reads a local audio file and converts it to base64
		const file = fs.readFileSync(fileName);
		const audioBytes = file.toString('base64');

		// The audio file's encoding, sample rate in hertz, and BCP-47 language code
		const audio = {
			content: audioBytes,
		};
		
		const config = {
			encoding: 'MULAW',
			sampleRateHertz: 8000,
			languageCode: languageCode, //'ja-JP' 'en_US',
		};
		
		const request = {
			audio: audio,
			config: config,
			model: 'phone_call',
		};

		// Detects speech in the audio file
		const [response] = await this.transcriptionClient.recognize(request)

		_stdout_log(DEBUG, response);

		const transcription = response.results
			.map((result: any) => result.alternatives[0].transcript)
			.join('\n');

		_stdout_log(DEBUG, response.results[0].alternatives);
	
		return transcription;
	}

	async transcription_base64(audioBytes: string, languageCode: string) {
		// The audio file's encoding, sample rate in hertz, and BCP-47 language code
		const audio = {
			content: audioBytes,
		};
		
		const config = {
			encoding: 'MULAW',
			sampleRateHertz: 8000,
			languageCode: languageCode,
			model: 'phone_call',
		};
		
		const request = {
			audio: audio,
			config: config,
		};

		// Detects speech in the audio file
		const [response] = await this.transcriptionClient.recognize(request);
		const transcription = response.results
			.map((result: any) => result.alternatives[0].transcript)
			.join('\n');
		_stdout(DEBUG, `Transcription: ${transcription}`);

		return transcription;
	}	
}


