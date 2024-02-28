//
// Language AI
//

import { restAPI } from "../lib/restAPI.js";
const RESTAPI_TIMEOUT = 30000;

import { _stdout, _stdout_log, _stdout_table } from "../lib/stdout.js";
const INFO: boolean = true;
const DEBUG: boolean = true;

export class PaLM2 {
	private APIEndpoint: string = ''; // "us-central1-aiplatform.googleapis.com"
	private modelName: string = '';
	private projectId: string = ''; // "avayademojp"
	private location: string = ''; // "us-central1"
	private model_id: string = '';
	private parameters: any = {};
	private access_key: any = { token: "", expires_in: 0, got_at: 0 };

	constructor(config: any) {
		// Instantiates a client
		this.APIEndpoint = config.url;
		this.modelName = config.name;
		this.projectId = config.projectId;
		this.location = config.location;
		this.parameters = config.params;
		this.model_id = config.model;
		this.access_key = { token: "", expires_in: 0, got_at: 0 };
	}

	getToken() {
		return new Promise(async (resolve: any, reject: any) => {
			const access_key_url = `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token`;
			let elapsed_time = Math.round(((new Date()).getTime() - (new Date(this.access_key.got_at)).getTime()) / 1000);
			if (this.access_key.token && elapsed_time < this.access_key.expires_in) {
				_stdout(DEBUG, `getToken Valid token found elapsed_time:${elapsed_time}s expires_in:${this.access_key.expires_in}s`);
				resolve(true);
			}
			else {
				try {
					await restAPI(
						access_key_url,
						{
							method: "GET",
							headers: {
								"Metadata-Flavor": "Google",
								"Content-Type": "application/json",
							},
							json: true,
							timeout: RESTAPI_TIMEOUT,
						}
					).then((resp: any) => {
						console.log(resp);
						if (!resp.access_token) {
							_stdout(INFO || DEBUG, `getToken failed get token`);
							reject(true);
						}
						this.access_key.token = resp.access_token;
						this.access_key.expires_in = resp.expires_in;
						this.access_key.got_at = new Date();
						//_stdout(DEBUG, `getToken access_token:${this.token.access_token} got_at:${this.token.got_at}`);
						_stdout(DEBUG, `getToken access_token got_at:${this.access_key.got_at}`);
						_stdout(DEBUG, `getToken access_token access_token:${this.access_key.token}`);
						resolve(this.access_key.token);
					}).catch((error: any) => {
						_stdout(INFO || DEBUG, `getToken catch ${JSON.stringify(error)}`);
						reject(false);
					});
				}
				catch (error: any) {
					_stdout(INFO || DEBUG, `getToken ${JSON.stringify(error)}`);
					reject(false);
				}
			}
		});
	}

	async generate(queryText: string) {
		_stdout(INFO || DEBUG, `PaLM2.generate() ${queryText}`);
		//const access_key = execSync('gcloud auth print-access-token').toString().replace(/\n/g, '');
		if (!await this.getToken()) {
			return [{
				modelName: this.modelName, resultText: "",
				attributes: {}
			}];
		}
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
				"Authorization": `Bearer ${this.access_key.token}`,
				"Content-Type": "application/json",
			},
			timeout: RESTAPI_TIMEOUT,
			json: true,
			body: data,
		};
		const url = `https://${this.APIEndpoint}/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${this.model_id}:predict`;
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
