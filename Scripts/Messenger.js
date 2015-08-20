var Messenger = (function() {
	
	function Messenger() {
		this.loadQuene = [];
	}

	Messenger.prototype = {
		addImage: function(name, src) {
			this.loadQuene.push({
				type: "image",
				src: src,
				name: name
			});
		},
		addSound: function(name, src) {
			this.loadQuene.push({
				type: "sound",
				src: src,
				name: name
			});
		},
		addFont: function(name, src) {
			this.loadQuene.push({
				type: "font",
				src: src,
				name: name
			});
		},
		addScript: function(name, src) {
			this.loadQuene.push({
				type: "script",
				src: src,
				name: name
			});
		},
		addResource: function(type, name, src) {
			if (type === "image") {
				this.addImage(name, src);
			} else if (type === "sound") {
				this.addSound(name, src);
			} else if (type === "font") {
				this.addFont(name, src);
			} else if (type === "script") {
				this.addScript(name, src);
			}
		},
		load: function() {
			for (var i = 0; i < this.loadQuene.length; i ++) {

			}
		}
	}



	/*
	{
		src
		loadstart
		loadend
		timeout
		abort
		load
		timeout
		error
		progress
		type
	}
	*/
	Messenger.request = function(cfg) {
		var request = new XMLHttpRequest();
		request.onloadstart = cfg.loadStart;
		request.onloadend = cfg.loadEnd;
		request.ontimeout = cfg.timeout;
		request.onabort = cfg.abort;
		request.ontimeout = cfg.timeout;
		request.onerror = cfg.error;
		request.onprogress = cfg.progress;
		request.open(cfg.type, cfg.src);
	}



	return Messenger;
})();

Messenger.request({
	type: "GET",
	src: "Styles/main.css",
	load: function() {
		for (var i = 0; i < arguments.length; i ++) {
			console.log(arguments[i]);
		}
	}
})