var Unit = (function() {
    
    let MarsObject = require("MarsObject");
    
    let UnitTypes = {
        Base: class Base extends MarsObject {
            constructor(cfg) {
                super(cfg);
                this.type = "base";
            }
        }
    };
    
    let ignoreKeys = ["type", "base", "init"];
    
    let Unit = {
        define(data = {}) {
            let {type, base = "Base", init = () => {}} = data;
            
            if (!UnitTypes.hasOwnProperty(base)) {
                return;
            }
            
            class Unit extends unitTypes[base] {
                constructor(cfg) {
                    super(cfg);
                    this.type = type;
                    init.call(this, cfg);
                }
            }
            
            for (let key in data) {
                if (data.hasOwnProperty(key) &&
                    ignoreKeys.indexOf(key) === -1) {
                    Unit.prototype[key] = data[key];
                }
            }
            
            UnitTypes[type] = Unit;
            
            return Unit;
        },
        create(type, data) {
            if (unitTypes.hasOwnProperty(type)) {
                return new UnitTypes[type](data);
            }
        }
    };
    
    module.exports = Unit;
    return Unit;    
    
})();
