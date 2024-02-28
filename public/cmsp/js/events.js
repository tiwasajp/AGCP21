// Tomohiro Iwasa, Avaya Japan, 2017-2022
// Updated: 20220808

((window) => {
	'use strict';

	function EventManager() {
		this.events = {};  // {key1:[func1, func2, ...], ...}
		this.stats = { count: 0, time: {}, log: [] };
	}

	EventManager.prototype = {
		init: function() {
			this.events = {};
			this.stats = { count: 0, time: {}, log: [] };
		},
		launch: function(key, args) {
			if (!this.events[key]) {
				return;
			}
			this.events[key].forEach(event => {
				//console.log(`EventManager execute ${key} ${event.id}`);
				event.func(args);
			});
		},
		action: function(key, func) {
			if (!this.events[key]) {
				this.events[key] = [];
			}
			let id = this.stats.count++;
			this.events[key].push({ id: id, func: func });
			//console.log(`EventManager registered ${key} ${JSON.stringify(this.events[key])}`);
			return id;
		},
		remove: function(key, id) {
			const targets = [];
			this.events[key].forEach((event) => {
				if (event.id !== id) {
					targets.push(event);
					return;
				}
			});
			this.events[key] = targets;
			//console.log(`EventManager unregistered ${key} ${id} ${JSON.stringify(this.events[key])}`);
		},
	};

	window.EventManager = EventManager;

})(window);
