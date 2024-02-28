//
// Language AI
//

import { execSync } from "child_process";
import { restAPI } from "../lib/restAPI.js";
const RESTAPI_TIMEOUT = 30000;

import { _stdout, _stdout_log, _stdout_table } from "../lib/stdout.js";
const INFO: boolean = false;
const DEBUG: boolean = true;

export class LangAI {
	private access_key: string = '';
	private APIEndpoint: string = ''; // "us-central1-aiplatform.googleapis.com"
	private modelName: string = '';
	private projectId: string = ''; // "avayademojp"
	private location: string = ''; // "us-central1"
	private model_id: string = '';
	private parameters: any = {};

	constructor(modelName: string, APIEndpoint: string, projectId: string, location: string, model_id: string, parameters: any) {
		// Instantiates a client
		this.access_key = '';
		this.APIEndpoint = APIEndpoint;
		this.modelName = modelName;
		this.projectId = projectId;
		this.location = location;
		this.parameters = parameters;
		this.model_id = model_id;
	}

	async generate(queryText: string) {
		_stdout(INFO || DEBUG, `LangAI.generate() ${queryText}`);
		this.access_key = execSync('gcloud auth print-access-token').toString().replace(/\n/g, '');
		const url = `https://${this.APIEndpoint}/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${this.model_id}:predict`;
		var data = {
			"instances": [
				{
					"content": queryText
				}
			],
			"parameters": this.parameters
		}
		const options = {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${this.access_key}`,
				"Content-Type": "application/json",
			},
			timeout: RESTAPI_TIMEOUT,
			json: true,
			body: data,
		};
		return await restAPI(url, options).then((resp: any) => {
			_stdout(INFO || DEBUG, `content: ${resp.predictions[0].content.replace(/\n/g, '')}`);
			_stdout(DEBUG, `safetyAttributes: ${JSON.stringify(resp.predictions[0].safetyAttributes)}`);
			_stdout(DEBUG, `citationMetadata: ${JSON.stringify(resp.predictions[0].citationMetadata)}`);
			_stdout(DEBUG, `outputTokenCount: ${JSON.stringify(resp.metadata.tokenMetadata.outputTokenCount)}`);
			_stdout(DEBUG, `inputTokenCount: ${JSON.stringify(resp.metadata.tokenMetadata.inputTokenCount)}`);
			resp.predictions[0].safetyAttributes.categories.forEach((elem: any, idx: number) => {
				_stdout(DEBUG, `${elem}(${resp.predictions[0].safetyAttributes.scores[idx]})`);
			});
			return [{
				modelName: this.modelName, resultText: resp.predictions[0].content.replace(/\n/g, ''),
				attributes: { categories: resp.predictions[0].safetyAttributes.categories, 
								scores: resp.predictions[0].safetyAttributes.scores }
			}];
		});
	}
}
