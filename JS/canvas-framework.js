var Sketch = (function() {

	var Sketch = {};


	
	var util = {};

	util.merge = function(o) {
		/* (Joshua): This is a terrible method */
		for (var i = arguments.length - 1; i > 1; i ++) {
			var o2 = arguments[i];
			for (var prop in o2) {
				if (typeof o[prop] === "undefined") {
					var nProp = o2[prop];
					if (typeof nProp === "object") {
						nProp = Object.create(nProp);
					}
					o[prop] = nProp;
				}
			}
		}
		return o;
	}



	var canvasMemory = {};

	var canvasIndex = [];



	function GObject(cfg) {
		this._parent = null;
		this._context = null;
		this.init(cfg);
	}

	GObject.prototype = {
		init: function(cfg) {
			if (typeof cfg === "undefined" || cfg.constructor !== Object) cfg = {};	
			this.angle = 0;
			this.pos = cfg.pos || {
				x: 0,
				y: 0
			};
			this.scale = cfg.scale || {
				x: 1,
				y: 1
			};
			this.style = {
				fillColor: {
					hue: 360,
					saturation: 100,
					lightness: 100,
					alpha: 100,
					styleString: "hsla(360, 100%, 100%, 1.0)"
				},
				borderColor: {
					hue: 0,
					saturation: 0,
					lightness: 0,
					alpha: 100,
					styleString: "hsla(0, 0%, 0%, 1.0)"
				},
				borderSize: "1px",
				borderStyle: "solid",
				borderStyleString: "1px solid hsla(0, 0%, 0%, 1.0)"
			};
		},
		rotate: function(amount) {
			this.angle += amount;
		},
		translate: function(pos) {
			this.pos.x += pos.x || 0;
			this.pos.y += pos.y || 0;
		},
		translateX: function(px) {
			this.pos.x += px;
		},
		translateY: function(py) {
			this.pos.y += py;
		},
		scale: function(scale) {
			this.scale.x += scale.x || 0;
			this.scale.y += scale.y || 0;
		},
		scaleX: function(sx) {
			this.scale.x += sx;
		},
		scaleY: function(sy) {
			this.scale.y += sy;
		},
		render: function() {
			
		}
	};



	Sketch.Group = (function() {
		var cfgDefaults = {
			children: []
		};

		function Group(cfg) {
			if (!(this instanceof Group)) return new Group(cfg);
			if (typeof cfg === "undefined" || cfg.constructor !== Object) return;

			this.children = cfg.children || [];
		}

		Group.prototype = util.merge(
			{
				addChild: function(el) {
					el._parent = this;
					el._context = this._context;
					this.children.push(el);
				},
				removeChild: function(index) {
					this.children.splice(index);
				},
				addChildren: function() {
					for (var i = 0; i < arguments.length; i ++) {
						this.addChild(arguments[i]);
					}
				},
				removeChildren: function() {
					for (var i = 0; i < arguments.length; i ++) {
						this.removeChild(arguments[i] - i);
					}
				},
				render: function() {
					for (var i = 0; i < this.children.length; i ++) {
						this.children[i].render();
					}
				},
				clearChildren: function() {
					this.children = [];
				}
			},
			new GObject()
		);

		return Group;
	})();


	
	function SketchType(cfg) {
		console.log(cfg.name);
		var fnBody = "if (!(this instanceof Sketch." + cfg.name + ")) {return new Sketch." + cfg.name + "(cfg);}if (typeof cfg === 'undefined' || cfg.constructor !== Object) {return;}this.init(cfg);";
		for (var i = 0; i < cfg.properties.length; i ++) {
			var prop = cfg.properties[i];
			fnBody += "this['" + prop + "']=cfg['" + prop + "'];";
		}

		var typeConstructor = new Function("cfg", fnBody);
		typeConstructor.prototype = new GObject();
		typeConstructor.prototype.render = cfg.render;

		Sketch[cfg.name] = typeConstructor;
	}



	SketchType({
		name: "Square",
		properties: ["size"],
		render: function() {
			this._context.fillStyle = this.style.fillColor.styleString;
			this._context.strokeStyle = this.style.borderStyleString;

			var w = this.size * this.scale.x;
			var h = this.size * this.scale.y;

			this._context.fillRect(this.pos.x, this.pos.y, w, h);
			this._context.strokeRect(this.pos.x, this.pos.y, w, h);
		}
	});



	SketchType({
		name: "Rect",
		properties: ["width", "height"],
		render: function() {
			this._context.fillStyle = this.style.fillColor.styleString;
			this._context.strokeStyle = this.style.borderStyleString;

			var w = this.width * this.scale.x;
			var h = this.height * this.scale.y;

			this._context.fillRect(this.pos.x, this.pos.y, w, h);
			this._context.strokeRect(this.pos.x, this.pos.y, w, h);
		}
	});



	function Canvas(id) {
		if (!(this instanceof Canvas)) return new Canvas(cfg);
		this._id = id;
		this._canvas = document.getElementById(id);
		this._context = this._canvas.getContext("2d");

  		this._resize();

  		canvasMemory[id] = this;
  		canvasIndex.push(id);
		/*
		Add properties width and height representing the width and height of the canvas
		*/
	}

	Canvas.prototype = new Sketch.Group({});

	Canvas.prototype._resize = function() {
		var parentNode = this._context.canvas.parentNode;

		if (parentNode === document.body) {
			this._context.canvas.width = window.innerWidth;
			this._context.canvas.height = window.innerHeight;
		} else {
			this._context.canvas.width = parentNode.offsetWidth;
			this._context.canvas.height = parentNode.offsetHeight;
		}

  		this.render();
	}



	Sketch.Canvas = function(id) {
		if (!canvasMemory[id]) {
			var canvas = new Canvas(id);
			return canvas;
		} else {
			return canvasMemory[id];
		}
	};



	window.onresize = function() {
		for (var i = 0; i < canvasIndex.length; i ++) {
			canvasMemory[canvasIndex[i]]._resize();
		}
	}



	return Sketch;
})();