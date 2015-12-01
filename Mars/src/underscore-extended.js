var _ = (function() {
    
    /* TODO (Joshua): We should probably just use underscore or lodash and not
       both */
    var lodash = require("lodash");
    var underscore = require("underscore");
    
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
        }
    });
    
    module.exports = _;
    return _;
    
})();
