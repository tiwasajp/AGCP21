// Tomohiro Iwasa, Avaya Japan, 2017-2022
// Updated: 20220811

(async (window, $) => {
	'use strict';

	$("#AnswerCall").click((e) => {
		$.get(`/AnswerCall`, (data) => {
			console.log(JSON.stringify(data));
		}).fail((error) => {
			console.error(error);
		});
	});

	$("#getDeviceInfo").click((e) => {
		$.get(`/getDeviceInfo`, (data) => {
			$("#DeviceInfo").text(JSON.stringify(data));
			console.log(JSON.stringify(data));
		}).fail((error) => {
			console.error(error);
		});
	});

})(window, jQuery);
