// Tomohiro Iwasa, Avaya Japan, 2017-2022
// Updated: 20220811

(async (window, $) => {
	'use strict';

	window.socket = io.connect();

	window.events = new EventManager();

	window._header = (sendTo) => {
		return { userId: sendTo.userId, room: sendTo.room, type: sendTo.type, mode: sendTo.mode, messageId: Math.random().toString(16).slice(2), ticker: (new Date()) };
	}

	window._MMDDHHSS = () => {
		return `${('0' + (new Date()).getMonth()).slice(-2)}${('0' + (new Date()).getDate()).slice(-2)}${('0' + (new Date()).getHours()).slice(-2)}${('0' + (new Date()).getMinutes()).slice(-2)}${('0' + (new Date()).getSeconds()).slice(-2)}`;
	}

	window.cmsp = {
		"client": { clientId: "", userId: "", type: "", mode: "", channel: "", password: "should_be_encrypted", room: "", linkState: false, data: [], attributes: {}, devices: [], }
	};

	var arg = new Object;
	var pair = location.search.substring(1).split("&");
	for (var i = 0; pair[i]; i++) {
		var keyValue = pair[i].split("=");
		arg[keyValue[0]] = keyValue[1];
	}

	cmsp.client.userId = "20001";
	cmsp.client.type = "agent";
	cmsp.client.room = "";

	if (arg.AgentId != null) {
		cmsp.client.userId = arg.AgentId;
	}

	console.log(`[INFO] cmsp.client.userId:${cmsp.client.userId}`);
	console.log(`[INFO] cmsp.client.room:${cmsp.client.room}`);

	if (!cmsp.client.userId) {
		alert("No userId identified.")
	}

	window.onload = async (e) => {
		console.log(`[INFO] window.onload ${JSON.stringify(e)}`);

		await getHtml("framework/framework.html").then((data) => { $("#app").empty().append(data); });
		await getHtml("framework/header.html").then((data) => { $("#header").empty().append(data); });
		await getHtml("framework/footer.html").then((data) => { $("#footer").empty().append(data); });
		await getHtml("interaction/interaction.html").then((data) => { $("#interaction").empty().append(data); });
		await getJs("interaction/interaction.js");
		await getJs("engagement/engagement.js");
		await getHtml("engagement/home.html").then((data) => { $("#engagement").empty().append(data); });
		await getHtml("telephony/telephony.html").then((data) => { $("#telephony").empty().append(data); });
		await getJs("telephony/telephony.js");

		webRTC.init("#LocalVideoMedia", "#RemoteVideoMedia");

		if (cmsp.client.userId) {
			socket.emit("session", { action: "join", userId: cmsp.client.userId, password: cmsp.client.password, type: cmsp.client.type, mode: cmsp.client.mode });
		}
		;
	};

	window.onbeforeunload = (e) => {
		console.log(`[INFO] window.onbeforeunload ${JSON.stringify(e)}`);
		if (webRTC.getPeerConnection()) {
			webRTC.hangUp();
		}
		// socket.emit("event", {header:header(cmsp.client), data:{type:"dropped"}});
		socket.emit("session", { action: "leave", userId: cmsp.client.userId });
	};

	socket.on("session", (message) => {
		console.log(`[INFO] socket.on(session): ${JSON.stringify(message)}`);
		if (message.action === "join" && message.userId === cmsp.client.userId && message.type === cmsp.client.type) {
			;
		}
		else if (message.action === "leave") {
			if (message.userId !== cmsp.client.userId) {
				if (webRTC.getPeerConnection()) {
					webRTC.hangUp("close");
				}
			}
			else {
				;
			}
		}
	});

	window.webRTC = new WebRTC();
	const socket_emit_webrtc = (data) => { socket.emit("webrtc", { header: _header(cmsp.client), body: data }); };
	window.socket_emit_webrtc = socket_emit_webrtc;
	socket.on("webrtc", (message) => {
		// var time = (message.time ? message.time : `${('0' + (new Date()).getHours()).slice(-2)}:${('0' + (new Date()).getMinutes()).slice(-2)}`);
		if (message.header.userId !== cmsp.client.userId) {
			webRTC.on(message);
		}
	});

	socket.on("data", (message) => {
		//console.log(`[socket.on(data)] ${JSON.stringify(message)}`);
		events.launch('data', message);
	});

	socket.on("ccai", (message) => {
		//console.log(`[socket.on(ccai)] ${JSON.stringify(message)}`);
		events.launch('ccai', message);
	});

	socket.on("event", (message) => {
		//console.log(`[socket.on(event)] ${JSON.stringify(message)}`);
		events.launch('event', message);
	});

	events.action("emit_data", (message) => {
		console.log(`[events.action("emit_data")] ${JSON.stringify(message)}`);
		socket.emit('data', message);
	});

	events.action("emit_event", (message) => {
		console.log(`[events.action("emit_event")] ${JSON.stringify(message)}`);
		socket.emit('event', message);
	});

	events.action("event", async (message) => {
		console.log(`[events.action("event")] ${JSON.stringify(message)}`);
		switch (message.body.type) {
			case "customerDropped": {
				cmsp.client.room = "";
				break;
			}
			case "agentDropped": {
				cmsp.client.room = "";
				break;
			}
		}
	});

})(window, jQuery);