(function(fps) {

	var msDelay = 1000 / fps;

	console.log("Delay between frames is: " + msDelay + " milliseconds");

	var stars = [];

	var canvas;

	function init() {
	    canvas = Sketch.Canvas("main-canvas");
	    canvas.addChild(Sketch.Rect({
	    	width: 100,
	    	height: 200,
	    	pos: {
	    		x: 20,
	    		y: 20
	    	}
	    }));
	    canvas.render();
	    console.log("Game started!");
		setTimeout(update, msDelay);
	}



	function update() {

		setTimeout(update, msDelay);
	}

	window.addEventListener("load", init, false);

})(60);