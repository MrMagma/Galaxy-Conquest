var assert = require("assert");

describe("underscore-extended", function() {
    
    var _ = require("../Mars/build/underscore-extended.js");
    
    describe("getPathParent", function() {
        
        it("should return a reference to the object containing a path", function() {
            
            var parent = {
                a: 2
            };
            
            var obj = {
                b: {
                    c: parent
                }
            };
            
            var ref = _.getPathParent(obj, "b.c.a");
            
            assert.equal(_.isEqual(parent, ref), true);
            
        });
        
        it("should return undefined if the path to the parent cannot be walked", function() {
            
            var obj = {
                b: {
                    c: {
                        
                    }
                }
            };
            
            assert.equal(_.getPathParent(obj, "b.c.d.e"), undefined);
            
        });
        
    });
    
    describe("getPathValue", function() {
        
        it("should get the value at a path on an object", function() {
            
            var parent = {
                a: 2
            };
            
            var obj = {
                b: {
                    c: parent
                }
            };
            
            var val = _.getPathValue(obj, "b.c.a");
            
            assert.equal(val, 2);
            
        });
        
        it("should return undefined if the full path cannot be walked", function() {
            
            var parent = {
                
            };
            
            var obj = {
                b: {
                    c: parent
                }
            };
            
            var val = _.getPathValue(obj, "b.c.a");
            
            assert.equal(val, undefined);
            
        });
        
    });
    
    describe("getPathTail", function() {
        
        it("should get the key for the tail of a path", function() {
            
            
            
        });
        
    });
    
    describe("getPathData", function() {
        
        it("should return an object containing a refence to the paths parent and the tail of the path", function() {
            
            var obj = {
                a: {
                    b: {
                        c: {
                            d: 42
                        }
                    }
                }
            };
            
            var data = _.getPathData(obj, "a.b.c.d");
            
            assert.equal(_.isEqual(data.ref, obj.a.b.c), true);
            assert.equal(data.key, "d");
            
        });
        
    });
    
    describe("walkJSON", function() {
        
        it("should walk the values in a JSON object", function() {
            
            var obj = {
                a: {
                    c: 2
                },
                b: {
                    d: {
                        e: 3
                    },
                    f: 5
                }
            };
            
            var values = [];
            
            _.walkJSON(obj, function(val) {
                if (_.isNumber(val)) {
                    values.push(val);
                }
            });
            
            assert.equal(values.length, 3);
            assert.equal(_.union(values, [2, 3, 5]).length, 3);
            
        });
        
        it("should stop walking a path if the walker returns true", function() {
            
            var obj = {
                a: 2,
                b: {
                    d: 3,
                    e: 4
                },
                c: {
                    f: 5,
                    g: 6
                }
            };
            
            var values = [];
            
            _.walkJSON(obj, function(val, path) {
                if (path[path.length - 1] === "b") {
                    return true;
                }
                if (!_.isObject(val)) {
                    values.push(val);
                }
            });
            
            assert.equal(values.length, 3);
            assert.equal(_.union(values, [2, 5, 6]).length, 3);
            
        });
        
    });
    
});
