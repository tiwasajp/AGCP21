// Tomohiro Iwasa, Avaya Japan, 2017-2022
// Updated: 20220811

(async (window, $) => {
	'use strict';

	window.socket = io.connect();

	window.events = new EventManager();

	window._header = (sendTo) => {
		return { userId: sendTo.userId, room: sendTo.room, type: sendTo.type, mode: sendTo.mode, channel: sendTo.channel, messageId: Math.random().toString(16).slice(2), ticker: (new Date()) };
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

	//cmsp.client.userId = `1000${('0' + (new Date()).getMinutes()).slice(-2)}${('0' + (new Date()).getSeconds()).slice(-2)}`;
	cmsp.client.userId = "20000";
	$("#callingNumber").val(cmsp.client.userId);
	cmsp.client.type = "customer";
	cmsp.client.mode = "card";
	cmsp.client.room = "";

	if (arg.CustomerId != null) {
		cmsp.client.userId = arg.CustomerId;
		$("#callingNumber").val(cmsp.client.userId);
		//$("#webrtc_control").hide();
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
		await getHtml("interaction/interaction.html").then((data) => { $("#webclient").empty().append(data); });
		await getJs("interaction/interaction.js");

		webRTC.init("#LocalVideoMedia", "#RemoteVideoMedia");

		var loginController = new window.LoginController();
		$('#loginBtn').click();

		if (cmsp.client.userId) {
			socket.emit("session", {
				action: "join", userId: cmsp.client.userId, password: cmsp.client.password, type: cmsp.client.type, mode: cmsp.client.mode
			});
		}
	};

	window.onbeforeunload = (e) => {
		console.log(`[INFO] window.onbeforeunload ${JSON.stringify(e)}`);
		if (webRTC.getPeerConnection()) {
			webRTC.hangUp();
		}
		socket.emit("event", { header: _header(cmsp.client.userId, cmsp.client.room, cmsp.client.type, cmsp.client.mode, "", ""), data: { type: "dropped" } });
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

	socket.on("data", (message) => {
		//console.log(`[socket.on(data)] ${JSON.stringify(message)}`);
		events.launch('data', message);
	});

	socket.on("event", (message) => {
		//console.log(`[socket.on(event)] ${JSON.stringify(message)}`);
		events.launch('event', message);
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