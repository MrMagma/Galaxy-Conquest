"use strict";

var Graph = (function () {

    function Graph(cfg) {}

    Graph.prototype = {
        data: function data() {}
    };

    function Node(data) {}

    Node.prototype = {
        data: function data() {},
        on: function on() {}
    };

    function Edge(connections, data) {}

    Edge.prototype = {
        data: function data(_data) {},
        on: function on() {},
        connect: function connect(node) {},
        unconnect: function unconnect(node) {}
    };

    Graph.Node = Node;
    Graph.Edge = Edge;

    return Graph;
})();
"use strict";

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var MarsGame = (function () {

    /* Thank you SO http://stackoverflow.com/a/384380 */
    function isElement(obj) {
        if (obj == null) {
            return false;
        }
        try {
            //Using W3 DOM2 (works for FF, Opera and Chrom)
            return obj instanceof HTMLElement;
        } catch (e) {
            //Browsers not supporting W3 DOM2 don't have HTMLElement and
            //an exception is thrown and we end up here. Testing some
            //properties that all elements have. (works on IE7)
            return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && obj.nodeType === 1 && _typeof(obj.style) === "object" && _typeof(obj.ownerDocument) === "object";
        }
    }

    function Mars(cfg) {
        cfg = (typeof cfg === "undefined" ? "undefined" : _typeof(cfg)) === "object" ? cfg : {};
        if (!isElement(cfg.container)) {
            console.error("Please provide a container element");
            return;
        }
        this.container = cfg.container;
        this.renderer = PIXI.autoDetectRenderer(cfg.width || cfg.container.innerWidth, cfg.height || cfg.container.innerHeight, {});

        this.container.appendChild(this.renderer);
        this._fps = 30;
        this._frameInterval = 1000 / this._fps;
    }

    Mars.prototype = {
        /* Sets the FPS (if a the value argument is supplied) and returns the
           current FPS no matter what */
        FPS: function FPS(value) {
            var type = typeof value === "undefined" ? "undefined" : _typeof(value);
            if (type === "number" || type === "string") {
                if (typeof value === "string") {
                    value = parseInt(value);
                    if (window.isNaN(value)) {
                        console.error("Please supply a valid value to the \"FPS\" method");
                        return;
                    }
                }
                this._fps = value;
                this._frameInterval = 1000 / this._fps;
            }
            return this._fps;
        },
        /* Sets a method to run when the game first starts up, before any resources
           have been loaded */
        init: function init() {},
        /* Sets a method to run when all resources have been loaded and the game
           is ready to go */
        load: function load() {},
        /* Sets a method to run whenever progress is made on any resources the
           game has been told to load */
        progress: function progress() {},
        /* Sets a method to run every frame */
        update: function update() {},
        /* Method to add a resource to the queue of resources to fetch before
           the game loads */
        preload: function preload() {},
        /* Method to asynchrynously load a resource */
        load: function load() {}
    };

    return Mars;
})();