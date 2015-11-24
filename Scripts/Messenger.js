var Messenger = (function() {
	
	var loaders = {
		image: function(data, messenger) {
			var img = new Image();
			img.addEventListener("load", function() {
				messenger.resources[data.name] = img;
				messenger._numLoaded += 1;
				if (messenger._numLoaded >= messenger.resources.length) {
					messenger.onload();
				}
			});
			img.src = data.src;
		},
		sound: function(data, messenger) {
			var audio = document.createElement("audio");
			audio.addEventListener("load", function() {
				messenger.resources[data.name] = audio;
				messenger._numLoaded += 1;
				if (messenger._numLoaded >= messenger.resources.length) {
					messenger.onload();
				}
			});
			audio.src = data.src;
			document.appendChild(audio);
		},
		font: function(data) {

		},
		text: function(data, messenger) {
			fetch(data.src).then(function(response) {
				return response.text();
			}).then(function(text) {
				messenger.resources[data.name] = text;
				messenger._numLoaded += 1;
				if (messenger._numLoaded >= messenger.resources.length) {
					console.log("All resources loaded!");
					messenger.onload();
				}
			})
		}
	};



	function Messenger() {
		this.loadQuene = [];
		this.resources = {};
		this._numLoaded = 0;
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
		addText: function(name, src) {
			this.loadQuene.push({
				type: "text",
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
			} else {
				this.addText(name, src);
			}
		},
		load: function(onload) {
			for (var i = 0; i < this.loadQuene.length; i ++) {
				loaders[this.loadQuene[i].type](this.loadQuene[i], this);
			}
			this.onload = onload || function() {};
		}
	}



	return Messenger;
})();
