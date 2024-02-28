(async (window, $) => {
	$("#saveSettings").click(async () => {
		const settings = { agentId: $("#agentId").val(), languageCode: $("#languageCode").val(), transLangCode: $("#transLangCode").val(), accountId: $("#accountId").val(), providerId: $("#providerId").val(), clientId: $("#clientId").val(), clientSecret: $("#clientSecret").val() };
		await rest_api_post('../postClientSettings', { data: Base64.encode(JSON.stringify(settings)) }).then((resp) => {
			console.log(resp);
		}).catch(e => { console.error(e); });
		$('#settings').hide();
	});

	$("#openSettings").click(async () => {
		$('#settings').show();
		await rest_api_get('../getClientSettings').then((resp) => {
			const settings = JSON.parse(Base64.decode(resp.data));
			console.log(settings);
			$("#agentId").val(settings.agentId);
			$("#languageCode").val(settings.languageCode);
			$("#transLangCode").val(settings.transLangCode);
			$("#accountId").val(settings.accountId);
			$("#providerId").val(settings.providerId);
			$("#clientId").val(settings.clientId);
			$("#clientSecret").val(settings.clientSecret);
		}).catch(e => { console.error(e); });
	});
})(window, jQuery);
