((window, $) => {

	const create_engagement_analysis_chart1_html = (data) => {
		const engagementstrategy_overview_chart_data = data;
		var ctx = document.getElementById('myChart').getContext('2d');
		var myChart = new Chart(ctx, {
			type: 'radar',
			data: {
				labels: ['プロモーション', '新製品紹介', 'サブスクリプション', 'サービス契約', '各種案内', '使い方説明', '不具合対応'],
				datasets: [{
					label: '顧客の期待（顧客状況要求）',
					backgroundColor: 'rgba(0, 0, 255, 0.2)',
					borderColor: 'rgba(0, 0, 255, 0.2)',
					pointBackgroundColor: 'rgba(0, 0, 255, 0.2)',
					data: engagementstrategy_overview_chart_data[0]
				}, {
					label: '誘導の方向（ビジネス戦略）',
					backgroundColor: 'rgba(0, 255, 0, 0.2)',
					borderColor: 'rgba(0, 255, 0, 0.2)',
					pointBackgroundColor: 'rgba(0, 255, 0, 0.2)',
					data: engagementstrategy_overview_chart_data[1]
				}, {
					label: '実際の対応状況（現在）',
					backgroundColor: 'rgba(255, 0, 0, 0.2)',
					borderColor: 'rgba(255, 0, 0, 0.2)',
					pointBackgroundColor: 'rgba(255, 0, 0, 0.2)',
					data: engagementstrategy_overview_chart_data[2]
				},]
			},
			options: {
				legend: {
					position: 'top',
				},
				title: {
					display: false,
					text: 'Chart.js Radar Chart'
				},
				scale: {
					ticks: {
						beginAtZero: true
					}
				}
			}
		});
	};
	window.create_engagement_analysis_chart1_html = create_engagement_analysis_chart1_html;

})(window, jQuery);