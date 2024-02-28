(async (window, $) => {
	events.action("monitor", (message) => {
		console.log(`[events.action("monitor")] ${JSON.stringify(message)}`);
		$("#messages").append(`<h5>${message.log}</h5></br>`);
		$("#messages").animate({ scrollTop: $("#messages")[0].scrollHeight }, "normal");
	});
	
	events.action("ccai", (message) => {
		console.log(`[socket.on(ccai)] ${JSON.stringify(message)}`);
		
		if (message.body.media.ccai.texts && message.body.media.ccai.texts.length) {
			$("#messages").append("<div style='margin-bottom:0px;font-size:13px;font-weight:bold'>Detected Text (Vision API - OCR):</div>");
			$("#messages").append(`<div style='padding:0px;font-size:13px;font-weight:bold;color:blue;background-color:#eee;'>${message.body.media.ccai.texts[0].text}</div>`);
			$("#messages").append("<br/>");
		}
		
		if (message.body.media.ccai.translations && message.body.media.ccai.translations.length) {
			$("#messages").append("<div style='margin-bottom:5px;font-size:13px;font-weight:bold'>Translation (Natural Langage API - Translate Text):</div>");
			$("#messages").append(`<div style='padding:10px;font-size:13px;color:blue;background-color:#eee;' >${message.body.media.ccai.translations[0].translatedText}</div>`);
			$("#messages").append("<br/>");
		}

		if (message.body.media.ccai.entitySentiment && message.body.media.ccai.entitySentiment.entities.length) {
			$("#messages").append("<div style='margin-bottom:0px;font-size:13px;font-weight:bold'>Entity and Sentiment (Natural Langage API - Detect Entity and Sentiment):</div>");
			var entities = "<table style='font-size:13px;background-color:#eee;width:100%;'>";
			entities += "<tr><th style='width:300px;'>Entity</th><th style='width:200px;'>Type</th><th style='width:100px;text-align:center;'>Salience</th><th style='width:100px;text-align:center;'>Magnitude</th><th style='width:100px;text-align:center;'>Score</th></tr>";
			message.body.media.ccai.entitySentiment.entities.forEach((entity) => {
				entities += "<tr>";
				entities += (entity.metadata.wikipedia_url !== undefined ?
					`<td style='width:300px;'><a href='${entity.metadata.wikipedia_url}' target='_blank'><font color=blue>${entity.name} (${entity.metadata.wikipedia_url})</font></a></td>` :
					`<td style='width:300px;'><a href='${entity.name}' target='_blank'><font color=blue>${entity.name}</font></a></td>`);
				entities += `<td style='width:200px;'>${entity.type}</td>`;
				entities += `<td style='width:100px;text-align:center;'>${parseInt(parseFloat(entity.salience) * 100, 10)}</td>`;
				entities += `<td style='width:100px;text-align:center;'>${parseInt(parseFloat(entity.sentiment.magnitude) * 100, 10)}</td>`;
				entities += `<td style='width:100px;text-align:center;'>${parseInt(parseFloat(entity.sentiment.score) * 100, 10)}</td></tr>`;
			});
			entities += "</table>";
			$("#messages").append(`<div style='padding:10px;font-size:17px;background-color:#eee;'>${entities}</div>`);
			$("#messages").append("</div>");
			$("#messages").append("<br/>");
		}
		
		if (message.body.media.ccai.faces && message.body.media.ccai.faces.length) {
			$("#messages").append("<div style='margin-bottom:0px;font-size:13px;font-weight:bold'>Detected Face Emotion (Vision API - Detect Face Emotion):</div>");
			var faces = "";
			message.body.media.ccai.faces.forEach((face) => {
				faces += "<table style='font-size:13px;background-color:#eee;width:100%;'>";
				faces += `<tr><td style='width:80px;'>Joy</td><td><i class='aoc-sentiment-happy' style='color:blue;'> ${face.joyLikelihood}</td></tr>` +
					`<tr><td style='width:80px;'>Sollow</td><td><i class='aoc-sentiment-sad' style='color:blue;'> ${face.sorrowLikelihood}</td></tr>` +
					`<tr><td style='width:80px;'>Anger</td><td><i class='aoc-sentiment-very-sad' style='color:blue;'> ${face.angerLikelihood}</td></tr>` +
					`<tr><td style='width:80px;'>Surprise</td><td><i class='aoc-sentiment-very-happy' style='color:blue;'> ${face.surpriseLikelihood}</td></tr>`;
				faces += "</table><br/>";
				imagePad_circle(face.landmarks[0].position.x, face.landmarks[0].position.y);
				imagePad_circle(face.landmarks[1].position.x, face.landmarks[1].position.y);
				/*
				imagePad_circle(face.landmarks[30].position.x, face.landmarks[30].position.y);
				imagePad_circle(face.landmarks[31].position.x, face.landmarks[31].position.y);
				*/
				imagePad_line(
					face.landmarks[2].position.x, face.landmarks[2].position.y,
					face.landmarks[3].position.x, face.landmarks[3].position.y);
				imagePad_line(
					face.landmarks[4].position.x, face.landmarks[4].position.y,
					face.landmarks[5].position.x, face.landmarks[5].position.y);
				imagePad_line(
					face.landmarks[10].position.x, face.landmarks[10].position.y,
					face.landmarks[12].position.x, face.landmarks[12].position.y);
				imagePad_line(
					face.landmarks[11].position.x, face.landmarks[11].position.y,
					face.landmarks[12].position.x, face.landmarks[12].position.y);
				imagePad_line(
					face.landmarks[13].position.x, face.landmarks[13].position.y,
					face.landmarks[15].position.x, face.landmarks[15].position.y);
				imagePad_line(
					face.landmarks[14].position.x, face.landmarks[14].position.y,
					face.landmarks[15].position.x, face.landmarks[15].position.y);

				imagePad_line(
					face.landmarks[30].position.x, face.landmarks[30].position.y,
					face.landmarks[31].position.x, face.landmarks[31].position.y);
			});
			$("#messages").append(`<div style='padding:10px;font-size:17px;background-color:#eee;'>${faces}</div>`);
			$("#messages").append("<br/>");
		}

		if (message.body.media.ccai.labels && message.body.media.ccai.labels.length) {
			$("#messages").append("<div style='margin-bottom:0px;font-size:13px;font-weight:bold'>Detected Labels (Vision API - Detect Objects):</div>");
			var labels = "<table style='font-size:13px;background-color:#eee;width:100%;'>";
			labels += "<tr><th style='width:300px;'>Label</th></tr>";
			message.body.media.ccai.labels.forEach((label) => {
				labels += `<tr><td><a href='${label.description}' target='_blank'><font color=blue>${label.description}</font></a></td></tr>`;
			});
			labels += "</table>";
			$("#messages").append(`<div style='padding:10px;font-size:17px;background-color:#eee;'>${labels}</div>`);
			$("#messages").append("<br/>");
		}

		if (message.body.media.ccai.logos && message.body.media.ccai.logos.length) {
			$("#ccai").append("<div style='margin-bottom:0px;font-size:13px;font-weight:bold'>Detected Logo (Vision API - Detect Company/Organization):</div>");
			var logos = "<table style='font-size:13px;background-color:#eee;width:100%;'>";
			logos += "<tr><th style='width:300px;'>Logo</th></tr>";
			message.body.media.ccai.logos.forEach((logo) => {
				logos += `<tr><td><a href='${logo.description}' target='_blank'><font color=blue>${logo.description}</font></a></td></tr>`;
				imagePad_line(
					logo.boundingPoly.vertices[0].x, logo.boundingPoly.vertices[0].y,
					logo.boundingPoly.vertices[1].x, logo.boundingPoly.vertices[1].y);
				imagePad_line(
					logo.boundingPoly.vertices[1].x, logo.boundingPoly.vertices[1].y,
					logo.boundingPoly.vertices[2].x, logo.boundingPoly.vertices[2].y);
				imagePad_line(
					logo.boundingPoly.vertices[2].x, logo.boundingPoly.vertices[2].y,
					logo.boundingPoly.vertices[3].x, logo.boundingPoly.vertices[3].y);
				imagePad_line(
					logo.boundingPoly.vertices[3].x, logo.boundingPoly.vertices[3].y,
					logo.boundingPoly.vertices[0].x, logo.boundingPoly.vertices[0].y);
			});
			logos += "</table>";
			$("#messages").append(`<div style='padding:10px;font-size:14px;background-color:#eee;'>${logos}</div>`);
			$("#messages").append("<br/>");
		}
	});
})(window, jQuery);