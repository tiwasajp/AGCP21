// Tomohiro Iwasa, Avaya Japan, 2017-2022
// Updated: 20220811

(async (window, $) => {
	'use strict';

	events.action("event", async (message) => {
		console.log(`[events.action("event")] ${JSON.stringify(message)}`);
		switch (message.body.type) {
			case "apply": {
				//await getHtml("engagement/form_sample.html").then((data) => { $("#engagement").empty().append(data); });
				break;
			}
			case "queued": {
				await getHtml("engagement/engagement.html").then((data) => { $("#engagement").empty().append(data); });
				await getJs("engagement/list.js");
				await getJs("engagement/analysis.js");
				await getJs("engagement/ccai.js");

				$(".neo-tabs__nav a").click((e) => {
					$("#item_1").removeClass("neo-tabs__item--active");
					$("#item_2").removeClass("neo-tabs__item--active");
					$("#item_3").removeClass("neo-tabs__item--active");
					$("#item_4").removeClass("neo-tabs__item--active");
					$("#item_5").removeClass("neo-tabs__item--active");
					$("#item_6").removeClass("neo-tabs__item--active");
					$("#item_" + (e.target.id).slice(-1)).addClass("neo-tabs__item--active");
					$("#tab_1").hide();
					$("#tab_2").hide();
					$("#tab_3").hide();
					$("#tab_4").hide();
					$("#tab_5").hide();
					$("#tab_6").hide();
					$("#tab_" + (e.target.id).slice(-1)).show();
					if ((e.target.id).slice(-1) === "1") {
						;
					}
					else if ((e.target.id).slice(-1) === "2") {
						const interaction_data = [
							{ datetime: "日時未定", event: "サポートセンタ", topic: "修理品受け渡し", action: "修理品引き取り", result: "未完了" },
							{ datetime: "日時未定", event: "LINEメッセージ", topic: "修理完了通知", action: "受け取り", result: "未完了" },
							{ datetime: "日時未定", event: "店舗訪問", topic: "サポートセンター", action: "修理品持ち込み", result: "未完了" },
							{ datetime: "2021-10-01<br/>16:35", event: "エージェント", topic: "新製品案内", action: "買い替え", result: "完了" },
							{ datetime: "2021-10-01<br/>16:30", event: "エージェント", topic: "修理希望", action: "修理条件確認・修理依頼", result: "完了" },
							{ datetime: "2021-10-01<br/>10:30", event: "Webアクセス", topic: "製品サポーページ", action: "修理方法", result: "閲覧" },
							{ datetime: "2021-10-01<br/>10:20", event: "Webアクセス", topic: "新製品案内", action: "買い替え検討", result: "閲覧" },
						];
						$("#engagements_list").empty().append(create_engagements_list_html(interaction_data));
						;
					}
					else if ((e.target.id).slice(-1) === "3") {
						const engagement_records = [
							{ datetime: "2020-10-01 16:05", event: "Webアクセス", topic: "新製品情報、製品サポート", action: "買い替え、修理", result: "未完", context: "メイン → 新製品情報（C2200) → メイン → 製品サポート → カメラができない → お問い合わせ → ボットサービス", keywords: "[新製品] [C2200] [製品サポート] [カメラ] [できない] [お問い合わせ] [ボットサービス]" },
							{ datetime: "2020-10-01 16:23", event: "ボイスボット", topic: "修理希望", action: "修理", result: "未完", context: "カメラの修理について聞きたいのですが？ シリアル番号入力：2104134827 お客様のカメラの機種はCOSMOS C1000、お客様のお名前は秋山龍之介様ですね。", keywords: "[新製品] [C2200] [製品サポート] [ズーム] [できない] [お問い合わせ] [ボットサービス]" },
							{ datetime: "2020-10-01 16:30", event: "エージェント対応", topic: "修理希望", action: "修理　修理条件確認", result: "未完", context: "カメラが壊れているようで困りました。2週間後の子供の運動会で使おうと思って。修理は間に合いますか？コスモスカメラのサポートセンターへ持ち込んでいただければ、１週間で修理することが可能です。お願いします。サポートセンターの場所はどこですか？ サポートセンターの場所をご案内します。お客様の住所は東京都港区高輪ですので、品川サポートセンターをご案内いたします。（案内地図送信", keywords: "[カメラ] [壊れている] [困り] [2週間後] [子供] [運動会] [使おう] [修理] [間に合い] [サポートセンター] [持ち込んで] [１週間] [修理] [可能]" },
							{ datetime: "2020-10-01 10:35", event: "エージェント対応", topic: "新製品案内", action: "買い替え", result: "未完", context: "ところでお客様、カメラ機能が充実した新製品が発売されます。被写体の動きに合わせたピントが改善されていて、運動会でご活躍されるお子様のより素晴らしい写真を撮ることができると思います。ご参考にどうぞ。（参考イメージ送信）ありがとう。参考にします。", keywords: "[案内] [新製品] [カメラ] [機能] [充実] [子供] [運動会] [興味] [参考]" },
							{ datetime: "2020-10-01 10:35", event: "エージェント対応", topic: "新製品案内", action: "買い替え", result: "未完", context: "ところでお客様、カメラ機能が充実した新製品が発売されます。被写体の動きに合わせたピントが改善されていて、運動会でご活躍されるお子様のより素晴らしい写真を撮ることができると思います。ご参考にどうぞ。（参考イメージ送信）ありがとう。参考にします。", keywords: "[案内] [新製品] [カメラ] [機能] [充実] [子供] [運動会] [興味] [参考]" },

						];
						$("#engagement_analysis").empty().append(create_engagement_analysis_html(engagement_records));
						const chart_data = [[20, 50, 30, 50, 70, 80, 50], [90, 80, 70, 60, 50, 40, 20], [20, 30, 30, 20, 50, 30, 80]];
						getHtml("engagement/chart1.js").then((data) => { eval(data); create_engagement_analysis_chart1_html(chart_data); });
						//getHtml("engagement/creditcard_statement.js").then((data) => { $("#creditcard_statement").empty().append(data); });
						;
					}
					else if ((e.target.id).slice(-1) === "4") {
						;
					}
					else if ((e.target.id).slice(-1) === "5") {
						;
					}
					else if ((e.target.id).slice(-1) === "6") {
						//getMessages();
					}
				});
				await getHtml("engagement/agent_assist.html").then((data) => { $("#agent_assist").empty().append(data) });
				/*
				await getHtml("engagement/customer_profile.html").then((data) => { $("#customer_profile").empty().append(data) });
				var attributes = { customer_type: "既存顧客", identification: "51233212", contact_number: "20000", contact_reason: "契約", attributes: "契約,日本語", remark: "" };
				$("#profile_customer_type").text(attributes.customer_type);
				$("#profile_identification").text(attributes.identification);
				$("#profile_contact_number").text(attributes.contact_number);
				$("#profile_contact_reason").text(attributes.contact_reason);
				$("#profile_attributes").text(attributes.attributes);
				$("#profile_remark").text(attributes.remark);
				*/
				await getHtml("engagement/registration_form.html").then((data) => { $("#registration_form").empty().append(data) });
				$("#open-account-completion").click(() => {
					const element = document.getElementById("open_account_request_form");
					const option = {
						margin: 1,
						filename: 'open-account.pdf',
						image: { type: 'png', quality: 1 },
						html2canvas: { scale: 2, useCORS: true },
						jsPDF: { format: 'a2', orientation: 'portrait' },
					};
					html2pdf().from(element).set(option).save().then(() => { console.log('pdf generated'); }).catch((e) => { console.log(e); });
					events.launch('emit_data', { header: header(cmsp.client), body: { media: { type: "msg", } } });
				});

				break;
			}
			case "picked": {
				if (cmsp.client.userId === message.body.agentId) {
					//$("#timeContacted").html(`${(new Date()).getFullYear()}-${('0' + ((new Date()).getMonth() + 1)).slice(-2)}-${('0' + (new Date()).getDate()).slice(-2)} ${('0' + (new Date()).getHours()).slice(-2)}:${('0' + (new Date()).getMinutes()).slice(-2)}:${('0' + (new Date()).getSeconds()).slice(-2)}`);
					;
				}
				else {
					cmsp.client.room = "";
				}
				if (message.header.mode === "card") {
					;
				}
				break;
			}
			case "customerDropped": {
				cmsp.client.room = "";
				break;
			}
			case "agentDropped": {
				cmsp.client.room = "";
				break;
			}
		}
	});

})(window, jQuery);
