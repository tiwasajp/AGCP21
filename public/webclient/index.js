// Tomohiro Iwasa, Avaya Japan, 2017-2023
// Updated: 20230529

(async (window, $) => {
	'use strict';

	window.socket = io.connect();
	window.events = new EventManager();
	window._header = (to) => {
		return { contactId: to.contactId, room: to.room, type: to.type, mode: to.mode, channel: to.channel, messageId: Math.random().toString(16).slice(2), ticker: (new Date()) };
	}
	window._MMDDHHSS = () => {
		return `${('0' + (new Date()).getMonth()).slice(-2)}${('0' + (new Date()).getDate()).slice(-2)}${('0' + (new Date()).getHours()).slice(-2)}${('0' + (new Date()).getMinutes()).slice(-2)}${('0' + (new Date()).getSeconds()).slice(-2)}`;
	}

	window.cmsp = {
		"client": { clientId: "", contactId: "", type: "", mode: "", channel: "", password: "should_be_encrypted", room: "", linkState: false, data: [], attributes: {}, devices: [], }
	};

	var arg = new Object;
	var pair = location.search.substring(1).split("&");
	for (var i = 0; pair[i]; i++) {
		var keyValue = pair[i].split("=");
		arg[keyValue[0]] = keyValue[1];
	}

	if (arg.id != null) {
		cmsp.client.contactId = arg.id;
	}
	else {
		cmsp.client.contactId = `10${('0' + (new Date()).getMinutes()).slice(-2)}${('0' + (new Date()).getSeconds()).slice(-2)}`;
	}
	//cmsp.client.contactId = "10002";
	cmsp.client.room = "";
	cmsp.client.type = "customer";
	cmsp.client.mode = "";
	cmsp.client.channel = "webchat";

	console.log(`[INFO] cmsp.client contactId:${cmsp.client.contactId} room:${cmsp.client.room} type:${cmsp.client.type} mode:${cmsp.client.mode} channel:${cmsp.client.channel}`);

	socket.on("session", (message) => {
		console.log(`[INFO] socket.on(session): ${JSON.stringify(message)}`);
		if (message.action === "join" && message.contactId === cmsp.client.contactId && message.type === cmsp.client.type) {
			;
		}
		else if (message.action === "leave") {
			if (message.contactId !== cmsp.client.contactId) {
				;
			}
			else {
				;
			}
		}
	});

	socket.on("data", (message) => {
		//console.log(`[socket.on(chat)] ${JSON.stringify(message)}`);
		events.launch('chat', message);
	});
	
	window.onload = async (e) => {
		console.log(`[INFO] window.onload ${JSON.stringify(e)}`);
		await getHtml("webchat.html").then((data) => { $("#webchat").append(data); });
		await getHtml("imageform.html").then((data) => { $("#imageform").append(data); });
		if (cmsp.client.contactId) {
			socket.emit("session", {
				action: "join", contactId: cmsp.client.contactId, room: cmsp.client.room, password: cmsp.client.password, type: cmsp.client.type, mode: cmsp.client.mode, channel: cmsp.client.channel
			});
		}
	};

	window.onbeforeunload = (e) => {
		console.log(`[INFO] window.onbeforeunload ${JSON.stringify(e)}`);
		socket.emit("session", { action: "leave", contactId: cmsp.client.contactId });
	};

})(window, jQuery);