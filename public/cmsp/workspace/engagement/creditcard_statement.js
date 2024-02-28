((window, $) => {

	var creditcard_statement = `
		< div class="neo-table--sticky" style = "height: 500px;" >
			<table class="neo-table">
				<thead>
					<tr>
						<th class="check"><input class="neo-check" type="checkbox"
							id="stickytablecheckbox1" role="checkbox" aria-checked="false"
							value="stickytablecheckbox1" /><label for="stickytablecheckbox1"></label></th>
						<th>詳細</th>
						<th>項目</th>
						<th>利用金額</th>
						<th>利用場所</th>
						<th>通貨</th>
						<th>注意</th>
						<th>更新</th>
					</tr>
				</thead>
				<tbody>__TABLE_CREDITCARD_RECORDS__
				</tbody>
			</table>
		</div >
		<script>
			$("#share_statement").click(() => {
				socket.emit("data", { header: header(cmsp.client), body: { media: { type: "image", src: "images/AvayaCard_statement.png" } } });
			});
		</script>`;

	const creditcard_records = [
		{ check: "", details: "", item: "パソコン", amount: "156,000", place: "セントラルワールド", currency: "", remark: "", update: "" },
		{ check: "", details: "", item: "ランチ", amount: "12,000", place: "ハンサーホテル", currency: "", remark: "", update: "" },
		{ check: "", details: "", item: "プレゼント", amount: "24,000", place: "エンポリウムプロンポン", currency: "", remark: "", update: "" },
		{ check: "", details: "", item: "ゴルフクラブ", amount: "287,000", place: "パッポン", currency: "", remark: "", update: "" },
		{ check: "", details: "", item: "ディナー", amount: "23,000", place: "アイコンサイアム", currency: "", remark: "", update: "" },
	];

	var table_creditcard_records = "";
	creditcard_records.forEach((item, index) => {
		table_creditcard_records += `
			<tr>
				<td id="creditcard_check"><input class="neo-check" type="checkbox"
					id="stickytablecheckbox2" role="checkbox" aria-checked="false"
					value="stickytablecheckbox2" /><label
					for="stickytablecheckbox2"></label></td>
				<td id="creditcard_details">
					<button
							class="expand neo-btn-square neo-btn-square-tertiary neo-btn-square-tertiary--info neo-icon-chevron-right"
							aria-expanded="false" aria-label="Expand Thomas"></button>
				</td>
				<td id="creditcard_item">${item.item}</td>
				<td id="creditcard_amount" "class="number">${item.amount}</td>
				<td id="creditcard_place">${item.place}</td>
				<td id="creditcard_currency">
					<figure class="neo-avatar neo-avatar--small" data-initials="￥"></figure>
				</td>
				<td id="creditcard_remark"><span class="neo-icon-error"
					aria-label="error"></span></td>
				<td id="creditcard_update">
				<button
					class="neo-btn-square neo-btn-square-tertiary neo-btn-square-tertiary--info neo-icon-refresh"
					aria-label="refresh"></button>
				</td>
			</tr>`;
	});
	window.creditcard_statement_html = creditcard_statement.replace("__TABLE_CREDITCARD_RECORDS__", table_creditcard_records);

})(window, jQuery);