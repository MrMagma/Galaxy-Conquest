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
    
    function Mars(cfg = {}) {
        if (!isElement(cfg.container)) {
            console.error("Please provide a container element");
            return;
        }
        let {container,
            width = container.innerWidth,
            height = container.innerHeight} = cfg;
        
        this.container = container;
        this.renderer = PIXI.autoDetectRenderer(width, height, {});
        
        this.container.appendChild(this.renderer);
        this._fps = 30;
        this._frameInterval = 1000 / this._fps;
    }
    
    Mars.prototype = {
        /* Sets the FPS (if a the value argument is supplied) and returns the
           current FPS no matter what */
        FPS(value) {
            let type = typeof value;
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
        init() {
            
        },
        /* Sets a method to run when all resources have been loaded and the game
           is ready to go */
        load() {
            
        },
        /* Sets a method to run whenever progress is made on any resources the
           game has been told to load */
        progress() {
            
        },
        /* Sets a method to run every frame */
        update() {
            
        },
        /* Method to add a resource to the queue of resources to fetch before
           the game loads */
        preload() {
            
        },
        /* Method to asynchrynously load a resource */
        load() {
            
        }
    };
    
    return Mars;
})();
