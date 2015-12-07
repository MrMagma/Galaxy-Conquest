var Unit = (function() {
    
    let MarsObject = require("MarsObject");
    
    class Unit extends MarsObject {
        constructor(type) {
            super();
            this.type = type;
        }
    }
    
    module.exports = Unit;
    return Unit;    
    
})();
