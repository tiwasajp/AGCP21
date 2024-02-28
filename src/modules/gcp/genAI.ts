import { _stdout, _stdout_log, _stdout_table } from "../lib/stdout.js";
const INFO: boolean = false;
const DEBUG: boolean = true;

import { SearchServiceClient } from '@google-cloud/discoveryengine';

// Instantiates a client
const client: any = new SearchServiceClient();

export class GenAI {
	// Instantiates a client
	private client: any = null;

	private modelName: string = '';
	private projectId: string = ''; // '817176915976'
	private location: string = '';  // Options: 'global'
	private collectionId: string = ''; // Options: 'default_collection'
	private searchEngineId: string = ''; //'data-1_1693902847424' // Create in Cloud Console
	private servingConfigId: string = ''; // Options: 'default_config'
	
	constructor(model: any) {
		// Instantiates a client
		this.client = new SearchServiceClient();
		this.modelName = model.name;
		this.projectId = model.projectId;
		this.location = model.location;
		this.collectionId = model.collection;
		this.searchEngineId = model.id;
		this.servingConfigId = model.config;
	}

	async generate(queryText: string) {
		_stdout(INFO || DEBUG, `GenAI.generate() searchQuery:${queryText}`);

		// The full resource name of the search engine serving configuration.
		// Example: projects/{projectId}/locations/{location}/collections/{collectionId}/dataStores/{searchEngineId}/servingConfigs/{servingConfigId}
		// You must create a search engine in the Cloud Console first.
		const name: any = this.client.projectLocationCollectionDataStoreServingConfigPath(
			this.projectId,
			this.location,
			this.collectionId,
			this.searchEngineId,
			this.servingConfigId
		);

		const request: any = {
			pageSize: 1,
			query: queryText,
			servingConfig: name,
		};

		// Perform search request
		const response: any = await client.search(request);
		var resp_results: any = []
		for (const results of response) {
			if (results) {
				results.forEach((result: any) => {
					_stdout_log(INFO || DEBUG, result.document.derivedStructData.fields.extractive_answers.listValue.values[0].structValue.fields);
					_stdout_log(DEBUG, result.document.derivedStructData.fields.link.stringValue);
					resp_results.push({
						modelName: this.modelName,
						resultText: result.document.derivedStructData.fields.extractive_answers.listValue.values[0].structValue.fields.content.stringValue,
						attributes: { reference: result.document.derivedStructData.fields.link.stringValue }
					});
				});
			}
		}

		return resp_results;
	}
}


