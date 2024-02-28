// Tomohiro Iwasa, Avaya Japan, 2017-2022
// Updated: 20220808

((window, $) => {
	'use strict';

	const openWebpageInFrame = (url) => {
		var html = `<div style="position:fixed;top:100px;left:400px;">
				<div class="neo-modal__background"></div>
				<div class="neo-modal__content" aria-modal="true" role="dialog">
				<div class="neo-modal__info-close"><button class="neo-close" onclick="$('#WikiFrame').empty();"/></div>
				<div class="neo-modal__body">
					<iframe src='${url}' style='width:1000px;height:680px;border:none;'></iframe>
				</div>
 				<div class="neo-modal__info row" onclick="$('#WikiFrame').empty();">
					<span class="neo-icon-chat"></span>
					<p>${url}</p>
  				</div>
  			</div>`;
		$("#WikiFrame").empty().append(html);
	}
	window.openWebpageInFrame = openWebpageInFrame;

	events.action("ccai", (message) => {
		console.log(`[socket.on(ccai)] ${JSON.stringify(message)}`);
		$("#ccai_output").empty().append("<div id='WikiFrame' style='position:fixed;left:500px;top:70px;'></div>");

		if (message.ccai.segmentLabelAnnotations && message.ccai.segmentLabelAnnotations.length) {
			$("#ccai").append("<div style='font-size:14px;font-weight:bold'>● Detected Labels (Video API - Detect Objects):</div>");
			var annotations = "<table style='font-size:13px;background-color:#eee;width:100%;'>";
			annotations += "<tr><th style='width:300px;'>Label</th><th style='width:150px;'>Start Time</th><th style='width:150px;'>End Time</th></tr>";
			message.ccai.segmentLabelAnnotations.forEach((label) => {
				//console.log(label.entity.description + " at ");
				label.segments.forEach(segment => {
					segment = segment.segment;
					if (segment.startTimeOffset.seconds === undefined) {
						segment.startTimeOffset.seconds = 0;
					}
					if (segment.startTimeOffset.nanos === undefined) {
						segment.startTimeOffset.nanos = 0;
					}
					if (segment.endTimeOffset.seconds === undefined) {
						segment.endTimeOffset.seconds = 0;
					}
					if (segment.endTimeOffset.nanos === undefined) {
						segment.endTimeOffset.nanos = 0;
					}
					annotations += `<tr><td><a onclick='openWikiFrame(\"${label.entity.description}\");'><font color=blue>${label.entity.description}</font></a></td><td>${segment.startTimeOffset.seconds}.${(segment.startTimeOffset.nanos / 1e6).toFixed(0)}s</td><td>${segment.endTimeOffset.seconds}.${(segment.endTimeOffset.nanos / 1e6).toFixed(0)}s</td></tr>`;
				});
			});
			annotations += "</table>";
			$("#ccai").append(`<div style='padding:10px;font-size:13px;background-color:#eee;'>${annotations}</div>`);
			$("#ccai").append("<br/>");
		}

		if (message.ccai.transcription && message.ccai.transcription.length) {
			$("#ccai").append("<div style='margin-bottom:5px;font-size:14px;font-weight:bold'>● Transcript (Speech API - Video Transcript):</div>");
			$("#ccai").append(`<div style='padding:10px;font-size:13px;color:blue;background-color:#eee;'>${message.ccai.transcription}</div>`);
			$("#ccai").append("<br/>");
			$("#transcription").empty().append(`<div style='padding:10px;font-size:13px;color:blue;background-color:#eee;'>${message.ccai.transcription}</div>`);
		}

		if (message.ccai.texts && message.ccai.texts.length) {
			$("#ccai").append("<div style='margin-bottom:5px;font-size:14px;font-weight:bold'>● Detected Text (Vision API - OCR):</div>");
			$("#ccai").append(`<div style='padding:10px;font-size:17px;font-weight:bold;color:blue;background-color:#eee;'>${message.ccai.texts[0].text}</div>`);
			$("#ccai").append("<br/>");
			
			$("#ccai_data").empty().append(`<h5>${message.ccai.texts[0].text}</h5>`);
		}

		if (message.ccai.dialogflow && message.ccai.dialogflow.response !== "") {
			$("#ccai").append("<div style='margin-bottom:5px;font-size:14px;font-weight:bold'>● Topic Analysis (Natural Langage API/Dialogflow Intents/Entities- Detect Text Intent):</div>");
			$("#ccai").append(`<div style='padding:10px;font-size:13px;background-color:#eee;'>${message.ccai.dialogflow.queryText} <a onclick='openWebpageInFrame(\"${message.ccai.dialogflow.url}\")'><font color=blue> (${message.ccai.dialogflow.intent.displayName}) → ${message.ccai.dialogflow.fulfillmentText}</a></div>`);
			$("#ccai").append("<br/>");
		}

		if (message.ccai.translations && message.ccai.translations.length) {
			$("#ccai").append("<div style='margin-bottom:5px;font-size:14px;font-weight:bold'>● Translation (Natural Langage API - Translate Text):</div>");
			$("#ccai").append(`<div style='padding:10px;font-size:17px;color:blue;background-color:#eee;' >${message.ccai.translations[0].translatedText}</div>`);
			$("#ccai").append("<br/>");
			
			$("#ccai_output").empty().append(`<h5>${message.ccai.translations[0].translatedText}</h5>`);
		}

		/*
		if (message.ccai.syntax && message.ccai.syntax.tokens.length) {
		  $("#ccai").append("<div style='margin-bottom:5px;font-size:14px;font-weight:bold'>● Syntax (Natural Langage API - Analyze Text Syntax):</div>");
		  var syntax = "";
		  for (var i in message.ccai.syntax.tokens) {
			  syntax += `${(message.ccai.syntax.tokens[i].partOfSpeech.tag === "NOUN" ? 
				"<font color=blue>" + message.ccai.syntax.tokens[i].text.content + " </font>" :
				(message.ccai.syntax.tokens[i].partOfSpeech.tag === "VERB" ? 
				"<font color=red>" + message.ccai.syntax.tokens[i].text.content + " </font>" :
				"<font color=black>" + message.ccai.syntax.tokens[i].text.content + " </font>"))}`;
			}
		  $("#ccai").append(`<div style='padding:10px;font-size:13px;background-color:#eee;'>${syntax}</div>`);
		  $("#ccai").append("<br/>");
		}
		*/

		if (message.ccai.entitySentiment && message.ccai.entitySentiment.entities.length) {
			$("#ccai").append("<div style='margin-bottom:5px;font-size:14px;font-weight:bold'>● Entity and Sentiment (Natural Langage API - Detect Entity and Sentiment):</div>");
			var entities = "<table style='font-size:13px;background-color:#eee;width:100%;'>";
			entities += "<tr><th style='width:300px;'>Entity</th><th style='width:200px;'>Type</th><th style='width:100px;text-align:center;'>Salience</th><th style='width:100px;text-align:center;'>Magnitude</th><th style='width:100px;text-align:center;'>Score</th></tr>";
			message.ccai.entitySentiment.entities.forEach((entity) => {
				entities += "<tr>";
				entities += (entity.metadata.wikipedia_url !== undefined ?
					`<td style='width:300px;'><a onclick='openWebpageInFrame(\"${entity.metadata.wikipedia_url}\")'><font color=blue>${entity.name} (${entity.metadata.wikipedia_url})</font></a></td>` :
					`<td style='width:300px;'><a onclick='openWikiFrame(\"${entity.name}\");'><font color=blue>${entity.name}</font></a></td>`);
				entities += `<td style='width:200px;'>${entity.type}</td>`;
				entities += `<td style='width:100px;text-align:center;'>${parseInt(parseFloat(entity.salience) * 100, 10)}</td>`;
				entities += `<td style='width:100px;text-align:center;'>${parseInt(parseFloat(entity.sentiment.magnitude) * 100, 10)}</td>`;
				entities += `<td style='width:100px;text-align:center;'>${parseInt(parseFloat(entity.sentiment.score) * 100, 10)}</td></tr>`;
			});
			entities += "</table>";
			$("#ccai").append(`<div style='padding:10px;font-size:17px;background-color:#eee;'>${entities}</div>`);
			$("#ccai").append("</div>");
			$("#ccai").append("<br/>");
		}

		if (message.ccai.faces && message.ccai.faces.length) {
			$("#ccai").append("<div style='margin-bottom:5px;font-size:14px;font-weight:bold'>● Detected Face Emotion (Vision API - Detect Face Emotion):</div>");
			var faces = "";
			message.ccai.faces.forEach((face) => {
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
			$("#ccai").append(`<div style='padding:10px;font-size:17px;background-color:#eee;'>${faces}</div>`);
			$("#ccai").append("<br/>");
		}

		if (message.ccai.labels && message.ccai.labels.length) {
			$("#ccai").append("<div style='margin-bottom:5px;font-size:14px;font-weight:bold'>● Detected Labels (Vision API - Detect Objects):</div>");
			var labels = "<table style='font-size:13px;background-color:#eee;width:100%;'>";
			labels += "<tr><th style='width:300px;'>Label</th></tr>";
			message.ccai.labels.forEach((label) => {
				labels += `<tr><td><a onclick='openWikiFrame(\"${label.description}\");'><font color=blue>${label.description}</font></a></td></tr>`;
			});
			labels += "</table>";
			$("#ccai").append(`<div style='padding:10px;font-size:17px;background-color:#eee;'>${labels}</div>`);
			$("#ccai").append("<br/>");
		}

		if (message.ccai.logos && message.ccai.logos.length) {
			$("#ccai").append("<div style='margin-bottom:5px;font-size:14px;font-weight:bold'>● Detected Logo (Vision API - Detect Company/Organization):</div>");
			var logos = "<table style='font-size:13px;background-color:#eee;width:100%;'>";
			logos += "<tr><th style='width:300px;'>Logo</th></tr>";
			message.ccai.logos.forEach((logo) => {
				logos += `<tr><td><a onclick='openWikiFrame(\"${logo.description}\");'><font color=blue>${logo.description}</font></a></td></tr>`;
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
			$("#ccai").append(`<div style='padding:10px;font-size:17px;background-color:#eee;'>${logos}</div>`);
			$("#ccai").append("<br/>");
		}

		if (message.ccai.landmarks && message.ccai.landmarks.length) {
			$("#ccai").append("<div style='margin-bottom:5px;font-size:14px;font-weight:bold'>● Detected Landmarks (Vision API - Detect Landmark Objects/Geographic Locations):</div>");
			var landmarks = "<table style='font-size:13px;background-color:#eee;width:100%;'>";
			landmarks += "<tr><th style='width:300px;'>Landmark</th><th style='width:100px;'>Confidence</th></tr>";
			message.ccai.landmarks.forEach((landmark) => {
				landmarks += `<tr><td><a onclick='openWikiFrame(\"${landmark.description}\");'><font color=blue>${landmark.description}</font></a></td><td><font color=red>${parseInt(parseFloat(landmark.score) * 100, 10)}％</font></td></tr>`;
				imagePad_line(
					landmark.boundingPoly.vertices[0].x, landmark.boundingPoly.vertices[0].y,
					landmark.boundingPoly.vertices[1].x, landmark.boundingPoly.vertices[1].y);
				imagePad_line(
					landmark.boundingPoly.vertices[1].x, landmark.boundingPoly.vertices[1].y,
					landmark.boundingPoly.vertices[2].x, landmark.boundingPoly.vertices[2].y);
				imagePad_line(
					landmark.boundingPoly.vertices[2].x, landmark.boundingPoly.vertices[2].y,
					landmark.boundingPoly.vertices[3].x, landmark.boundingPoly.vertices[3].y);
				imagePad_line(
					landmark.boundingPoly.vertices[3].x, landmark.boundingPoly.vertices[3].y,
					landmark.boundingPoly.vertices[0].x, landmark.boundingPoly.vertices[0].y);
			});
			landmarks += "</table>";
			$("#ccai").append(`<div style='padding:10px;font-size:17px;background-color:#eee;'>${landmarks}</div>`);
			$("#ccai").append("<br/>");
		}

		if (message.ccai.recommends) {
			$("#recommends").show();
			$("#recommends").empty().append(message.ccai.recommends);
		}
	});

})(window, jQuery);
