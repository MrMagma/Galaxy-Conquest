var MarsObject = (function() {
    
    let _ = require("./underscore-extended.js");
    
    let DataObject = require("./DataObject.js");

    let UIDGenerator = require("./UIDGenerator");
    
    let uidGenerator = new UIDGenerator({
        sequenceLength: 30
    });
    
    /*
     `_proto` is an object containing methods that we would like to use in
     MarsObject but don't necessarily want being exposed to the whole world
     and cluttering things up */
    let _proto = {
        
    };
    
    class MarsObject extends DataObject {
        constructor(cfg = {}) {
            super(cfg);
            
            this._uid = uidGenerator.generate();
        }
    }
    
    module.exports = MarsObject;
    return MarsObject;

})();
