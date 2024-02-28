// Tomohiro Iwasa, Avaya Japan, 2017-2022
// Updated: 20220811

(async (window, $) => {

	const appendDialogMessages = (message) => {
		if (message.body.media.type === "dialog" && !message.body.media.dialog)
			return;
		const datetime = (message.header.ticker ? `${message.header.ticker.substr(11, 5)}` : `${('0' + (new Date()).getHours()).slice(-2)}:${('0' + (new Date()).getMinutes()).slice(-2)}`);
		const who = (message.header.type === "bot" ? `<i class="neo-icon-bot" style="font-size:30px;color:red;"></i>` :
			(message.header.type === "agent" ? `<i class="neo-icon-agents" style="font-size:30px;color:red;"></i>` :
				`<figure class="neo-avatar neo-avatar--small neo-avatar--small--generic" style="margin-top:5px;"></figure>`));
		var html = `<ul class="neo-group-list neo-group-list--hover"><li class="neo-group-list__wrapper neo-divider">`;
		html += `<div class="neo-group-list__item">`;
		html += `<div style="width:35px;"><p>${who}</p><p class="neo-body-small">${datetime}</p></div>`;
		html += `<div style="width:calc(100% - 35px)">`;
		if (message.body.media.dialog) {
			for (var i in message.body.media.dialog.messages) {
				if (!message.body.media.dialog.messages[i].type) continue;
				switch (message.body.media.dialog.messages[i].type) {
					case "text":
						if (message.body.media.dialog.messages[i].modal) {
							console.log(`modal.id ${message.body.media.dialog.messages[i].modal.id}`);
							cmsp.client.attributes.modal_id = message.body.media.dialog.messages[i].modal.id;
						}
						else {
							cmsp.client.attributes.modal_id = '';
						}
						html += `<p style="margin-top:5px;font-size:15px;color:#555;font-weight:bold;"> ${message.body.media.dialog.messages[i].text}</p >`;
						if (message.body.media.dialog.messages[i].modal && message.body.media.dialog.messages[i].modal.selections) {
							html += `<div id = "${message.body.media.dialog.messages[i].modal.id}" style="margin-top:10px;;">`;
							message.body.media.dialog.messages[i].modal.selections.forEach((item) => {
								html += `<div style="margin-top:5px;width:90%;"> <button id="select_${item.id}" class="neo-btn neo-btn--wide neo-btn-secondary neo-btn-secondary--default"
			onclick="selection_clicked('${message.body.media.dialog.messages[i].modal.id}', '${item.text}', '${item.value}');">${item.text}</button></div>`;
							});
							html += `</div>`;
						}
						if (message.body.media.dialog.messages[i].modal && message.body.media.dialog.messages[i].modal.input_masked) {
							//var input_masked_id = message.body.media.dialog.messages[i].modal.input_masked.id;
							var input_masked_id = message.body.media.dialog.messages[i].modal.id;
							html += `<div id = "${input_masked_id}" style="margin-top:10px;margin-left:20px;">`;
							for (var i = 1; i != 10; i++) {
								if (i == 1 || i == 4 || i == 7) {
									html += `<div class="row">`;
								}
								html += `<div style="margin-top:5px;margin-left:20px;width:60px;height:40px;"> <button id="digit_${i}" class="neo-btn neo-btn--wide neo-btn-primary neo-btn-primary--default --neo-web-body-regular-line-height"
			style="width:60px;border-radius:10px;" onclick="digit_clicked('${input_masked_id}', '${i}');">${i}</button></div>`;
								if (i == 3 || i == 6 || i == 9) {
									html += `</div>`;
								}
							}
							html += `<div class="row"><div style="margin-top:10px;margin-left:20px;width:60px;height:40px;"><button id="digit_${0}" class="neo-btn neo-btn--wide neo-btn-primary neo-btn-primary--default"
			style="width:60px;border-radius:10px;" onclick="digit_clicked('${input_masked_id}', '0');">0</button></div>`;
							html += `<div style="margin-top:10px;margin-left:20px;width:60px;height:40px;font-color:#555;"> <button id="digit_${i}" class="neo-btn neo-btn-primary neo-btn-primary--alert"
			style="width:60px;border-radius:10px;" onclick="digit_clicked('${input_masked_id}', 'Clear');">消去</button></div>`;
							html += `<div style="margin-top:10px;margin-left:20px;width:60px;height:40px;font-color:#555;"> <button id="digit_${i}" class="neo-btn neo-btn-primary neo-btn-primary--success"
			style="width:60px;border-radius:10px;" onclick="digit_clicked('${input_masked_id}', 'Enter');">完了</button></div></div>`;
							html += `<div style="margin-top:10px;margin-left:0px;width:60px;height:40px;font-weight:bold;"> <h3><span id="cardNumber"></span></h3></div>`;
							html += `</div>`;
						}
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
		if (message.body.media.website) {
			for (var i in message.body.media.website.views) {
				if (!message.body.media.website.views[i].type) continue;
				switch (message.body.media.website.views[i].type) {
					case "page":
						if (message.body.media.website.views[i].text) {
							html += `<span style='width:100%;' > ${message.body.media.website.views[i].text}</span>`;
						}
						html += `<img src='${message.body.media.website.views[i].url}' style='margin-top:5px;width:100%;' >`;
						break;
				}
			}
		}
		html += `</div></div>`;
		html += `</li></ul>`;
		//console.log(html);
		$("#chat-talk").append(html);
		$("#chat-talk").animate({ scrollTop: $("#chat-talk")[0].scrollHeight }, "normal");
	}

	$("#btn-chat").click(() => {
		events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "dialog" } } });
	});

	$("#btn-image").click(() => {
		events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "image" } } });
	});

	$("#btn-start-stream").click(() => {
		events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "stream" } } });
	});

	$("#btn-stop-stream").click(() => {
		events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "dialog" } } });
	});

	$("#btn-audio").click(() => {
		var bool = $("#LocalVideoMedia").prop("muted");
		$("#LocalVideoMedia").prop("muted", !bool);
		if (bool) {
			$("#btn-audio").removeClass().addClass("aoc-audio");
		}
		else {
			$("#btn-audio").removeClass().addClass("aoc-audio-off");
		}
	});

	const imagePad = {
		canvas: document.getElementById("imagePad"),
		context: document.getElementById("imagePad").getContext("2d"),
		mouse: { mouseDown: false, currPosition: { x: 0, y: 0 }, lastPosition: { x: 0, y: 0 } },
		org_src: null,
		src: null,
		rect: { left: 0, top: 0, width: 0, height: 0 },
		pen_color: "#f00"
	};

	window.imagePad_circle = (x, y) => {
		imagePad.context.beginPath();
		imagePad.context.arc(x, y, 20, 0, 2 * Math.PI);
		imagePad.context.strokeStyle = '#f00';
		imagePad.context.lineWidth = 2.0;
		imagePad.context.stroke();
	}

	window.imagePad_line = (x1, y1, x2, y2) => {
		imagePad.context.beginPath();
		imagePad.context.moveTo(x1, y1);
		imagePad.context.lineTo(x2, y2);
		imagePad.context.strokeStyle = '#f00';
		imagePad.context.lineWidth = 2.0;
		imagePad.context.stroke();
	}

	const sendMediaDataToFile = (header, file, id) => {
		const deferred = $.Deferred();
		const data = { header: JSON.stringify(header), file: file, data: document.getElementById(id).toDataURL() };
		$.ajax({
			url: `https://aura.uxportal.jp/postMediaDataToFile`,
			method: 'POST',
			cache: false,
			dataType: 'json',
			data: data,
			timeout: 5000,
			success: (data) => {
				console.log(`[sendFileData] success ${JSON.stringify(data)}`);
				events.launch('emit_data', { header: header, body: { media: { type: "image", file: file } } });
				deferred.resolve(data);
			},
			error: (error) => {
				console.log(`[sendFileData] error ${error.statusText}`);
				deferred.reject(error.statusText);
			}
		});
		return deferred.promise();
	};

	$("#view-video-remote").click(async () => {
		if (!webRTC.getPeerConnection()) return;
		const video = document.getElementById("RemoteVideoMedia");
		imagePad.canvas.width = video.videoWidth;
		imagePad.canvas.height = video.videoHeight;
		imagePad.canvas.getContext("2d").drawImage(video, 0, 0, imagePad.canvas.width, imagePad.canvas.height);
		const file = `${_MMDDHHSS()}.png`;
		await sendMediaDataToFile(_header(cmsp.client), file, "imagePad").then(async () => {
			$("#ccai").empty().append(`<div class="neo-spinner neo-spinner--x-large" style="margin: 50px;"></div>`);
			$("#ccai_data").empty().append(`<div class="neo-spinner neo-spinner--x-large" style="margin: 50px;"></div>`);
		});
	});

	document.getElementById("fileUpload").addEventListener("change", async (e) => {
		if (e.target.files[0].type.match("video.*")) {
			const file = `${_MMDDHHSS()}.mov`;
			await sendMediaDataToFile(_header(cmsp.client), file, "imagePad").then(async () => {
				$("#ccai").empty().append(`<div class="neo-spinner neo-spinner--x-large" style="margin: 50px;"></div>`);
				$("#ccai_data").empty().append(`<div class="neo-spinner neo-spinner--x-large" style="margin: 50px;"></div>`);
			});
		}
		else if (e.target.files[0].type.match("image.*")) {
			const image = new Image();
			const deferred = new $.Deferred();
			image.onload = async () => {
				var width = image.width;
				var height = image.height;
				const max_image_width = 600;
				if (width > max_image_width) {
					width = max_image_width;
					height = image.height * (max_image_width / image.width);
				}
				imagePad.canvas.width = width;
				imagePad.canvas.height = height;
				console.log(`imagePad.canvas.width:${imagePad.canvas.width} imagePad.canvas.height: ${imagePad.canvas.height}`);
				imagePad.canvas.getContext("2d").drawImage(image, 0, 0, imagePad.canvas.width, imagePad.canvas.height);
				deferred.resolve();
			}
			image.src = window.URL.createObjectURL(e.target.files[0]);
			deferred.promise().then(async () => {
				const file = `${_MMDDHHSS()}.png`;
				await sendMediaDataToFile(_header(cmsp.client), file, "imagePad").then(async () => {
					$("#ccai").empty().append(`<div class="neo-spinner neo-spinner--x-large" style="margin: 50px;"></div>`);
					$("#ccai_data").empty().append(`<div class="neo-spinner neo-spinner--x-large" style="margin: 50px;"></div>`);
				});
			});
		}
		document.getElementById("fileUpload").value = "";
	});

	const imageDropTarget = document.getElementById("widget-interaction");
	imageDropTarget.addEventListener("dragover", (e) => {
		e.preventDefault();
		e.stopPropagation();
		e.dataTransfer.dropEffect = "copy";
	});

	imageDropTarget.addEventListener("drop", (e) => {
		e.stopPropagation();
		e.preventDefault();
		const reader = new FileReader();
		reader.onload = (e) => {
			const image = new Image();
			const deferred = new $.Deferred();
			image.onload = async () => {
				var width = image.width;
				var height = image.height;
				const max_image_width = 640;
				if (width > max_image_width) {
					width = max_image_width;
					height = image.height * (max_image_width / image.width);
				}
				imagePad.canvas.width = width;
				imagePad.canvas.height = height;
				console.log(`imagePad.canvas width:${imagePad.canvas.width} height:${imagePad.canvas.height}`);
				imagePad.canvas.getContext("2d").drawImage(image, 0, 0, imagePad.canvas.width, imagePad.canvas.height);
				deferred.resolve();
			}
			image.src = e.target.result;
			deferred.promise().then(async () => {
				const file = `${_MMDDHHSS()}.png`;
				await sendMediaDataToFile(_header(cmsp.client), file, "imagePad").then(async () => {
					$("#ccai").empty().append(`<div class="neo-spinner neo-spinner--x-large" style="margin: 50px;"></div>`);
					$("#ccai_data").empty().append(`<div class="neo-spinner neo-spinner--x-large" style="margin: 50px;"></div>`);
				});
			});
		}
		reader.readAsDataURL(e.dataTransfer.files[0]);
	});

	imagePad.canvas.addEventListener("mousedown", (e) => {
		// e || event.changedTouches[0];
		var rect = imagePad.canvas.getBoundingClientRect();
		console.log(`rect ${JSON.stringify(rect)}`);
		imagePad.rect = { left: Math.floor(rect.left), top: Math.floor(rect.top), right: Math.floor(rect.right), bottom: Math.floor(rect.bottom), width: Math.floor(rect.width), height: Math.floor(rect.height) };
		console.log(`imagePad.rect left:${imagePad.rect.left} top:${imagePad.rect.top} with:${imagePad.rect.width} height:${imagePad.rect.height}`);
		console.log(`e clientX:${e.clientX} clientY:${e.clientY}`);
		imagePad.mouse.currPosition = { x: (e.clientX - imagePad.rect.left), y: (e.clientY - imagePad.rect.top) };
		imagePad.mouse.lastPosition = imagePad.mouse.currPosition;
		imagePad.mouse.mouseDown = true;
	}, false);

	imagePad.canvas.addEventListener("mousemove", (e) => {
		if (!imagePad.mouse.mouseDown) {
			return;
		}
		imagePad.mouse.currPosition = { x: (e.clientX - imagePad.rect.left), y: (e.clientY - imagePad.rect.top) };
		console.log(`imagePad.mouse.currPosition x:${imagePad.mouse.currPosition.x} y:${imagePad.mouse.currPosition.y}`);
		if (imagePad.mouse.currPosition.x <= 4 || imagePad.mouse.currPosition.y <= 4 || imagePad.mouse.currPosition.x >= imagePad.rect.width - 4 || imagePad.mouse.currPosition.y >= imagePad.rect.height - 4) {
			imagePad.src = document.getElementById("imagePad").toDataURL();
			imagePad.mouse.mouseDown = false;
			return;
		}
		events.launch('emit_data', {
			header: _header(cmsp.client),
			body: {
				media: {
					type: "image", draw: {
						moveTo: { x: (imagePad.mouse.lastPosition.x / imagePad.rect.width), y: (imagePad.mouse.lastPosition.y / imagePad.rect.height) },
						lineTo: { x: (imagePad.mouse.currPosition.x / imagePad.rect.width), y: (imagePad.mouse.currPosition.y / imagePad.rect.height) },
						penColor: imagePad.pen_color
					}
				}
			}
		});
		imagePad.mouse.lastPosition = imagePad.mouse.currPosition;
	}, false);

	imagePad.canvas.addEventListener("mouseup", () => {
		imagePad.src = document.getElementById("imagePad").toDataURL();
		imagePad.mouse.mouseDown = false;
	}, false);

	$("#image-send").click(() => {
		events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "dialog", dialog: { messages: [{ type: "image", url: document.getElementById("imagePad").toDataURL() }] } }, ccai: null } })
	});

	$("#image-face").click(() => {
		$("#customer_photo").attr("src", document.getElementById("imagePad").toDataURL());
	});

	$("#image-signature").click(() => {
		$("#customer_signature").attr("src", document.getElementById("imagePad").toDataURL());
	});

	$("#search").keypress((e) => {
		if (e.keyCode !== 13) return;
		if ($("#search").val() === "") return;
		$("#search").val("");
		return false;
	});

	$("#keyWordInput").click(() => {
		return false;
	});

	window.send_chat = (text) => {
		events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "dialog", dialog: { messages: [{ type: "text", text: text }] } } } });
	};

	window.send_image = (url) => {
		events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "dialog", dialog: { messages: [{ type: "image", url: url }] } } } });
	};

	$("#typetext").keypress((e) => {
		if (e.keyCode !== 13) return;
		if ($("#typetext").val() === "") return;
		events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "dialog", dialog: { messages: [{ type: "text", text: $("#typetext").val() }] } } } });
		$("#typetext").val("");
		return false;
	});

	$("#chat-send").click(() => {
		if ($("#typetext").val() === "") return;
		events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "dialog", dialog: { messages: [{ type: "text", text: $("#typetext").val() }] } } } });
		$("#typetext").val("");
	});

	window.sendSuggestedMessage = (text) => {
		$("#ccai-suggests").hide();
		events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "dialog", dialog: { messages: [{ type: "text", text: text }] } } } });
	}

	window.sendUrlMessage = (url) => {
		events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "dialog", dialog: { messages: [{ type: "url", url: url }] } } } });
	}

	$("#chat-menu1").click(() => {
		events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "dialog", dialog: { messages: [{ type: "image", url: "../images/ic_smile_200.png" }] } } } });
		$("#chat-menu").hide();
	});

	$("#chat-menu2").click(() => {
		events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "dialog", dialog: { messages: [{ type: "image", url: "../images/ic_normal_200.png" }] } } } });
		$("#chat-menu").hide();
	});

	$("#chat-menu3").click(() => {
		events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "dialog", dialog: { messages: [{ type: "image", url: "../images/ic_depress_200.png" }] } } } });
		$("#chat-menu").hide();
	});

	$("#transcription").click(() => {
		$("#agent_assist").empty().append(creditcard_statement);
	});

	$("#conact_pickup_btn").click(() => {
		$("#conact_pickup_btn").prop("disabled", true);
		$("#conact_pickup").hide();
		$("#media_switch").show();
		events.launch('emit_event', { header: _header(cmsp.client), body: { type: "picked", customerId: cmsp.client.room, agentId: cmsp.client.userId } });
		/*
				$.get(`/AnswerCall`, (data) => {
					console.log(JSON.stringify(data));
				}).fail((error) => {
					console.error(error);
				});
		*/
	});

	// socket.emit("event", {header:_header(cmsp.client.userId, cmsp.client.room, cmsp.client.type, "", ""), body:{type:"customerDropped", customerId:cmsp.client.userId}});

	window.selection_clicked = (modal_id, text, value) => {
		var selected_menu = `（お客様が選択された項目）<br/><font color=blue>${text}</font>`;
		events.launch('emit_data', {
			header: _header(cmsp.client),
			body: {
				media: {
					type: "dialog", dialog: {
						messages: [{ type: "text", text: selected_menu }],
						attributes: { bot_step: modal_id, value: value }
					}
				}
			}
		});
		$(`#${modal_id}`).empty();

		if (value === "member_signup") {
			$("#calleeAddress").val("23912");
			$("#audioCallBtn").click();
		}
		else if (value === "self_service") {
			$("#calleeAddress").val("23912");
			$("#audioCallBtn").click();
		}
	};

	window.digit_clicked = (modal_id, value) => {
		if (value === "Enter") {
			if ($("#cardNumber").text().length == 14) {
				var cardNumberText = `（お客様ご入力のカード番号）<br/><font color=blue>＊＊＊＊＊＊＊＊＊＊＊＊${$("#cardNumber").text().slice(-4)}</font>`;
				events.launch('emit_data', {
					header: _header(cmsp.client),
					body: {
						media: {
							type: "dialog", dialog: {
								messages: [{ type: "text", text: cardNumberText }],
								attributes: { bot_step: modal_id, value: $("#cardNumber").text() }
							}
						}
					}
				});
				$(`#${modal_id}`).empty();
				$("#cardNumber").empty();
			}
		}
		else if (value === "Clear") {
			$("#cardNumber").empty();
		}
		else {
			if ($("#cardNumber").text().length !== 14)
				$("#cardNumber").append(value);
		}
	};

	events.action("data", async (message) => {
		console.log(`[events.action("data")] ${JSON.stringify(message)}`);
		switch (message.body.media.type) {
			case "dialog": {
				if (webRTC.getPeerConnection()) webRTC.hangUp();
				$("#form-stream").hide();
				$("#form-canvas").hide();
				$("#form-video").hide();
				$("#form-chat").show();
				$("#form-apply").hide();
				if (message.body.media.dialog) appendDialogMessages(message);
				break;
			}
			case "image": {
				if (webRTC.getPeerConnection()) webRTC.hangUp();
				$("#form-chat").hide();
				$("#form-stream").hide();
				$("#form-video").hide();
				$("#form-canvas").show();
				$("#form-apply").hide();
				if (message.body.media.file && cmsp.client.userId !== message.header.userId) {
					imagePad.context.clearRect(0, 0, imagePad.canvas.width, imagePad.canvas.height);
					const image = new Image();
					image.onload = () => {
						imagePad.canvas.width = image.width;
						imagePad.canvas.height = image.height;
						console.log(`imagePad.canvas width:${imagePad.canvas.width} height:${imagePad.canvas.height}`);
						imagePad.canvas.getContext("2d").drawImage(image, 0, 0, imagePad.canvas.width, imagePad.canvas.height);
						let rect = imagePad.canvas.getBoundingClientRect();
						console.log(`rect ${JSON.stringify(rect)}`);
						imagePad.rect = { left: Math.floor(rect.left), top: Math.floor(rect.top), right: Math.floor(rect.right), bottom: Math.floor(rect.bottom), width: Math.floor(rect.width), height: Math.floor(rect.height) };
						console.log(`imagePad.rect ${JSON.stringify(imagePad.rect)}`);
					}
					image.src = `/data/${message.body.media.file}`;
					$("#ccai").empty();
					$("#please-wait").empty().append(`<div class="neo-spinner neo-spinner--x-large" style="margin: 50px;"></div>`);
				}
				else if (message.body.media.draw) {
					console.log(`canvas.x:${(message.body.media.draw.lineTo.x * imagePad.rect.width)} canvas.y:${(message.body.media.draw.lineTo.y * imagePad.rect.height)}`);
					imagePad.context.beginPath();
					imagePad.context.moveTo((message.body.media.draw.moveTo.x * imagePad.canvas.width), (message.body.media.draw.moveTo.y * imagePad.canvas.height));
					imagePad.context.lineTo((message.body.media.draw.lineTo.x * imagePad.canvas.width), (message.body.media.draw.lineTo.y * imagePad.canvas.height));
					imagePad.context.strokeStyle = message.body.media.draw.penColor;
					imagePad.context.lineWidth = 5;
					imagePad.context.stroke();
				}
				break;
			}
			case "stream": {
				if (webRTC.getPeerConnection()) webRTC.hangUp();
				if (message.header.userId !== cmsp.client.userId) {
					$("#form-chat").hide();
					$("#form-canvas").hide();
					$("#form-video").hide();
					$("#form-stream").show();
					$("#form-apply").hide();
					//$("#btn-audio").prop("disabled", false);
					webRTC.startVideo(true);
				}
				else {
					$("#form-chat").hide();
					$("#form-canvas").hide();
					$("#form-video").hide();
					$("#form-stream").show();
					$("#form-apply").hide();
					//$("#btn-audio").prop("disabled", false);
					webRTC.startVideo(false);
				}
				break;
			}
			case "video": {
				if (webRTC.getPeerConnection()) webRTC.hangUp();
				$("#form-chat").hide();
				$("#form-stream").hide();
				$("#form-canvas").hide();
				$("#form-video").show();
				$("#form-apply").hide();
				$("#mediaPlayer").attr("src", message.body.media.url);
				//$("#ccai").empty();
				$("#please-wait").empty().append(`<div class="neo-spinner neo-spinner--x-large" style="margin: 50px;"></div>`);
				break;
			}
		}
	});

	events.action("event", async (message) => {
		console.log(`[events.action("event")] ${JSON.stringify(message)}`);
		imagePad.context.clearRect(0, 0, imagePad.canvas.width, imagePad.canvas.height);
		switch (message.body.type) {
			case "apply": {
				break;
			}
			case "application-form": {
				$("#form-chat").hide();
				$("#form-stream").hide();
				$("#form-canvas").hide();
				$("#form-video").hide();
				$("#form-apply").show();
				await getHtml("interaction/application_form.html").then((data) => { $("#form-apply").empty().append(data); });
				break;
			}
			case "photo-shot": {
				const image = new Image();
				const deferred = new $.Deferred();
				image.onload = () => {
					var width = image.width;
					var height = image.height;
					const max_image_width = 800;
					if (width > max_image_width) {
						width = max_image_width;
						height = image.height * (max_image_width / image.width);
					}
					imagePad.canvas.width = width;
					imagePad.canvas.height = height;
					console.log(`imagePad.canvas.width:${imagePad.canvas.width} imagePad.canvas.height:${imagePad.canvas.height}`);
					imagePad.canvas.getContext("2d").drawImage(image, 0, 0, imagePad.canvas.width, imagePad.canvas.height);
					deferred.resolve();
				}
				image.src = "interaction/images/takephoto.png";
				deferred.promise().then(async () => {
					await sendMediaDataToFile(_header(cmsp.client), "photo.png", "imagePad").then(() => {
						events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "image", file: "photo.png" } } });
					});
				});
				break;
			}
			case "signature": {
				const image = new Image();
				const deferred = new $.Deferred();
				image.onload = () => {
					var width = image.width;
					var height = image.height;
					const max_image_width = 800;
					if (width > max_image_width) {
						width = max_image_width;
						height = image.height * (max_image_width / image.width);
					}
					imagePad.canvas.width = width;
					imagePad.canvas.height = height;
					console.log(`imagePad.canvas.width:${imagePad.canvas.width} imagePad.canvas.height:${imagePad.canvas.height}`);
					imagePad.canvas.getContext("2d").drawImage(image, 0, 0, imagePad.canvas.width, imagePad.canvas.height);
					deferred.resolve();
				}
				image.src = "interaction/images/signature.png";
				deferred.promise().then(async () => {
					await sendMediaDataToFile(_header(cmsp.client), "signature.png", "imagePad").then(() => {
						events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "image", file: "signature.png" } } });
					});
				});
				break;
			}
			case "notification": {
				$("#form-chat").hide();
				$("#form-stream").hide();
				$("#form-canvas").hide();
				$("#form-video").hide();
				$("#form-apply").show();
				await getHtml("interaction/notification_message.html").then((data) => { $("#form-apply").empty().append(data); });
				break;
			}
			case "contract": {
				const image = new Image();
				const deferred = new $.Deferred();
				image.onload = () => {
					var width = image.width;
					var height = image.height;
					const max_image_width = 800;
					if (width > max_image_width) {
						width = max_image_width;
						height = image.height * (max_image_width / image.width);
					}
					imagePad.canvas.width = width;
					imagePad.canvas.height = height;
					console.log(`imagePad.canvas.width:${imagePad.canvas.width} imagePad.canvas.height:${imagePad.canvas.height}`);
					imagePad.canvas.getContext("2d").drawImage(image, 0, 0, imagePad.canvas.width, imagePad.canvas.height);
					deferred.resolve();
				}
				image.src = "interaction/images/business_account_terms_and_conditions.png";
				deferred.promise().then(async () => {
					await sendMediaDataToFile(_header(cmsp.client), "contract.png", "imagePad").then(() => {
						events.launch('emit_data', { header: _header(cmsp.client), body: { media: { type: "image", file: "contract.png" } } });
					});
				});
				break;
			}
			case "dialog": {
				$("#form-chat").show();
				$("#form-stream").hide();
				$("#form-canvas").hide();
				$("#form-video").hide();
				$("#form-apply").hide();
				break;
			}
			case "queued": {
				cmsp.client.room = message.body.customerId;
				cmsp.client.mode = message.header.mode;
				await getHtml("interaction/queued_info.html").then((data) => { $("#queued_info").empty().append(data) });
				$("#customerInfo").html(`${message.body.customerId}`);
				$("#timeQueued").html(`${message.body.timeQueued}`);
				var attributes = { customer_type: "Existing", identification: "12345678", contact_number: "09093817266", contact_reason: "Open Multi-currency Business Account", attributes: "OpenAccount,English,Singapore", remark: "" };
				$("#attributes_customer_type").text(attributes.customer_type);
				$("#attributes_identification").text(attributes.identification);
				$("#attributes_contact_number").text(attributes.contact_number);
				$("#attributes_contact_reason").text(attributes.contact_reason);
				$("#attributes_attributes").text(attributes.attributes);
				$("#attributes_remark").text(attributes.remark);
				$("#contact-card").show();
				break;
			}
			case "picked": {
				console.log(`picked ${message.body.agentId}`);
				if (cmsp.client.userId === message.body.agentId) {
					//$("#timeContacted").html(`${(new Date()).getFullYear()}-${('0' + ((new Date()).getMonth() + 1)).slice(-2)}-${('0' + (new Date()).getDate()).slice(-2)} ${('0' + (new Date()).getHours()).slice(-2)}:${('0' + (new Date()).getMinutes()).slice(-2)}:${('0' + (new Date()).getSeconds()).slice(-2)}`);
					$("#contact_pickup").hide();
					$("#queued_info").hide();
					$("#media_switches").show();
					$("#form-chat").show();
					$.get(`/getMessages?key=${cmsp.client.room}`, (data) => {
						const messages = JSON.parse(Base64.decode(data));
						console.log(messages);
						messages.forEach((message) => {
							if (message.body.media.type === "dialog")
								appendDialogMessages(message);
						});
					}).fail((error) => {
						console.error(error);
					});
					;
				}
				else {
					cmsp.client.room = "";
					$("#form-chat").hide();
					//$("#displayName").empty();
				}
				if (message.header.mode === "card") {
					;
				}
				break;
			}
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