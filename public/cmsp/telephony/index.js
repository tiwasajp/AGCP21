(async (window, $) => {
	'use strict';

	window.socket = io.connect();

	location.queryString = {};
	location.search.substr(1).split('&').forEach(queryParamWithValue => {
		if (queryParamWithValue === '') return;
		var queryParam = queryParamWithValue.split('=');
		$('#' + queryParam[0]).val(queryParam[1]);
		location.queryString[queryParam[0]] = queryParam[1];
	});

	function updateQueryString() {
		if (location.queryString) {
			const keyValueArray = Object.entries(location.queryString).map(([key, value]) => {
				return key + '=' + value;
			});
			const newQueryString = keyValueArray.reduce((total, currentValue) => {
				const splitAmpersand = total === '' ? '' : '&';
				return total + splitAmpersand + currentValue;
			}, '')
			const newUrlOriginPath = location.origin + location.pathname;
			const queryStringSlash = !newUrlOriginPath.includes('/') ? '/' : '';
			const newUrl = newUrlOriginPath + queryStringSlash + '?' + newQueryString;
			history.pushState({}, 'Rewrite URL with updated query params', newUrl);
		}
	}

	const rest_api_post = (url, data) => {
		const deferred = $.Deferred();
		$.ajax({
			url: `https://demo.avayaphone.net/${url}`,
			method: 'POST',
			cache: false,
			dataType: 'json',
			data: data,
			timeout: 5000,
			success: (data) => {
				//console.log(`[rest_api_post] success ${JSON.stringify(data)}`);
				deferred.resolve(data);
			},
			error: (error) => {
				//console.log(`[rest_api_post] error ${error.statusText}`);
				deferred.reject(error.statusText);
			}
		});
		return deferred.promise();
	};

	$("#request1").click(async () => {
		var str = $("#message1").val().replace(/^s+|s+$|\n/g, '');
		$("#message1").val(str);
		await rest_api_post("TelephonyRequest", { data: Base64.encode(str) }).then((result) => { console.log(`${JSON.stringify(result)}`); });
	});

	$("#clear1").click(async () => {
		$("#message1").val("");
	});

	const TSREQS = [
		'{ "OPEN_STREAM": { "Server": "AVAYA#CM1#CSTA#AES1", "Username": "tiwasa", "Password": "N@da2114" } }',
		'{ "CLOSE_STREAM": "" }',
		'{ "ROUTE_REGISTER_REQ": { "VDN": "23901" } }',
		'{ "MONITOR_DEVICE": { "Extension": "20001" } }',
		'{ "STOP_MONITOR_DEVICE": { "Extension": "20001" } }',
		'{ "MAKE_CALL": { "Extension": "20001", "DialingNumber": "20014", "UUI": "abc123" } }',
		'{ "ANSWER_CALL": { "Extension": "20001" } }',
		'{ "HOLD_CALL": { "Extension": "20001" } }',
		'{ "RETRIEVE_CALL": { "Extension": "20001" } }',
		'{ "DROP_CALL": { "Extension": "20001", "UUI": "abc123" } }',
		'{ "SET_AGENT_STATE": { "Extension": "20001", "AgentId": "21001", "Password": "21001", "AgentMode": 1, "WorkMode": 1, "ReasonCode": 1 } }',
		'{ "GET_AGENT_STATE": { "AgentId": "21001" } }',
		'{ "MONITOR_HUNTGROUP": { "HuntGroupId": "21001" } }',
		'{ "STOP_MONITOR_HUNTGROUP": { "HuntGroupId": "21001" } }',
		'{ "GET_ACDSPLIT_INFO": { "HuntGroupId": "21001" } }',
	];


	const userId = "30001";

	window.onload = async (e) => {
		console.log(`[INFO] window.onload ${JSON.stringify(e)}`);
		if (userId) {
			socket.emit("session", { action: "join", userId: userId, password: "", type: "admin" });
		}
		for (var i in TSREQS) {
			$("#tsreqs").append(`<span onclick='$("#message1").val(${JSON.stringify(TSREQS[i])});'><p>${TSREQS[i]}</p></span>`);
			console.log(TSREQS[i]);
		}
	};

	socket.on("event", (message) => {
		console.log(`[socket.on(event)] ${JSON.stringify(message)}`);
		var message = JSON.stringify(message);
		message = message.replace("EVENT", "<b>EVENT</b>");
		message = message.replace("\"STATISTICS", "<br/>\"<b>STATISTICS</b>");
		message = message.replace("\"APPEARANCES", "<br/>\"<b>APPEARANCES</b>");
		message = message.replace("\"HUNTGROUP", "<br/>\"<b>HUNTGROUP</b>");
		message = message.replace("\"AGENTSTATE", "<br/>\"<b>AGENTSTATE</b>");
		$("#events").append(`<p>${message}</p>`);
		$("#events").animate({ scrollTop: $("#events")[0].scrollHeight }, "normal");
	});

})(window, jQuery);
