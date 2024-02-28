((window) => {

	const Base64 = { encode: function(str) { return btoa(unescape(encodeURIComponent(str))); }, decode: function(str) { return decodeURIComponent(escape(atob(str))); } };
	window.Base64 = Base64;

	const getHtml = (file) => {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: file,
				type: 'GET',
				cache: "no-store",
				headers: { "Content-Type": "text/html; charset=UTF-8" },
				timeout: 5000,
				success: function(data) {
					resolve(data.replace(/\{\{/g, "<div id='").replace(/\}\}/g, "'></div>").replace(/\s{2}|\t\n/g, ''));
				},
				error: function(error) {
					console.error('Error retrieving html: ' + error.statusText);
					reject(error);
				}
			});
		});
	};
	window.getHtml = getHtml;

	const getJs = (URL) => {
		return new Promise((resolve) => {
			var element = document.createElement("script");
			element.src = URL;
			document.body.appendChild(element);
			element.onload = () => {
				resolve();
			}
		});
	};
	window.getJs = getJs;

	const sleep = (msec) => new Promise(resolve => setTimeout(resolve, msec));
	window.sleep = sleep;

	const rest_api_post = (url, data) => {
		const deferred = $.Deferred();
		$.ajax({
			url: `${url}`,
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
				deferred.reject(error);
			}
		});
		return deferred.promise();
	};
	window.rest_api_post = rest_api_post;

	const rest_api_get = (url) => {
		const deferred = $.Deferred();
		$.ajax({
			url: `${url}`,
			method: 'GET',
			cache: false,
			dataType: 'json',
			timeout: 5000,
			success: (data) => {
				//console.log(`[rest_api_post] success ${JSON.stringify(data)}`);
				deferred.resolve(data);
			},
			error: (error) => {
				//console.log(`[rest_api_post] error ${error.statusText}`);
				deferred.reject(error);
			}
		});
		return deferred.promise();
	};
	window.rest_api_get = rest_api_get;

})(window);
