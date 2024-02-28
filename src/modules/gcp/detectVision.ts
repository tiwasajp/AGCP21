// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

process.on('unhandledRejection', console.dir);

import vision from '@google-cloud/vision';
import fs from 'fs';

import { _stdout, _stdout_log, _stdout_table } from "../lib/stdout.js";
const INFO: boolean = true;
const DEBUG: boolean = false;

export class DetectVision {
	async detectFaces(filePathName: string) {
		// [START vision_face_detection]
		// Imports the Google Cloud client library
		////import vision from '@google-cloud/vision';

		// Creates a client
		const client = new vision.ImageAnnotatorClient();

		/**
		* TODO(developer): Uncomment the following line before running the sample.
		*/
		// const fileName = 'Local image file, e.g. /path/to/image.png';

		const [result] = await client.faceDetection(filePathName);
		const faces: any = result.faceAnnotations;
		_stdout(DEBUG, "Detect Faces: " + filePathName);
		_stdout(DEBUG, JSON.stringify(faces));
		faces.forEach((face: any, i: number) => {
			//_stdout(DEBUG, `  Face #${i + 1}:`);
			//_stdout(DEBUG, `    Joy: ${face.joyLikelihood}`);
			//_stdout(DEBUG, `    Anger: ${face.angerLikelihood}`);
			//_stdout(DEBUG, `    Sorrow: ${face.sorrowLikelihood}`);
			//_stdout(DEBUG, `    Surprise: ${face.surpriseLikelihood}`);
		});
		return faces;
		// [END vision_face_detection]
	}

	async detectLabels(filePathName: string) {
		// [START vision_label_detection]
		// Imports the Google Cloud client library
		//import vision from '@google-cloud/vision';

		// Creates a client
		const client = new vision.ImageAnnotatorClient();

		/**
		* TODO(developer): Uncomment the following line before running the sample.
		*/
		// const fileName = 'Local image file, e.g. /path/to/image.png';

		// Performs label detection on the local file
		const [result] = await client.labelDetection(filePathName);
		const labels: any = result.labelAnnotations;
		_stdout(DEBUG, "Detect Labels: " + filePathName);
		_stdout(DEBUG, JSON.stringify(labels));
		labels.forEach((label: any) => {
			//_stdout(DEBUG, label.description);
		});
		return labels;
		// [END vision_label_detection]
	}

	async detectLandmarks(filePathName: string) {
		// [START vision_landmark_detection]
		//import vision from '@google-cloud/vision';

		// Creates a client
		const client = new vision.ImageAnnotatorClient();

		/**
		* TODO(developer): Uncomment the following line before running the sample.
		*/
		// const fileName = 'Local image file, e.g. /path/to/image.png';

		// Performs landmark detection on the local file
		const [result] = await client.landmarkDetection(filePathName);
		const landmarks: any = result.landmarkAnnotations;
		_stdout(DEBUG, "Landmarks:" + filePathName);
		//_stdout(DEBUG, JSON.stringify(landmarks));
		//landmarks.forEach(landmark => _stdout(DEBUG, landmark));
		return landmarks;
		// [END vision_landmark_detection]
	}
	
	async detectText(fileName: string) {
		// [START vision_text_detection]
		//import vision from '@google-cloud/vision';

		// Creates a client
		const client = new vision.ImageAnnotatorClient();

		/**
		* TODO(developer): Uncomment the following line before running the sample.
		*/
		// const fileName = 'Local image file, e.g. /path/to/image.png';

		// Performs text detection on the local file
		const [result] = await client.textDetection(fileName);
		const detections: any = result.textAnnotations;
		_stdout(DEBUG, 'Text:');
		detections.forEach((text: any) => _stdout(DEBUG, text));
		// [END vision_text_detection]
	}

	async detectLogos(filePathName: string) {
		// [START vision_logo_detection]
		//import vision from '@google-cloud/vision';

		// Creates a client
		const client = new vision.ImageAnnotatorClient();

		/**
		* TODO(developer): Uncomment the following line before running the sample.
		*/
		// const fileName = 'Local image file, e.g. /path/to/image.png';

		// Performs logo detection on the local file
		const [result] = await client.logoDetection(filePathName);
		const logos: any = result.logoAnnotations;
		_stdout(DEBUG, "Detect Logos: " + filePathName);
		_stdout(DEBUG, JSON.stringify(logos));
		var logotexts: string = "";
		logos.forEach((logo: any) => {
			//_stdout(DEBUG, logo);
		});
		return logos;
		// [END vision_logo_detection]
	}
	
	async detectFulltext(filePathName: string) {
		// [START vision_fulltext_detection]

		// Imports the Google Cloud client library
		//import vision from '@google-cloud/vision';

		// Creates a client
		const client = new vision.ImageAnnotatorClient();

		/**
		* TODO(developer): Uncomment the following line before running the sample.
		*/
		// const fileName = 'Local image file, e.g. /path/to/image.png';

		// Read a local image as a text document
		const [result] = await client.documentTextDetection(filePathName);
		const fullTextAnnotation: any = result.fullTextAnnotation;
		// _stdout(DEBUG, `Full text: ${fullTextAnnotation.text}`);
		// _stdout(DEBUG, JSON.stringify(fullTextAnnotation));
		_stdout(DEBUG, "Detect Fulltext: " + filePathName);
		if (fullTextAnnotation !== null) {
			_stdout(DEBUG, JSON.stringify(fullTextAnnotation.pages));
			fullTextAnnotation.pages.forEach((page: any) => {
				page.blocks.forEach((block: any) => {
					// _stdout(DEBUG, `Block confidence: ${block.confidence}`);
					block.paragraphs.forEach((paragraph: any) => {
						// _stdout(DEBUG, `Paragraph confidence:
						// ${paragraph.confidence}`);
						paragraph.words.forEach((word: any) => {
							const wordText = word.symbols.map((s: any) => s.text).join('');
							// _stdout(DEBUG, `Word text: ${wordText}`);
							// _stdout(DEBUG, `Word confidence: ${word.confidence}`);
							word.symbols.forEach((symbol: any) => {
								// _stdout(DEBUG, `Symbol text: ${symbol.text}`);
								// _stdout(DEBUG, `Symbol confidence: ${symbol.confidence}`);
							});
						}
						);
					}
					);
				}
				);
			}
			);
			return [{ "text": fullTextAnnotation.text }];
		}
		else {
			return [];
		}
		// [END vision_fulltext_detection]
	}
}
