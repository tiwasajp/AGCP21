/* 
* restAPI.js
* 2017-2022, Tomohiro Iwasa
* This code is licensed under the MIT License
*/

import https from "https";
import http from "http";
//import queryString from "querystring";

import { _stdout, _stdout_log, _stdout_table, _stderror } from "./stdout.js";
const DEBUG = true;

export function restAPI(url: any, options: any) {                                                                                                
	return new Promise((resolve: any, reject: any) => {
		_stdout(DEBUG, `restAPI url ${url}`);
		_stdout(DEBUG, `restAPI options ${JSON.stringify(options)}`);
		const body = options.body || null;
		if (options.body) {
			delete options.body;
		}
		const timeout = options.timeout || null;
		if (options.timeout) {
			delete options.timeout;
		}
		try {
			const req = (url.startsWith('https:') ? https : http).request(url, options, (resp) => {
				_stdout(DEBUG, `restAPI headers: ${JSON.stringify(resp.headers)}`);
				_stdout(DEBUG, `restAPI statusCode: ${resp.statusCode}`);
				resp.setEncoding('utf-8');
				let data = "";
				resp.on('data', (chunk: any) => {
					_stdout(DEBUG, `restAPI chunk ${chunk}`);
					data += chunk;
				})
					.on('end', () => {
						_stdout(DEBUG, `restAPI data ${data}`);
						if (data) {
							resolve(JSON.parse(data));
						}
						else {
							_stdout(DEBUG, `restAPI empty data`);
							resolve(null);
						}
					});
			})
				.on('error', (error: any) => {
					_stderror(DEBUG, `restAPI error ${JSON.stringify(error)}`);
					reject({ error: error });
				})
				.on('timeout', () => {
					req.abort();
					_stderror(DEBUG, "restAPI Request Timeout");
					reject({ error: "timeout" });
				});
			if (timeout) {
				req.setTimeout(timeout);
			}
			if (body) {
				if (!options.json) {
					//req.write(queryString.stringify(body));
					req.write(body);
				}
				else {
					req.write(JSON.stringify(body));
				}
			}
			req.end();
		}
		catch (error: any) {
			_stderror(DEBUG, `restAPI error ${JSON.stringify(error)}`);
			reject({ error: error });
		}
	});
}
