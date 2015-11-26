(function() {
    var MarsEngine = require("../../Mars/build/MarsEngine.js");
    
    var FPS = 60;
    var FRAME_INTERVAL = 1000 / FPS;
    
    var renderer = PIXI.autoDetectRenderer(
        window.innerWidth,
        window.innerHeight, {});
    
    var frameCount = 0;
    
    function runUpdate() {
        var now = Date.now();
        if (now - runUpdate.lastUpdate >= FRAME_INTERVAL) {
            update();
            frameCount += 1;
        }
        window.requestAnimationFrame(runUpdate);
    };
    
    runUpdate.lastUpdate = -Infinity;
    
    function init() {
        document.body.appendChild(renderer.view);
        window.requestAnimationFrame(runUpdate);
    };
    
    function update() {
        console.log("Hi");
    };

    document.addEventListener("DOMContentLoaded", init);

})();
