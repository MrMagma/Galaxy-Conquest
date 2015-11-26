var MarsGame = (function() {
    
    /* Thank you SO http://stackoverflow.com/a/384380 */
    function isElement(obj) {
        if (obj == null) {
            return false;
        }
        try {
            //Using W3 DOM2 (works for FF, Opera and Chrom)
            return obj instanceof HTMLElement;
        }
        catch(e){
            //Browsers not supporting W3 DOM2 don't have HTMLElement and
            //an exception is thrown and we end up here. Testing some
            //properties that all elements have. (works on IE7)
            return (typeof obj === "object") &&
              (obj.nodeType === 1) && (typeof obj.style === "object") &&
              (typeof obj.ownerDocument === "object");
        }
    }
    
    function Mars(cfg) {
        cfg = (typeof cfg === "object") ? cfg : {};
        if (!isElement(cfg.container)) {
            console.error("Please provide a container element");
            return;
        }
        this.container = cfg.container;
        this.renderer = PIXI.autoDetectRenderer(
            cfg.width || cfg.container.innerWidth,
            cfg.height || cfg.container.innerHeight, {});
        
        this.container.appendChild(this.renderer);
        this._fps = 30;
        this._frameInterval = 1000 / this._fps;
    }
    
    Mars.prototype = {
        /* Sets the FPS (if a the value argument is supplied) and returns the
           current FPS no matter what */
        FPS: function(value) {
            var type = typeof value;
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
        init: function() {
            
        },
        /* Sets a method to run when all resources have been loaded and the game
           is ready to go */
        load: function() {
            
        },
        /* Sets a method to run whenever progress is made on any resources the
           game has been told to load */
        progress: function() {
            
        },
        /* Sets a method to run every frame */
        update: function() {
            
        },
        /* Method to add a resource to the queue of resources to fetch before
           the game loads */
        preload: function() {
            
        },
        /* Method to asynchrynously load a resource */
        load: function() {
            
        }
    };
    
    return Mars;
})();
