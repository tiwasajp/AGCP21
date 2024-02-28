import { _stdout, _stdout_log, _stdout_table } from "../lib/stdout.js";
const INFO: boolean = true;
const DEBUG: boolean = false;

import { DocumentServiceClient } from '@google-cloud/discoveryengine';

// Instantiates a client
const client: any = new DocumentServiceClient();

export class Recommend {
	// Instantiates a client
	private client: any = null;
	
	private projectId: string = ''; // '817176915976'
	private location: string = '';  // Options: 'global'
	private collectionId: string = ''; // Options: 'default_collection'
	private searchEngineId: string = ''; //'data-1_1693902847424' // Create in Cloud Console
	private servingConfigId: string = ''; // Options: 'default_config'

	constructor(projectId: string, location: string, collectionId: string, searchEngineId: string, servingConfigId: string) {
		// Instantiates a client
		this.client = new DocumentServiceClient();
		this.projectId = projectId;
		this.location = location;
		this.collectionId = collectionId;
		this.searchEngineId = searchEngineId;
		this.servingConfigId = servingConfigId;
	}

	async search(searchQuery: string) {
		_stdout(DEBUG, `Input:\n${searchQuery}`);
		
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
			query: searchQuery,
			servingConfig: name,
		};
		
		 const IResponseParams: any = {
				    ISearchResult: 0,
				    ISearchRequest: 1,
				    ISearchResponse: 2,
				  };

		// Perform search request
		const response: any = await client.search(request, {
		    autoPaginate: false,
		    validateOnly: true,
		});
		
		const results: any = response[IResponseParams.ISearchResponse].results;

		for (const result of results) {
			if (result) {
				console.log(result);
				//_stdout(INFO || DEBUG, result[0].document.derivedStructData.fields.extractive_answers.listValue.values[0].structValue.fields.content.stringValue);
				//return {model:this.searchEngineId, text:result[0].document.derivedStructData.fields.extractive_answers.listValue.values[0].structValue.fields.content.stringValue};
				return {model: "", text: ""};
			}
		}
		
		return {model: "", text: ""};
	}
}
