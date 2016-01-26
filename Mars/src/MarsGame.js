var _ = require("./underscore-extended.js");

var MarsObject = require("./MarsObject.js");

class MarsGame extends MarsObject {
    constructor(cfg = {}) {
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
        this._frameTimeout = null;
        // Start up the game loop.
        this.runLoop();
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
        this.on("update", cb);
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
    /*
     Runs the game loop. Should only be used internally.
     Usage:
        runLoop()
            Runs one frame of the game loop.
     */
    runLoop() {
        this.data().frameCount += 1;
        this.fire("update", {
            frameCount: this.data().frameCount
        });
        this._frameTimeout = setTimeout(this.runLoop.bind(this),
            1000 / this.data().fps);
    }
}

module.exports = MarsGame;
