(function(fps) {

	var msDelay = 1000 / fps;

	console.log("Delay between frames is: " + msDelay + " milliseconds");

	var stars = [];

	var canvas;

	function init() {

		canvas = new Sketch();

		var start = Date.now();

		/* STRESS TEST */
		var numTriangles = 100000;

		for (var i = 0; i < numTriangles; i ++) {
			var triangle = new Sketch.Triangle({
				x1: Math.random() * 100,
				y1: Math.random() * 100,
				x2: Math.random() * 100,
				y2: Math.random() * 100,
				x3: Math.random() * 100,
				y3: Math.random() * 100
			});
			Math.sin(Math.random());
			canvas.addChild(triangle);
		}

		canvas.render();

		var end = Date.now();

		console.log((end - start) + " milliseconds taken to add and render " + numTriangles + " triangles along with heavy math");

		setTimeout(update, msDelay);
	}



	function update() {

		//canvas.render();


		setTimeout(update, msDelay);
	}

	window.addEventListener("load", init, false);

})(60);