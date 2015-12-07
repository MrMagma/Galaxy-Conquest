var _ = (function() {
    
    /* TODO (Joshua): We should probably just use underscore or lodash and not
       both */
    var lodash = require("lodash");
    var underscore = require("underscore");
    var mixin = require("mixin");
    
    var _ = underscore.extendOwn(lodash, underscore, {
        getPathParent(obj, path = "") {
            path = path.split(".");
            let ref = obj;
            
            while (path.length > 1 && ref !== undefined) {
                ref = ref[path.shift()];
            }
            
            return ref;
        },
        getPathData(obj, path = "") {
            return {
                ref: _.getPathParent(obj, path),
                key: _.getPathTail(path)
            }
        },
        getPathValue(obj, path = "") {
            let {ref, key} = _.getPathData(obj, path);
            
            if (ref !== undefined) {
                return ref[key];
            }
        },
        getPathTail(path = "") {
            return path.split(".").pop();
        },
        walkJSON(json, walker, path = "") {
            for (let key in json) {
                if (json.hasOwnProperty(key)) {
                    let valPath = path;
                    if (valPath.length) {
                        valPath += ".";
                    }
                    valPath += key;
                    
                    let dontWalk = walker(json[key], valPath);
                    if (!dontWalk) {
                        _.walkJSON(json[key], walker, valPath);
                    }
                }
            }
        },
        mix() {
            if (arguments.length > 0) {
                let current = arguments[0];
                
                for (let i = 1; i < arguments.length; i++) {
                    current = mixin(current, arguments[i]);
                }
                
                return current;
            }
        }
    });
    
    module.exports = _;
    return _;
    
})();
