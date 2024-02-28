(async (window, $) => {

const imagePad = {
	canvas: document.getElementById("imagePad"),
	context: document.getElementById("imagePad").getContext("2d"),
	mouse: { mouseDown: false, currPosition: { x: 0, y: 0 }, lastPosition: { x: 0, y: 0 } },
	org_src: null,
	src: null,
	rect: { left: 0, top: 0, width: 0, height: 0 },
	pen_color: "#00f"
};

const sendMediaDataToFile = (contactId, file, id) => {
	const deferred = $.Deferred();
	const data = { contactId: contactId, file: file, data: document.getElementById(id).toDataURL("image/png") };
	$.ajax({
		url: `../postMediaDataToFile`,
		method: 'POST',
		cache: false,
		dataType: 'json',
		data: data,
		timeout: 5000,
		success: (data) => {
			console.log(`[sendFileData] success ${JSON.stringify(data)}`);
			deferred.resolve(data);
		},
		error: (error) => {
			console.log(`[sendFileData] error ${error.statusText}`);
			deferred.reject(error.statusText);
		}
	});
	return deferred.promise();
};

function resetImagePad() {
	imagePad.canvas.width = window.innerWidth;
	imagePad.canvas.height = window.innerWidth * 0.8;
	imagePad.canvas.getContext("2d").clearRect(0, 0, imagePad.canvas.width, imagePad.canvas.height);
}

$("#sendImage").click(async () => {
	sendMediaDataToFile(cmsp.client.contactId, `${Date.now()}.png`, "imagePad");
	resetImagePad();
	$('#imageform').hide();
});

document.getElementById("fileUpload").addEventListener("change", async (e) => {
	if (e.target.files[0].type.match("video.*")) {
		const file = `${_MMDDHHSS()}.mov`;
		await sendMediaDataToFile(_header(cmsp.client), file, "imagePad").then(() => {
			;
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
			;
		});
	}
	document.getElementById("fileUpload").value = "";
});

const imageDropTarget = document.getElementById("sendImages");
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
			;
		});
	}
	reader.readAsDataURL(e.dataTransfer.files[0]);
});

imagePad.canvas.addEventListener("touchstart", (e) => {
	// e || event.changedTouches[0];
	var rect = imagePad.canvas.getBoundingClientRect();
	console.log(`rect ${JSON.stringify(rect)}`);
	imagePad.rect = { left: Math.floor(rect.left), top: Math.floor(rect.top), right: Math.floor(rect.right), bottom: Math.floor(rect.bottom), width: Math.floor(rect.width), height: Math.floor(rect.height) };
	console.log(`imagePad.rect left: ${imagePad.rect.left} top: ${imagePad.rect.top} with:${imagePad.rect.width} height:${imagePad.rect.height}`);
	console.log(`e clientX:${e.touches[0].clientX} clientY:${e.touches[0].clientY}`);
	imagePad.mouse.currPosition = { x: (e.touches[0].clientX - imagePad.rect.left), y: (e.touches[0].clientY - imagePad.rect.top) };
	imagePad.mouse.lastPosition = imagePad.mouse.currPosition;
	imagePad.mouse.mouseDown = true;
}, false);

window.imagePad_circle = (x, y) => {
	imagePad.context.beginPath();
	imagePad.context.arc(x, y, 20, 0, 2 * Math.PI);
	imagePad.context.strokeStyle = '#222';
	imagePad.context.lineWidth = 2.0;
	imagePad.context.stroke();
}

window.imagePad_line = (x1, y1, x2, y2) => {
	imagePad.context.beginPath();
	imagePad.context.moveTo(x1, y1);
	imagePad.context.lineTo(x2, y2);
	imagePad.context.strokeStyle = '#222';
	imagePad.context.lineWidth = 4.0;
	imagePad.context.stroke();
}

imagePad.canvas.addEventListener("touchmove", (e) => {
	if (!imagePad.mouse.mouseDown) {
		return;
	}
	imagePad.mouse.currPosition = { x: (e.touches[0].clientX - imagePad.rect.left), y: (e.touches[0].clientY - imagePad.rect.top) };
	console.log(`imagePad.mouse.currPosition x:${imagePad.mouse.currPosition.x} y:${imagePad.mouse.currPosition.y}`);
	if (imagePad.mouse.currPosition.x <= 4 || imagePad.mouse.currPosition.y <= 4 || imagePad.mouse.currPosition.x >= imagePad.rect.width - 4 || imagePad.mouse.currPosition.y >= imagePad.rect.height - 4) {
		imagePad.src = document.getElementById("imagePad").toDataURL();
		imagePad.mouse.mouseDown = false;
		return;
	}
	imagePad_line(
		((imagePad.mouse.lastPosition.x / imagePad.rect.width) * imagePad.canvas.width), ((imagePad.mouse.lastPosition.y / imagePad.rect.height) * imagePad.canvas.height),
		((imagePad.mouse.currPosition.x / imagePad.rect.width) * imagePad.canvas.width), ((imagePad.mouse.currPosition.y / imagePad.rect.height) * imagePad.canvas.height)
	);
	imagePad.mouse.lastPosition = imagePad.mouse.currPosition;
}, false);

imagePad.canvas.addEventListener("touchend", () => {
	imagePad.src = document.getElementById("imagePad").toDataURL();
	imagePad.mouse.mouseDown = false;
}, false);


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
	imagePad_line(
		((imagePad.mouse.lastPosition.x / imagePad.rect.width) * imagePad.canvas.width), ((imagePad.mouse.lastPosition.y / imagePad.rect.height) * imagePad.canvas.height),
		((imagePad.mouse.currPosition.x / imagePad.rect.width) * imagePad.canvas.width), ((imagePad.mouse.currPosition.y / imagePad.rect.height) * imagePad.canvas.height)
	);
	imagePad.mouse.lastPosition = imagePad.mouse.currPosition;
}, false);

imagePad.canvas.addEventListener("mouseup", () => {
	imagePad.src = document.getElementById("imagePad").toDataURL();
	imagePad.mouse.mouseDown = false;
}, false);


$("#openImageform").click(async () => {
	resetImagePad();
	$('#imageform').show();
});

$("#closeImageform").click(async () => {
	resetImagePad();
	$('#imageform').hide();
});
	
})(window, jQuery);

