//
// Contact Center AI Web App Server
// Tomohiro Iwasa, tiwasa@avaya.com, 2022-2024
// Demo and reference purposes only
//
import http from "http";
import fs from "fs";
import { Server, Socket } from "socket.io";
import express, { Application, Request, Response } from "express";
import { fileURLToPath } from "url";
import { Buffer } from "buffer";
import crypto from "crypto";

const WORKDIR: string = fileURLToPath(import.meta.url).replace("/src/server.ts", "");
const FQDN: string = "demo.avayaphone.net";
const PORT: number = 80;

const sleep: any = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));
import { _stdout, _stdout_log, _stdout_table, _stderror } from "./modules/lib/stdout";
const INFO: boolean = true;
const DEBUG: boolean = true;

const app: Application = express();
app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.set("port", PORT);
app.set("view engine", "ejs");
app.set("trust proxy", true);

const defaultAgentId: string = "20001";
const monitorClientId: string = "93021";

// GKE health check
app.get("/", (req: express.Request, resp: express.Response) => {
	//_stdout(INFO || DEBUG, `/GKE health check`);
	return resp.sendStatus(200);
});

var settings: any = {
	projectId: "avayademojp", location: "asia-northeast1", agentId: "ba046aca-84c0-471c-bf2c-dee1da883c79", languageCode: "ja", useDialogflow: false,
	transLangCode: "en", useTranslation: false,
	llm: {
		conditions: [
		 			{ intent: "CardDeclined", match: "リジェクト|使えない", prompt: "お客様担当のエージェントへ転送いたします。" },
		 		],
		PaLM2: {name: "Google PaLM2", url: "us-central1-aiplatform.googleapis.com", projectId: "avayademojp", location: "us-central1",
				model: "text-bison@001", params: { candidateCount: 1, maxOutputTokens: 512, temperature: 0.2, topP: 0.8, topK: 40 },
				prompts: { summarize3: "3行で要約" , summarize5: "チャットを5行で要約", } },
		Gemini: {name: "Google Gemini", url: "us-central1-aiplatform.googleapis.com", projectId: "avayademojp", location: "us-central1",
				model: "gemini-pro:streamGenerateContent", params: { candidateCount: 1, maxOutputTokens: 512, temperature: 0.2, topP: 0.8, topK: 40 },
				prompts: { summarize3: "3行で要約" , summarize5: "チャットを5行で要約", }, useGemini: false },
		GeminiVison: {name: "Google Gemini", url: "us-central1-aiplatform.googleapis.com", projectId: "avayademojp", location: "us-central1",
				model: "gemini-1.0-pro-vision:streamGenerateContent", params: { candidateCount: 1, maxOutputTokens: 512, temperature: 0.2, topP: 0.8, topK: 40 },
				prompts: { summarize3: "3行で要約" , summarize5: "チャットを5行で要約", }, useGeminiVision: true },
		models: [ 
				{ intent: "", match: "約款", name: "金融取引における約款等をめぐる法的諸問題", projectId: "817176915976", location: "global", collection: "default_collection", id: "financial-transaction-1_1703202989750", config: "default_config"},
				{ intent: "", match: "飛騨|朴葉|牛", name: "飛騨の名産品", projectId: "817176915976", location: "global", collection: "default_collection", id: "hida-recommends-1_1703202913808", config: "default_config"},
		],
	},
};

import { PaLM2 } from "./modules/gcp/palm2";
const palm2 = new PaLM2(settings.llm.PaLM2);  

import { Gemini } from "./modules/gcp/gemini";
const genimi = new Gemini(settings.llm.Gemini);  

import { GenAI } from "./modules/gcp/genAI";
let genai_models: any[] = [];
settings.llm.models.forEach((model: any) => {
	genai_models.push({model: new GenAI(model), config: model});	
	_stdout_log(DEBUG, model);
});

app.post("/postSettings", (req: express.Request, resp: express.Response) => {
	resp.send({ resp: "200" }).end();
	settings = JSON.parse(Buffer.from(req.body.data, "base64").toString());
	_stdout(INFO || DEBUG, `/postSettings success ${req.query['key']} ${JSON.stringify(settings)}`);
	genai_models = [];
	settings.llm.models.forEach((model: any) => {
		genai_models.push({model: new GenAI(model), config: model});	
		_stdout_log(DEBUG, model);
	});
});

app.get("/getSettings", (req: express.Request, resp: express.Response) => {
	resp.send({ "data": Buffer.from(JSON.stringify(settings)).toString('base64') }).end();
	_stdout(INFO || DEBUG, `/getSettings success ${req.query['key']} ${JSON.stringify(settings)}`);
});

interface QueryAttr {
	categories?: string[];
	scores?: string[];
	reference?: string;
}

interface QueryResults {
	queryModelName: string;
	queriedText: string;
	summarizeModelName: string;
	summarizedText: string;
	attributes: QueryAttr;
}

interface GenAIContext {
	funcGenAI: any;
	queryText: string;
	queryResults: QueryResults[];
};

function queryGenAI(queryText: string): Promise<GenAIContext>  {
	return new Promise(async (resolve: any, reject: any) => {
		_stdout(DEBUG, `queryGenAI queryText ${queryText}`);
		var context: GenAIContext = {
			funcGenAI: null,
			queryText: "",
			queryResults: [{
				queryModelName: "", queriedText: "", summarizeModelName: "", summarizedText: "",
				attributes: { reference: "", categories: [], scores: [] }
			}],
		};
		try {
			context.queryText = queryText;
			context.funcGenAI = (settings.llm.Gemini.useGemini ? genimi : palm2);
			genai_models.every((genai: any) => {
				if (genai.config.intent) {
					return false;
				}
				else {
					const regExp: any  = new RegExp(genai.config.match, 'g');
					if (regExp.test(context.queryText)) {
						context.funcGenAI = genai.model;
						_stdout(DEBUG, `Model selected: ${genai.config.name} ${genai.config.match} regExp.test:${regExp.test(context.queryText)}`);
						return false;
					}
					return true;
				}
			});
			
			if (context.funcGenAI) {
				await context.funcGenAI.generate(context.queryText).then(async (results: any) => {
					_stdout(DEBUG, `queryGenAI generate() ${JSON.stringify(results)}`);
					context.queryResults[0].queryModelName = results[0].modelName;
					context.queryResults[0].queriedText = results[0].resultText;
					_stdout(DEBUG, `queryGenAI for ${0} ${JSON.stringify(context.queryResults[0])}`);
					for (const [i, result] of results.entries()) {
						context.queryResults[i].queryModelName = result.modelName;
						context.queryResults[i].queriedText = result.resultText;
						_stdout(DEBUG, `queryGenAI for ${i} result:${JSON.stringify(result)}`);
						if ('reference' in result.attributes) {
							context.queryResults[i].attributes.reference = result.attributes.reference;
						}
						if ('categories' in result.attributes) {
							context.queryResults[i].attributes.categories = result.attributes.categories;
							context.queryResults[i].attributes.scores = result.attributes.scores;
						}
						if (context.queryResults[i].queriedText) {
							var promptToSummarize: string = settings.llm.PaLM2.prompts.summarize3;
							if (settings.useTranslation && settings.transLangCode) {
								promptToSummarize = await translate.translateText(promptToSummarize, "ja", settings.transLangCode).then((translations: any) => { return translations[0].translatedText });
							}
							await palm2.generate(`${context.queryResults[i].queriedText} ${promptToSummarize}`).then((results: any) => {
								_stdout(INFO || DEBUG, `queryGenAI 要約：${JSON.stringify(results)}`);
								context.queryResults[i].summarizeModelName = results[0].modelName;
								context.queryResults[i].summarizedText = results[0].resultText;
								if ('categories' in results[0].attributes) {
									context.queryResults[i].attributes.categories = results[0].attributes.categories;
									context.queryResults[i].attributes.scores = results[0].attributes.scores;
								}
							});
						}
					}
					_stdout_log(DEBUG, context);
					resolve(context);
				});
			}
			else {
				context.queryResults[0].queriedText = "ごめんなさい。答えがありません。🙏";
				_stdout(INFO || DEBUG, `queryGenAI resolve(${context.queryResults[0].queriedText})`);
				resolve(context);
			}
		}
		catch (error) {
			_stdout(INFO || DEBUG, `queryGenAI() error ${JSON.stringify(error)}`);
			context.queryResults[0].queriedText = "ごめんなさい。答えることができません。😞";
			reject(context);
		}
	});
}

app.post("/queryGenAI", (req: express.Request, resp: express.Response) => {
	_stdout(INFO || DEBUG, `/genAIQuery  ${req.body.queryString}`);
	try {
		queryGenAI(req.body.queryString).then((context: any) => {
			context.queryResults.forEach(async (result: any) => {
				const messageId: string = Math.random().toString(16).slice(2);
				var html: string = ``;
				if (result.summarizedText) {
					html = `${result.summarizedText} <span style="font-size:15px;color:#aaa;" onclick="$('#${messageId}').show();"> [詳細] </span><span id="${messageId}" class="nodisp" style="color:red">${result.queriedText}<span style="font-size:15px;color:#aaa;" onclick="$('#${messageId}').hide();"> [閉じる]</span></span>`;
				}
				else {
					html = `${result.queriedText}`;
				}
				if (result.attributes.reference) {
					html += `<br/><a href="https://${FQDN}/data/${result.attributes.reference.match(".+/(.+?)([\?#;].*)?$")[1]}" target="_blank" style="font-size:15px;color:#aaa;">[${result.attributes.reference.match(".+/(.+?)([\\?#;].*)?$")[1]}]</a>`;
				}
				_stdout(INFO || DEBUG, `/queryGenAI resp_message ${html}`);
				resp.send({ result: "ok", text: html }).end();
			});
		});
	}
	catch (error) {
		_stdout(INFO || DEBUG, `/queryGenAI error ${JSON.stringify(error)}`);
		resp.send({ result: "error", reason: error }).end();
	}
});

function runGenAI(contactId: string, text: string): Promise<any> {
	return new Promise((resolve: any, reject: any) => {
		try {		
			io.to(contactId).emit("data", {
				header: { contactId: contactId, room: "", type: "bot", mode: "", channel: "", messageId: Math.random().toString(16).slice(2), ticker: (new Date()) },
				body: { media: { type: "dialog", dialog: { messages: [{ type: "wait" } ]} } }
			});
			queryGenAI(text).then((context: any) => {
				context.queryResults.forEach(async (result: any) => {
					io.to(monitorClientId).emit("monitor", { log: `<div style="margin-bottom:5px;font-weight:bold;color:#999;">回答 (${result.queryModelName}):</div><font color=red>${result.queriedText}</font><br/><span style="font-size:14px;color:#aaa;">${JSON.stringify(result.attributes)}</span>` });
					const messageId: string = Math.random().toString(16).slice(2);
					var html: string = ``;
					if (result.summarizedText) {
						if (settings.useTranslation && settings.transLangCode) {
							result.summarizedText = await translate.translateText(result.summarizedText, "ja", settings.transLangCode).then((translations: any) => { return translations[0].translatedText });
						}
						html = `${result.summarizedText} <span style="font-size:15px;color:#aaa;" onclick="$('#${messageId}').show();"> [詳細] </span><span id="${messageId}" class="nodisp" style="color:red">${result.queriedText}<span style="font-size:15px;color:#aaa;" onclick="$('#${messageId}').hide();"> [閉じる]</span></span>`;
					}
					else {
						if (result.queriedText) {
							if (settings.useTranslation && settings.transLangCode) {
								result.queriedText = await translate.translateText(result.queriedText, "ja", settings.transLangCode).then((translations: any) => { return translations[0].translatedText });
							}
							html = `${result.queriedText}`;
						}
						else {
							html = `😃`;
						}
					}
					if (result.attributes.reference) {
						html += `<br/><a href="https://${FQDN}/data/${result.attributes.reference.match(".+/(.+?)([\?#;].*)?$")[1]}" target="_blank" style="font-size:15px;color:#aaa;">[${result.attributes.reference.match(".+/(.+?)([\\?#;].*)?$")[1]}]</a>`;
					}
					else {
						const resp_message: any = {
							header: { contactId: contactId, room: "", type: "bot", mode: "", channel: "", messageId: messageId, ticker: (new Date()) },
							body: { media: { type: "dialog", dialog: { messages: [{ type: "text", text: html }] } } }
						};
						io.to(contactId).emit("data", resp_message);
						cmsp.appendMessage(contactId, resp_message);
					}
					io.to(monitorClientId).emit("monitor", { log: `<div style="margin-bottom:5px;font-weight:bold;color:#999;">要約 (${result.summarizeModelName}):</div><font color=blue>${result.summarizedText}</font>` });
					await translate.translateText(result.summarizedText, "ja", "en").then((translations: any) => { 
						io.to(monitorClientId).emit("monitor", { log: `<div style="margin-bottom:5px;font-weight:bold;color:#999;">要約の翻訳 (Google Natural Language AI):</div><font color=blue>${translations[0].translatedText}</font>` });
					});

					var entities: string = "";
					await entitySentiment.getEntitySentiment(result.summarizedText).then((resp: any) => {
						//_stdout(DEBUG, `entitySentiment ${JSON.stringify(resp)}`);
						resp.forEach((elem: any) => {
							var color: string = "black";
							if (elem.type !== "OTHER") color = "blue";
							if (elem.metadata.wikipedia_url !== undefined) {
								entities += `<font color=${color}><b>${elem.mentions[0].text.content}</b></font> <a href="${elem.metadata.wikipedia_url}" target="_blank">${elem.metadata.wikipedia_url}</a> `;
								_stdout(INFO || DEBUG, `entitySentiment ${elem.mentions[0].text.content} ${elem.type} ${elem.metadata.wikipedia_url}`);
							}
							else {
								entities += `<font color=${color}><b>${elem.mentions[0].text.content}</b></font> `;
								_stdout(INFO || DEBUG, `entitySentiment ${elem.mentions[0].text.content}　${elem.type}`);
							}
						});
					});
					if (entities) {
						io.to(monitorClientId).emit("monitor", { log: `<div style="margin-bottom:5px;font-weight:bold;color:#999;">分析 (Syntax Analysis):</div>${entities}` });
					}
				});
				resolve(context);
			});
		}
		catch (error) {
			_stdout(INFO || DEBUG, `runGenAI error ${JSON.stringify(error)}`);
			reject(error);
		}
	});
}

import { CMSP } from './modules/cmsp/cmsp';
const cmsp: any = new CMSP();

import { DetectIntent } from "./modules/gcp/detectIntent";
const detectIntent = new DetectIntent(settings.projectId, settings.location);
import { Translate } from "./modules/gcp/translate";
const translate = new Translate(settings.projectId, "global");
import { TextToSpeech } from "./modules/gcp/textToSpeech";
const textToSpeech = new TextToSpeech();
import { DetectVision } from "./modules/gcp/detectVision";
const detectVision = new DetectVision();
import { EntitySentiment } from "./modules/gcp/entitySentiment";
const entitySentiment = new EntitySentiment();

const server: http.Server = http.createServer(app);
const io = new Server(server, {
	pingTimeout: 60000,
	pingInterval: 25000
});
server.listen(PORT, () => _stdout(INFO || DEBUG, 'server.listen listening on port ' + PORT));

io.on('connection', async (socket: Socket) => {
	socket.on("connect", () => {
		_stdout(INFO || DEBUG, `connect ${socket.id} Number of clients: ${Array.from(io.sockets.adapter.rooms).length}`);
	});

	socket.on("disconnect", () => {
		_stdout(INFO || DEBUG, `disconnect ${socket.id} Number of clients remained: ${Array.from(io.sockets.adapter.rooms).length}`);
	});

	socket.on('close', () => {
		_stdout(INFO || DEBUG, `closed socket.id: ${socket.id} Number of clients remained: ${Array.from(io.sockets.adapter.rooms).length}`);
	});

	socket.on("session", async (message: any) => {
		_stdout(INFO || DEBUG, `session ${socket.id} ${JSON.stringify(message)}`);
		if (message.action === "join") {
			socket.join(message.contactId);
			io.sockets.emit("session", message);
			_stdout(INFO || DEBUG, `join contactId: ${message.contactId} Number of clients: ${Array.from(io.sockets.adapter.rooms).length}`);
			cmsp.appendContact(message.contactId);
			if (message.type === "customer") {
				var text: string = "何でも質問してください。";
				if (settings.useTranslation && settings.transLangCode) {
					text = await translate.translateText(text, "ja", settings.transLangCode).then((translations: any) => { return translations[0].translatedText });
				}
				const resp_message: any = {
					header: { contactId: message.contactId, room: message.room, type: "bot", mode: message.mode, channel: message.channel, messageId: Math.random().toString(16).slice(2), ticker: (new Date()) },
					body: { media: { type: "dialog", dialog: { messages: [{ type: "text", text: text }] } } }
				};
				io.to(message.contactId).emit("data", resp_message);
				cmsp.appendMessage(message.contactId, resp_message);
			}
		}
		else if (message.action === "leave") {
			_stdout(INFO || DEBUG, `leave contactId: ${message.contactId} Number of clients remained: ${Array.from(io.sockets.adapter.rooms).length}`);
			socket.leave(message.contactId);
			cmsp.clearContacts(message.contactId);
			io.sockets.emit("session", message);
		}
	});

	socket.on("data", async (message: any) => {
		_stdout(INFO || DEBUG, `data ${JSON.stringify(message)}`);
		//if (message.header.room) {
		//	io.to(message.header.room).emit("data", message);
		//}
		if (message.body.media.type === "dialog" && message.body.media.dialog) {
			var queryText: string = message.body.media.dialog.messages[0].text;
			io.to(message.header.contactId).emit("data", message);
			cmsp.appendMessage(message.header.contactId, message);
			io.to(monitorClientId).emit("monitor", { log: `<div style="margin-bottom:5px;font-weight:bold;color:#999;">ユーザー入力:</div><font color=black>${queryText}</font>` });
			var entities: string = "";
			await entitySentiment.getEntitySentiment(queryText).then((resp: any) => {
				_stdout(DEBUG, `entitySentiment ${JSON.stringify(resp)}`);
				resp.forEach((elem: any) => {
					var color: string = "black";
					if (elem.type !== "OTHER") color = "blue";
					entities += `<font color=${color}><b>${elem.mentions[0].text.content}</b></font> `;
					_stdout(INFO || DEBUG, `entitySentiment ${elem.mentions[0].text.content}　${elem.type}`);
				});
			});
			if (entities) {
				io.to(monitorClientId).emit("monitor", { log: `<div style="margin-bottom:5px;font-weight:bold;color:#999;">分析 (Syntax Analysis):</div>${entities}` });
			}
			if (settings.useDialogflow) {
				var intentAnalysis: string = "";
				await detectIntent.detectIntentText(settings.agentId, message.header.contactId, queryText, settings.languageCode).then((resp: any) => {
					if (resp.queryResult.query === "text") {
						var queryText: string = resp.queryResult.text;
						intentAnalysis += `<b>QueryText（発話	）:</b> ${queryText}</br>`;
						var intentName: string = '';
						if (resp.queryResult.match.intent) {
							intentName = resp.queryResult.match.intent.displayName;
						}
						intentAnalysis += `<b>Intent（意図）:</b> ${intentName}</br>`;
						var currentPage: string = '';
						if (resp.queryResult.currentPage) {
							currentPage = resp.queryResult.currentPage.displayName;
						}
						intentAnalysis += `<b>CurrentPage（ページ）:</b> ${currentPage}</br>`;
						for (const r of resp.queryResult.responseMessages) {
							if (r.text) {
								intentAnalysis += `<b>ResponseText（返答）:</b> ${r.text.text}</br/>`;
							}
						}
					}
				});
				if (intentAnalysis) {
					io.to(monitorClientId).emit("monitor", {log: `<div style="margin-bottom:5px;font-weight:bold;color:#999;">意図分析 (Dialogflow CX):</div>${intentAnalysis}`});
				}
			}
			await runGenAI(message.header.contactId, queryText);
		}

		var transcript: string = '';
		const contact: any = cmsp.getContact(message.header.contactId);
		contact.messages.forEach((contact: any) => {
			if (contact.body.media && contact.body.media.type === "dialog") {
				//var contactId: string = contact.header.contactId;
				var contactType: string = contact.header.type;
				var text: string = '';
				if (contact.body.media && contact.body.media.dialog.messages[0] && contact.body.media.dialog.messages[0].text) {
					text = contact.body.media.dialog.messages[0].text;
				}
				else if (contact.body.media && contact.body.media.dialog.messages[1] && contact.body.media.dialog.messages[1].text) {
					text = contact.body.media.dialog.messages[1].text;
				}
				transcript += `${contactType}: ${text}\n`;
			}
		});
	
		var context: GenAIContext = {
			funcGenAI: null,
			queryText: "",
			queryResults: [{
				queryModelName: "", queriedText: "", summarizeModelName: "", summarizedText: "",
				attributes: { reference: "", categories: [], scores: [] }
			}],
		};
		
		var promptToSummarize: string = settings.llm.PaLM2.prompts.summarize5;
		if (settings.useTranslation && settings.transLangCode) {
			promptToSummarize = await translate.translateText(promptToSummarize, "ja", settings.transLangCode).then((translations: any) => { return translations[0].translatedText });
		}
		await palm2.generate(`${transcript} ${promptToSummarize}`).then((results: any) => {
			_stdout(INFO || DEBUG, `queryGenAI 要約：${JSON.stringify(results)}`);
			context.queryResults[0].summarizeModelName = results[0].modelName;
			context.queryResults[0].summarizedText = results[0].resultText;
			if (results[0].attributes.categories) {
				context.queryResults[0].attributes.categories = results[0].attributes.categories;
				context.queryResults[0].attributes.scores = results[0].attributes.scores;
			}
			io.to(monitorClientId).emit("monitor", { log: `<div style="margin-bottom:5px;font-weight:bold;color:#999;">ここまでの会話の要約 (${context.queryResults[0].summarizeModelName}):</div><p style="color:green;">${context.queryResults[0].summarizedText}</p>` });
			_stdout(INFO || DEBUG, `Summary ${context.queryResults[0].summarizedText}`);
			cmsp.setSummary(message.header.contactId, context.queryResults[0].summarizedText);
		});
	});
});

app.post("/postMediaDataToFile", (req: express.Request, resp: express.Response) => {
	//const header: any = JSON.parse(req.body.header);
	try {
		const filePath = `${WORKDIR}/public/data/${req.body.file}`;
		_stdout(INFO || DEBUG, `/postMediaDataToFile filePath:${filePath}`);
		const contactId: string = req.body.contactId;
		fs.writeFile(filePath, req.body.data.split(',')[1], { encoding: "base64" }, async (error: any) => {
			if (error) throw error;
			resp.send({ result: "ok" }).end();
			io.to(monitorClientId).emit("monitor", { log: `<div style="margin-bottom:5px;font-weight:bold;color:#999;">受け取った画像:</div><img src="https://${FQDN}/data/${req.body.file}" style="width: 250px; height: 100%;" />` });
			io.to(contactId).emit("data", {
				header: { contactId: contactId, room: "", type: "customer", mode: "", channel: "webchat", messageId: Math.random().toString(16).slice(2), ticker: (new Date()) },
				body: {
					media: { type: "dialog", dialog: { messages: [{ type: "image", url: `https://${FQDN}/data/${req.body.file}` }] } }
				}
			});
			const ccai: any = { texts: "", dialogflow: "", suggest: "", syntax: "", entities: "", entitySentiment: "", segmentLabelAnnotations: "", transcription: "", translations: "", recommends: "" };			
			await detectVision.detectFulltext(filePath).then(async (texts: any) => {
				if (texts && texts.length) {
					ccai.texts = texts;
					await translate.translateText(ccai.texts[0].text, "ja", "en").then((translations: any) => { ccai.translations = translations; });
					if (ccai.texts[0].text) {
						io.to(monitorClientId).emit("monitor", { log: `<div style="margin-bottom:5px;font-weight:bold;color:#999;">テキスト (Google Vision AI):</div><font color=blue>${ccai.texts[0].text}</font><br/>` });
						await runGenAI(contactId, ccai.texts[0].text);
					}
					//await analyzeSyntax.analyzeSyntaxText(ccai.texts[0].text).then((syntax: any) => { ccai.syntax = syntax; });
					await entitySentiment.getEntitySentiment(ccai.texts[0].text).then((resp: any) => {
						_stdout(DEBUG, `entitySentiment ${JSON.stringify(resp)}`);
						resp.forEach((elem: any) => {
							var color: string = "black";
							if (elem.type !== "OTHER") color = "blue";
								ccai.entities += `<font color=${color}><b>${elem.mentions[0].text.content}</b></font> `;
							_stdout(INFO || DEBUG, `entitySentiment ${elem.mentions[0].text.content}　${elem.type}`);
						});
					});
					if (ccai.entities) {
						io.to(monitorClientId).emit("monitor", { log: `<div style="margin-bottom:5px;font-weight:bold;color:#999;">分析 (Entity Sentiment):</div>${ccai.entities}` });
					}
					await detectVision.detectFaces(filePath).then((faces: any) => { 
						ccai.faces += "<table style='font-size:13px;width:100%;'>";
						faces.forEach((face: any) => {
							ccai.faces += `<tr><td style='width:80px;'>Joy</td><td><i class='aoc-sentiment-happy' style='color:blue;'> ${face.joyLikelihood}</td></tr>` +
								`<tr><td style='width:80px;'>Sollow</td><td><i class='aoc-sentiment-sad' style='color:blue;'> ${face.sorrowLikelihood}</td></tr>` +
								`<tr><td style='width:80px;'>Anger</td><td><i class='aoc-sentiment-very-sad' style='color:blue;'> ${face.angerLikelihood}</td></tr>` +
								`<tr><td style='width:80px;'>Surprise</td><td><i class='aoc-sentiment-very-happy' style='color:blue;'> ${face.surpriseLikelihood}</td></tr>`;
							_stdout(INFO || DEBUG, `detectFaces Joy:${face.joyLikelihood}　Sorrow:${face.sorrowLikelihood} Anger:${face.angerLikelihood} Surprise:${face.surpriseLikelihood}`);
						});
						ccai.faces += "</table><br/>";
					});
					if (ccai.faces) {
						io.to(monitorClientId).emit("monitor", { log: `<div style="margin-bottom:5px;font-weight:bold;color:#999;">分析 (Detect Faces):</div>${ccai.faces}` });
					}	
					await detectVision.detectLabels(filePath).then((labels: any) => { 
						ccai.labels += "<table style='font-size:13px;width:100%;'>";
						labels.forEach((label: any) => {
							ccai.labels += `<tr><td>${label.description}</td></tr>`;
							_stdout(INFO || DEBUG, `detectLabels ${label.description}`);
						});
						ccai.labels += "</table><br/>";
					});
					if (ccai.labels) {
						io.to(monitorClientId).emit("monitor", { log: `<div style="margin-bottom:5px;font-weight:bold;color:#999;">分析 (Detect Labels):</div>${ccai.labels}` });
					}
				}
			});
		});
	}
	catch (error) {
		_stdout(INFO || DEBUG, `error ${JSON.stringify(error)}`);
		resp.send({ result: error }).end();
	}
});

app.get("/getSummary", (req: express.Request, resp: express.Response) => {
	resp.send({ "data":  cmsp.getSummary(req.query['id'])}).end();
	_stdout(INFO || DEBUG, `/getSummary success ${req.query['id']} ${cmsp.getSummary(req.query['id'])}`);
});


