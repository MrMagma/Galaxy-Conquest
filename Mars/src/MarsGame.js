var MarsGame = (function() {
    
    var _ = require("./underscore-extended.js")
    
    var MarsObject = require("./MarsObject.js");
    
    let _proto = {
        runLoop() {
            this.data().frameCount += 1;
            this.fire("update", {
                frameCount: this.data().frameCount
            });
            setTimeout(this.runLoop.bind(this),
                1000 / this.data().fps);
        }
    };
    
    class MarsGame extends MarsObject {
        constructor(cfg) {
            super(cfg);
            let {fps = 60, update = () => {}} = cfg;
            this.data({
                fps: fps,
                frameCount: 0,
                dead: false
            });
            this.check({
                fps(v) {
                    return (_.isNumber(v) && v > 0);
                },
                dead(v, pVal) {
                    // Don't allow people to "revive" a game object.
                    //                           v
                    return (!_.isBoolean(v) && !pVal);
                },
                frameCount(v) {
                    return (_.isNumber(v) && v > 0);
                }
            });
            _proto.runLoop.call(this);
        }
        /*
         Gets and optionally sets the frames per second of the main game loop.
         Usage:
            fps()
                Returns the frames per second value.
            fps(newFps)
                Sets the frames per second value to `newFps`.
         */
        fps(val) {
            this.data("fps", val);
            return this.data("fps");
        }
        /*
         Shortcut for adding listeners for the update event.
         Usage:
            addUpdate(callback)
                Adds the callback as a listener for the update event.
            addUpdate(callbacks)
                Adds all valid callbacks in the callbacks list as a listener
                for the update event.
         */
        addUpdate(cb) {
            this.on("update", cb)
        }
        /*
         Shortcut for removing listeners from the update event.
         Usage:
            removeUpdate(callback)
                Removes the callback from the update event.
            removeUpdate(callbacks)
                Removes all valid callbacks in the callbacks list from the
                update event.
         */
        removeUpdate(cb) {
            this.off("update", cb);
        }
        /*
         Marks this game object as "dead", preventing any loops from
         continuing.
         Usage:
            kill()
                Kills this game object.
         */
        kill() {
            this.data("dead", true);
        }
    }
    
    module.exports = MarsGame;
    return MarsGame;
    
})();
