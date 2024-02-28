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

})(window);
