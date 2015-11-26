var MarsGame = (function() {
    
    function Mars(cfg = {}) {
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
    
    module.exports = Mars;
    return Mars;
})();
