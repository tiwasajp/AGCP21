((window, $) => {

		const journeymap_data = [
			{ channel: "map_voice", datetime: "", refer_to: "", comment: "" },
			{ channel: "map_v_bot", datetime: "", refer_to: "", comment: "" },
			{ channel: "map_website", datetime: "", refer_to: "", comment: "" },
			{ channel: "map_shop", datetime: "", refer_to: "", comment: "" },
			{ channel: "map_LINE", datetime: "", refer_to: "", comment: "" },
			{ channel: "map_LINE", datetime: "", refer_to: "", comment: "" },
		];
		var journeymap_html = "";
		journeymap_data.forEach((item, index) => {
			if (item.channel === "map_voice") {
				journeymap_html += `<div id="cj_voice_${index}" class="aoc-voice" style="position:absolute;left:${(100 + index * 50)}px;top:10px;width:25px;height:25px;padding:2px 5px 5px 2px;font-size:18px;color:#fff;border:#444;border-radius:25px;background-color:#444;"></div>`;
			}
			else if (item.channel === "map_v_bot") {
				journeymap_html += `<div id="cj_v_bot_${index}" class="aoc-robot" style="position:absolute;left:${(100 + index * 50)}px;top:50px;width:25px;height:25px;padding:2px 5px 5px 4px;font-size:20px;color:#fff;border:#f00;border-radius:25px;background-color:#f00;"></div>`;
			}
			else if (item.channel === "map_website") {
				journeymap_html += `<div id="cj_website_${index}" class="aoc-custom03" style="position:absolute;left:${(100 + index * 50)}px;top:90px;width:25px;height:25px;padding:2px 5px 5px 4px;font-size:20px;color:#fff;border:#00f;border-radius:25px;background-color:#00f;"></div>`;
			}
			else if (item.channel === "map_vomap_shopice") {
				journeymap_html += `<div id="cj_shop_${index}" class="aoc-business" style="position:absolute;left:${(100 + index * 50)}px;top:130px;width:25px;height:25px;padding:2px 5px 5px 4px;font-size:18px;color:#fff;border:#555;border-radius:25px;background-color:#555;"></div>`;
			}
			else if (item.channel === "map_LINE") {
				journeymap_html += `<div id="cj_LINE_${index}" class="aoc-sentiment-very-happy" style="position:absolute;left:${(100 + index * 50)}px;top:170px;width:25px;height:25px;padding:0px 5px 8px 3px;font-size:20px;color:#fff;border-radius:25px;background-color:#4d2;"></div>`;
			}
		});
		
		window.journeymap_html = journeymap_html;

})(window, jQuery);
