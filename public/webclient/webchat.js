(async (window, $) => {
	function appendDialogMessages(message) {
		if (message.body.media.type === "dialog" && !message.body.media.dialog)
			return;
		const datetime = (message.header.ticker ? `${message.header.ticker.substr(11, 5)}` : `${('0' + (new Date()).getHours()).slice(-2)}:${('0' + (new Date()).getMinutes()).slice(-2)}`);
		const who = (message.header.type === "bot" ? `<i class="neo-icon-bot" style="font-size:30px;color:red;"></i>` :
			(message.header.type === "agent" ? `<i class="neo-icon-agents" style="font-size:30px;color:red;"></i>` :
				`<figure class="neo-avatar neo-avatar--small neo-avatar--small--generic" style="margin-top:5px;"></figure>`));
		var bot_content = ``;
		var timeoutId = 0;
		var html = `<ul class="neo-group-list neo-group-list--hover"><li class="neo-group-list__wrapper neo-divider">`;
		html += `<div class="neo-group-list__item">`;
		html += `<div style="width:35px;"><p>${who}</p><p class="neo-body-small">${datetime}</p></div>`;
		html += `<div style="width:calc(100% - 35px)">`;
		if (message.body.media.dialog) {
			for (var i in message.body.media.dialog.messages) {
				if (!message.body.media.dialog.messages[i].type) continue;
				switch (message.body.media.dialog.messages[i].type) {
					case "wait":
						html += `<div id="bot_reply"><span class="neo-spinner neo-spinner--x" style="color:blue;"></span></div>`;
						timeoutId = setTimeout(function(){$("#bot_reply").html(`<p style="margin-top:5px;font-size:17px;color:blue;font-weight:normal;">ごめんさない。すぐに返事ができません。🙇</p>`);$("#bot_reply").attr('id', '');}, 20000);
						break;
					case "text":
						if (message.body.media.dialog.messages[i].modal) {
							cmsp.client.attributes.modal_id = message.body.media.dialog.messages[i].modal.id;
						}
						else {
							cmsp.client.attributes.modal_id = '';
						}
						if (message.header.type === "bot") {
							bot_content += `<p style="margin-top:5px;font-size:17px;color:blue;font-weight:normal;">${message.body.media.dialog.messages[i].text}</p>`
							if (message.body.media.dialog.messages[i].modal && message.body.media.dialog.messages[i].modal.selections) {
								bot_content += `<div id ="${message.body.media.dialog.messages[i].modal.id}" style="margin-top:10px;;">`;
								message.body.media.dialog.messages[i].modal.selections.forEach((item) => {
									bot_content += `<div style="margin-top:5px;width:90%;"><button id="select_${item.id}" class="neo-btn neo-btn--wide neo-btn-secondary neo-btn-secondary--default"
			onclick="selection_clicked('${message.body.media.dialog.messages[i].modal.id}', '${item.text}', '${item.value}');" style="width:300px;height:45px;">${item.text}</button></div>`;
								});
								bot_content += `</div>`;
							}
							if (message.body.media.dialog.messages[i].modal && message.body.media.dialog.messages[i].modal.input_masked) {
								//var input_masked_id = message.body.media.dialog.messages[i].modal.input_masked.id;
								var input_masked_id = message.body.media.dialog.messages[i].modal.id;
								bot_content += `<div id = "${input_masked_id}" style="margin-top:10px;margin-left:20px;">`;
								for (var i = 1; i != 10; i++) {
									if (i == 1 || i == 4 || i == 7) {
										bot_content += `<div class="row">`;
									}
									html += `<div style="margin-top:5px;margin-left:20px;width:60px;height:40px;"><button id="digit_${i}" class="neo-btn neo-btn--wide neo-btn-primary neo-btn-primary--default --neo-web-body-regular-line-height"
			style="width:60px;border-radius:10px;" onclick="digit_clicked('${input_masked_id}', '${i}');">${i}</button></div>`;
									if (i == 3 || i == 6 || i == 9) {
										bot_content += `</div>`;
									}
								}
								bot_content += `<div class="row"><div style="margin-top:10px;margin-left:20px;width:60px;height:40px;"><button id="digit_${0}" class="neo-btn neo-btn--wide neo-btn-primary neo-btn-primary--default"
			style="width:60px;border-radius:10px;" onclick="digit_clicked('${input_masked_id}', '0');">0</button></div>`;
								bot_content += `<div style="margin-top:10px;margin-left:20px;width:60px;height:40px;font-color:#555;"> <button id="digit_${i}" class="neo-btn neo-btn-primary neo-btn-primary--alert"
			style="width:60px;border-radius:10px;" onclick="digit_clicked('${input_masked_id}', 'Clear');">消去</button></div>`;
								bot_content += `<div style="margin-top:10px;margin-left:20px;width:60px;height:40px;font-color:#555;"> <button id="digit_${i}" class="neo-btn neo-btn-primary neo-btn-primary--success"
			style="width:60px;border-radius:10px;" onclick="digit_clicked('${input_masked_id}', 'Enter');">完了</button></div></div>`;
								bot_content += `<div style="margin-top:10px;margin-left:0px;width:60px;height:40px;font-weight:bold;"> <h3><span id="cardNumber"></span></h3></div>`;
								bot_content += `</div>`;
							}
						}
						else {
						 	bot_content += `<p style="margin-top:5px;font-size:17px;color:black;font-weight:normal;"> ${message.body.media.dialog.messages[i].text}</p >`;
						}
						html += bot_content;
						break;
					case "url":
						html += `<span> <iframe style='width:400px;height:350px;border:none;' src='${message.body.media.dialog.messages[i].url}'></iframe></span>`;
						break;
					case "image":
						if (message.body.media.dialog.messages[i].text) {
							html += `<span style='margin-top:5px;width:100%;' > ${message.body.media.dialog.messages[i].text}</span>`;
						}
						if (message.body.media.dialog.messages[i].originalContentUrl) {
							html += `<img src='${message.body.media.dialog.messages[i].originalContentUrl}' class='chat-img-left' style='margin-top:5px;width:100%;' />`;
						}
						if (message.body.media.dialog.messages[i].url) {
							html += `<img src='${message.body.media.dialog.messages[i].url}' style='margin-top:5px;width:100%;' />`;
						}
						break;
					case "video":
						if (message.body.media.dialog.messages[i].text) {
							html += `<span style='width:100%;' > ${message.body.media.dialog.messages[i].text}</span>`;
						}
						html += `<object data='${message.body.media.dialog.messages[i].url}' style='margin-top:5px;width:100%;' />`;
						break;
					case "sticker":
						if (message.body.media.dialog.messages[i].text) {
							html += `<span style='width:100%;' > ${message.body.media.dialog.messages[i].text}</span>`;
						}
						html += `<img src='stickers/${message.body.media.dialog.messages[i].stickerId}' style='margin-top:5px;width:100%;' >`;
						break;
				}
			}
		}
		html += `</div></div>`;
		html += `</li></ul>`;
		if (document.getElementById("bot_reply") != null && bot_content) {
			clearTimeout(timeoutId);
			$("#bot_reply").html(bot_content);
			$("#bot_reply").attr('id', '');
		}
		else {
			$("#chat-talk").append(html);
		}
		$("#chat-talk").animate({ scrollTop: $("#chat-talk")[0].scrollHeight }, "normal");
	}

	window.selection_clicked = (modal_id, text, value) => {
		var selected_menu = `<font color=blue>${text}</font>`;
		events.launch('emit_chat', {
			header: _header(cmsp.client),
			body: {
				media: {
					type: "dialog", dialog: {
						messages: [{ type: "text", text: selected_menu }],
						attributes: { modal_id: modal_id, value: value }
					}
				}
			}
		});
		$(`#${modal_id}`).empty();
	};

	$("#typetext").keypress((e) => {
		if (e.keyCode !== 13) return;
		if ($("#typetext").val() === "") return;
		events.launch('emit_chat', {
			header: _header(cmsp.client), body: {
				media: {
					type: "dialog", dialog: {
						messages: [{ type: "text", text: $("#typetext").val() }],
						attributes: { modal_id: cmsp.client.attributes.modal_id, value: $("#typetext").val() },
					},
				}
			}
		});
		$("#typetext").val("");
		return false;
	});

	$("#chat-send").click(() => {
		if ($("#typetext").val() === "") return;
		events.launch('emit_chat', { header: _header(cmsp.client), body: { media: { type: "dialog", dialog: { messages: [{ type: "text", text: $("#typetext").val() }] } } } });
		$("#typetext").val("");
	});

	events.action("emit_chat", (message) => {
		console.log(`[events.action("emit_chat")] ${JSON.stringify(message)}`);
		socket.emit('data', message);
	});

	events.action("chat", (message) => {
		console.log(`[events.action("chat")] ${JSON.stringify(message)}`);
		switch (message.body.media.type) {
			case "dialog": {
				if (message.body.media.dialog) appendDialogMessages(message);
				break;
			}
		}
	});
})(window, jQuery);