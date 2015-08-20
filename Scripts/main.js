(function(fps) {

	var msDelay = 1000 / fps;

	console.log("Delay between frames is: " + msDelay + " milliseconds");

	var stars = [];

	var canvas;

	function init() {
		var loader = new Messenger();
		loader.addResource("text", "Messenger", "Scripts/Messenger.js");
		loader.load(function() {
			console.log(loader.resources.Messenger);
		});
		canvas = new Sketch({width: window.innerWidth, height: window.innerHeight});

		var start = Date.now();

		/* STRESS TEST */
		var numObjects = 1000;
		canvas.setShadow({enabled: true, hue: 360, saturation: 50, lightness: 50, blur: 20})
		canvas.setStroke({hue: 0, saturation: 50, lightness: 50, weight: 1});
		canvas.setFill({hue: 100, saturation: 50, lightness: 50});
		canvas.setText({enabled: true, size: 20, font: "cursive"});
		for (var i = 0; i < numObjects; i ++) {
			var text = new Sketch.Text({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				text: "The pen is mightier than the sword"
			});
			Math.sin(Math.random());
			canvas.addChild(text);
		}

		canvas.render();

		var end = Date.now();

		console.log((end - start) + " milliseconds taken to add and render " + numObjects + " graphics objects");

		setTimeout(update, msDelay);
	}



	function update() {

		//canvas.render();


		setTimeout(update, msDelay);
	}

	window.addEventListener("load", init, false);

})(60);