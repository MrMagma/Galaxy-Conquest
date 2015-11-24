/*
What I need:
 Images
 Ability to have thousands of objects in a scene
 Basic events along with optional bubbling
 Rotation (Done)
 Groups (Done)
 Translation (Done)


Stars, UI
Rectangles (Done), Ellipses (Done), Triangles (Done), Text (Done)
*/

var Sketch = (function() {

	function mergeObjects(o) {
		for (var i = 0; i < arguments.length; i ++) {
			var o2 = arguments[i];
			for (var key in o2) {
				if (o[key] === undefined) {
					o[key] = o2[key];
				}
			}
		}
		return o;
	}



	function Transform(cfg) {
		if (typeof cfg === "undefined" || cfg.constructor !== Object) cfg = {};
		this.x = 0;
		this.y = 0;
		this.scale = {
			x: 1,
			y: 1
		};
		this.rotation = 0;
		this.init(cfg);
	}

	Transform.prototype = {
		init: function(cfg) {
			if (cfg) this.translate(cfg);
			if (cfg.scale) this.scale(cfg.scale);
			if (cfg.rotation) this.rotate(cfg.rotation);
		},
		scale: function() {
			if (arguments.length === 1) {
				this.scale.x = arguments[0].x || this.scale.x;
				this.scale.y = arguments[0].y || this.scale.y;
			} else if (this.arguments.length === 2) {
				this.scale = {
					x: arguments[0],
					y: arguments[1]
				}
			}
			return this;
		},
		scaleX: function(x) {
			this.scale.x = x;
			return this;
		},
		scaleY: function(y) {
			this.scale.y = y;
			return this;
		},
		translate: function() {
			if (arguments.length === 1) {
				this.x = arguments[0].x || this.x;
				this.y = arguments[0].y || this.y;
			} else if (arguments.length === 2) {
				this.x = arguments[0];
				this.y = arguments[1];
			}
			return this;
		},
		translateX: function(x) {
			this.x = x;
			return this;
		},
		translateY: function(y) {
			this.y = y;
			return this;
		},
		rotate: function(d) {
			this.rotation += d;
			return this;
		},
		applyTransform: function(context) {
			context.translate(this.x, this.y);
			context.scale(this.scale.x, this.scale.y);
			context.rotate(this.rotation);
		},
		resetTransform: function(context) {
			context.translate(-this.x, -this.y);
			context.scale(1/this.scale.x, 1/this.scale.y);
			context.rotate(-this.rotation);
		}
	};



	function SStyle(cfg) {
		if (typeof cfg === "undefined" || cfg.constructor !== Object) cfg = {};
		this.fill = {
			hue: 0,
			saturation: 100,
			lightness: 100,
			alpha: 100,
			styleString: "hsla(0, 100%, 100%, 1.0)",
			enabled: true
		};
		this.stroke = {
			hue: 0,
			saturation: 0,
			lightness: 0,
			alpha: 100,
			weight: 1,
			cap: "butt",
			styleString: "hsla(0, 0%, 0%, 1.0)",
			enabled: true
		};
		this.textStyle = {
			font: "sans-serif",
			size: 10,
			align: "start",
			baseline: "alphabetic",
			direction: "inherit",
			styleString: "10px sans-serif",
			enabled: true
		};
		this.shadow = {
			blur: 0,
			hue: 0,
			saturation: 0,
			lightness: 0,
			alpha: 100,
			offsetX: 0,
			offsetY: 0,
			styleString: "hsla(0, 0%, 0%, 1)",
			enabled: false
		}
		this.init(cfg);
	}

	SStyle.prototype = {
		init: function(cfg) {
			if (cfg.fill) this.setFill(cfg.fill);
			if (cfg.stroke) this.setStroke(cfg.stroke);
			if (cfg.textStyle) this.setText(cfg.textStyle);
			if (cfg.shadow) this.setShadow(cfg.shadow);
		},
		setFill: function(f) {
			if (f.hue !== undefined) this.fill.hue = f.hue;
			if (f.saturation !== undefined) this.fill.saturation = f.saturation;
			if (f.lightness !== undefined) this.fill.lightness = f.lightness;
			if (f.alpha !== undefined) this.fill.alpha = f.alpha;
			if (f.enabled !== undefined) this.fill.enabled = !!(f.enabled);
			this.fill.styleString = "hsla(" + this.fill.hue + ", " + this.fill.saturation + "%, " + this.fill.lightness + "%, " + (this.fill.alpha / 100) + ")";
			return this;
		},
		setStroke: function(s) {
			if (s.hue !== undefined) this.stroke.hue = s.hue;
			if (s.saturation !== undefined) this.stroke.saturation = s.saturation;
			if (s.lightness !== undefined) this.stroke.lightness = s.lightness;
			if (s.alpha !== undefined) this.stroke.alpha = s.alpha;
			if (s.weight !== undefined) this.stroke.weight = s.weight;
			if (s.cap !== undefined) this.stroke.cap = s.cap;
			if (s.enabled !== undefined) this.stroke.enabled = !!(s.enabled);
			this.stroke.styleString = "hsla(" + this.stroke.hue + ", " + this.stroke.saturation + "%, " + this.stroke.lightness + "%, " + (this.stroke.alpha / 100) + ")";
			return this;
		},
		setText: function(t) {
			if (t.font !== undefined) this.textStyle.font = t.font;
			if (t.baseline !== undefined) this.textStyle.baseline = t.baseline;
			if (t.direction !== undefined) this.textStyle.direction = t.direction;
			if (t.size !== undefined) this.textStyle.size = t.size;
			if (t.enabled !== undefined) this.textStyle.enabled = !!(t.enabled);
			this.textStyle.styleString = this.textStyle.size + "px " + this.textStyle.font;
			return this;
		},
		setShadow: function(s) {
			if (s.blur !== undefined) this.shadow.blur = s.blur;
			if (s.hue !== undefined) this.shadow.hue = s.hue;
			if (s.saturation !== undefined) this.shadow.saturation = s.saturation;
			if (s.lightness !== undefined) this.shadow.lightness = s.lightness;
			if (s.alpha !== undefined) this.shadow.alpha = s.alpha;
			if (s.weight !== undefined) this.shadow.weight = s.weight;
			if (s.offsetX !== undefined) this.shadow.offsetX = s.offsetX;
			if (s.offsetY !== undefined) this.shadow.offsetY = s.offsetY;
			if (s.enabled !== undefined) this.shadow.enabled = !!(s.enabled);
			this.shadow.styleString = "hsla(" + this.shadow.hue + ", " + this.shadow.saturation + "%, " + this.shadow.lightness + "%, " + (this.shadow.alpha / 100) + ")";
			console.log(this.shadow);
			return this;
		},
		applyStyle: function(context) {
			if (this.fill.enabled) {
				context.fillStyle = this.fill.styleString;
			}
			if (this.stroke.enabled) {
				context.strokeCap = this.stroke.cap;
				context.lineWidth = this.stroke.weight;
				context.strokeStyle = this.stroke.styleString;
			}
			if (this.textStyle.enabled) {
				context.font = this.textStyle.styleString;
				context.textAlign = this.textStyle.align;
				context.textBaseline = this.textStyle.baseline;
				context.direction = this.textStyle.direction;
			}
			if (this.shadow.enabled) {
				context.shadowBlur = this.shadow.blur;
				context.shadowColor = this.shadow.styleString;
				context.shadowOffsetX = this.shadow.offsetX;
				context.shadowOffsetY = this.shadow.offsetY;
			}
		}
	};



	function GObject(cfg) {
		this._id = Date.now();
		this._parents = {};
		this._context = null;
	}

	GObject.prototype = {
		render: function() {

		},
		removeParent: function(parent) {
			this._parents[parent]._parent.removeChild(this);
			return this;
		},
		addParent: function(parent) {
			parent.addChild(this);
		},
		updateContext: function() {
			for (var key in this._parents) {
				this._context = this._parents[key]._parent.updateContext();
				if (this._context !== null) {
					break;
				}
			}
			return this._context;
		}
	};



	function Group() {
		this._id = Date.now();
		this._parents = {};
		this.children = [];
	}

	Group.prototype = mergeObjects(
		{
			render: function() {
				this.applyTransform(this._context);
				this.applyStyle(this._context);
				for (var i = this.children.length - 1; i >= 0; i --) {
					this.children[i].render();
				}
				this.resetTransform(this._context);
				return this;
			},
			addChild: function(c) {
				if (c !== undefined && c.render !== undefined && c.render.constructor === Function) {
					c._parents[this._id] = {
						_parent: this,
						_index: this.children.length
					};
					if (c._context === null) {
						c._context = this._context;
					}
					this.children.push(c);
				}
				return this;
			},
			addChildren: function() {
				for (var i = 0; i < arguments.length; i ++) {
					this.addChild(arguments[i]);
				}
				return this;
			},
			removeChild: function(c) {
				if (c !== undefined) {
					this.children.splice(c._parents[this._id]._index, 1);
					delete c._parents[this._id];
				}
				return this;
			},
			removeChildren: function() {
				for (var i = 0; i < arguments.length; i ++) {
					this.removeChild(arguments[i]);
				}
				return this;
			}
		},
		new GObject(),
		new Transform(),
		new SStyle()
	);



	Sketch.Rect = (function() {
		function Rect(cfg) {
			this.x = cfg.x;
			this.y = cfg.y;
			this.width = cfg.width;
			this.height = cfg.height;
		}

		Rect.prototype = mergeObjects(
			{
				render: function() {
					this._context.fillRect(this.x, this.y, this.width, this.height);
					this._context.strokeRect(this.x, this.y, this.width, this.height);
				}
			},
			new GObject()
		);

		return Rect;
	})();

	Sketch.Ellipse = (function() {
		function Ellipse(cfg) {
			this.x = cfg.x;
			this.y = cfg.y;
			this.width = cfg.width;
			this.height = cfg.height;
		}

		Ellipse.prototype = mergeObjects(
			{
				render: function() {
					var kappa = .5522848,
			      	ox = (this.width / 2) * kappa, // control point offset horizontal
					oy = (this.height / 2) * kappa, // control point offset vertical
					xe = this.x + this.width / 2,           // x-end
					ye = this.y + this.height / 2,           // y-end
					xm = this.x,       // x-middle
					ym = this.y;       // y-middle

				  	this._context.beginPath();
					this._context.moveTo(this.x, ym);
				  	this._context.bezierCurveTo(this.x, ym - oy, xm - ox, this.y, xm, this.y);
				  	this._context.bezierCurveTo(xm + ox, this.y, xe, ym - oy, xe, ym);
				  	this._context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
				  	this._context.bezierCurveTo(xm - ox, ye, this.x, ym + oy, this.x, ym);
				  	//ctx.closePath(); // not used correctly, see comments (use to close off open path)
				  	this._context.stroke();
				  	this._context.fill();
				}
			},
			new GObject()
		);

		return Ellipse;
	})();

	Sketch.Triangle = (function() {
		function Triangle(cfg) {
			this.x1 = cfg.x1;
			this.y1 = cfg.y1;
			this.x2 = cfg.x2;
			this.y2 = cfg.y2;
			this.x3 = cfg.x3;
			this.y3 = cfg.y3;
		}

		Triangle.prototype = mergeObjects(
			{
				render: function() {
					this._context.beginPath();
					this._context.moveTo(this.x1, this.y1);
					this._context.lineTo(this.x2, this.y2);
					this._context.lineTo(this.x3, this.y3);
					this._context.closePath();
					this._context.fill();
					this._context.stroke();
				}
			},
			new GObject()
		);

		return Triangle;
	})();



	Sketch.Text = (function() {
		function Text(cfg) {
			this.x = cfg.x;
			this.y = cfg.y;
			this.text = cfg.text;
			this.width = cfg.width || Infinity;
		}

		Text.prototype = mergeObjects(
			{
				render: function() {
					if (Math.abs(this.width) === Infinity || this.width === 0) {
						this._context.fillText(this.text, this.x, this.y);
						this._context.strokeText(this.text, this.x, this.y);
					} else {
						this._context.fillText(this.text, this.x, this.y, this.width);
						this._context.strokeText(this.text, this.x, this.y, this.width);
					}
				}
			},
			new GObject()
		);

		return Text;
	})();



	function Sketch(cfg) {
		if (typeof cfg === "undefined" || cfg.constructor !== Object) cfg = {};
		this._canvas = document.createElement("canvas");
		this._context = this._canvas.getContext("2d");
		this.init(cfg);
	}

	Sketch.prototype = mergeObjects(
		{
			init: function(cfg) {
				this._canvas.width = cfg.width || 300;
				this._canvas.height = cfg.height || 150;

				Object.defineProperties(this, {
					width: {
						get: function() {
							return this._canvas.width;
						},
						set: function(v) {
							this._canvas.width = v;
						}
					},
					height: {
						get: function() {
							return this._canvas.height;
						},
						set: function(v) {
							this._canvas.height = v;
						}
					}
				})

				var parent = cfg.parent || document.body;
				parent.appendChild(this._canvas);
			},
			clear: function(x, y, w, h) {
				this._context.clearRect(x, y, w, h);
			},
			updateContext: function() {
				return this._context;
			}
		},
		new Group()
	);



	return Sketch;
	
})();
