(async (window, $) => {
	$("#saveSettings").click(async () => {
		const settings = {
			agentId: $("#agentId").val(),
			languageCode: $("#languageCode").val(),
			useDialogflow: $("#useDialogflow").prop('checked'),
			transLangCode: $("#transLangCode").val(),
			useTranslation: $("#useTranslation").prop('checked'),
			llm: JSON.parse($("#llm").val())
		};
		await rest_api_post('../postSettings?key=1', { data: Base64.encode(JSON.stringify(settings)) }).then((resp) => {
			console.log(resp);
		}).catch(e => { console.error(e); });
		$('#settings').hide();
	});

	$("#openSettings").click(async () => {
		$('#settings').show();
		await rest_api_get('../getSettings?key=1').then((resp) => {
			const settings = JSON.parse(Base64.decode(resp.data));
			console.log(settings);
			$("#agentId").val(settings.agentId);
			$("#languageCode").val(settings.languageCode);
			$("#useDialogflow").prop('checked', settings.useDialogflow);
			$("#transLangCode").val(settings.transLangCode);
			$("#useTranslation").prop('checked', settings.useTranslation);
			$("#llm").val(JSON.stringify(settings.llm));
		}).catch(e => { console.error(e); });
	});

})(window, jQuery);
