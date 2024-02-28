((window) => {

	const create_engagement_analysis_html = (data) => {
		var engagement_analysis_html = "";
		data.forEach((item, index) => {
			engagement_analysis_html += `
			<div style="width:100%;height:auto;display:inline-box;">
			<div style="float:left;width:15%;height:30px;padding:10px;font-weight:bold;background-color:#eee;">日時</div>
			<div style="float:left;width:15%;height:30px;padding:10px;font-weight:bold;background-color:#eee;">イベント</div>
			<div style="float:left;width:30%;height:30px;padding:10px;font-weight:bold;background-color:#eee;">トピック・インテント</div>
			<div style="float:left;width:20%;height:30px;padding:10px;font-weight:bold;background-color:#eee;">アクション・ゴール</div>
			<div style="float:left;width:20%;height:30px;padding:10px;font-weight:bold;background-color:#eee;">結果・達成度</div>
			</div>
			<div style="width:100%;height:auto;display:inline-box;">
			<div id="datetime_${index}" style="float:left;width:15%;height:40px;padding:10px;border:solid 1px #eee;">${item.datetime}</div>
			<div id="event_${index}" style="float:left;width:15%;height:40px;padding:10px;border:solid 1px #eee;">${item.event}</div>
			<div id="topic_${index}" style="float:left;width:30%;height:40px;padding:10px;border:solid 1px #eee;">${item.topic}</div>
			<div id="action_${index}" style="float:left;width:20%;height:40px;padding:10px;border:solid 1px #eee;">${item.action}</div>
			<div id="result_${index}" style="float:left;width:20%;height:40px;padding:10px;border:solid 1px #eee;">${item.result}</div>
			</div>
			<div style="width:100%;height:auto;display:inline-box;">
			<div style="float:left;width:10%;height:auto;padding:10px;background-color:#fff;"><font style="color:#333;font-weight:bold;">お客様</font></div>
			<div id="context_${index}" style="float:left;width:90%;height:auto;padding:10px;background-color:#eee;"><font style="color:blue;">${item.context}</font></div>
			</div>
			<div style="width:100%;height:auto;display:inline-box;">
			<div style="float:left;width:10%;height:auto;padding:10px;background-color:#fff;"><font style="color:#333;font-weight:bold;">ワード</font></div>
			<div id="keywords_${index}" style="float:left;width:90%;height:auto;padding:10px;background-color:#fff;"><font style="color:blue;">${item.keywords}</font></div>
			</div>
			`;
		});
		return engagement_analysis_html;
	}

	window.create_engagement_analysis_html = create_engagement_analysis_html;

})(window);