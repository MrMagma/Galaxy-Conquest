var _ = (function() {
    
    /* TODO (Joshua): Maybe we should just use underscore or lodash and not
       both */
    var lodash = require("lodash");
    var underscore = require("underscore");
    
    var _ = underscore.extendOwn(lodash, underscore);
    
    module.exports = _;
    return _;
    
})();
