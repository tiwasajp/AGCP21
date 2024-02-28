((window, $) => {

	const create_engagements_list_html = (data) => {
		var engagements_tr = "";
		data.forEach((item, index) => {
			engagements_tr += `<tr id="cj_data${index}" style="font-weight:bold;color:#888;"><td>${item.datetime}</td><td>${item.event}</td><td>${item.topic}</td><td>${item.action}</td><td>${item.result}</td></tr>`;
		});
		return `<div style="float: left; width: 100%; height: 100%; border: solid 1px #ddd; overflow-y: auto;"><table class="neo-table neo-table--bordered" style="font-size:12px;"><thead><tr><th style="width:20%;">日時</th><th style="width:20%;">イベント</th><th style="width:25%;">トピック（インテント）</th><th style="width:25%;">アクション（ゴール）</th><th style="width:10%;">結果</th></tr></thead><tbody>${engagements_tr}</tbody></table></div>`;
	}
	window.create_engagements_list_html = create_engagements_list_html;

})(window, jQuery);
