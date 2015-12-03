var Graph = (function() {
    
    let MarsObject = require("./MarsObject.js");
    let _ = require("./underscore-extended.js");
    
    class Graph extends MarsObject {
        constructor(cfg = {}) {
            super(cfg);
        }
    }
    
    
    
    var Node = (function() {
        let _proto = {
            connectToEdges(edges) {
                for (let edge of edges) {
                    if (edge instanceof Graph.Edge) {
                        this.connections.push(edge);
                        edge.connect(this);
                    }
                }
            },
            disconnectFromEdges(disconnect = []) {
                disconnect = disconnect.map(edge => edge._uid);
                this.connections = this.connections.filter(edge => {
                    if (disconnect.indexOf(edge._uid) !== -1) {
                        edge.disconnect(this);
                        return false;
                    }
                    return true;
                })
            }
        };
        
        class Node extends MarsObject {
            constructor(cfg = {}) {
                super(cfg);
                this.connections = [];
            }
            connect() {
                if (arguments.length === 1 && _.isArray(arguments[0])) {
                    _proto.connectToEdges.call(this, arguments[0]);
                } else {
                    _proto.connectToEdges.call(this, _.toArray(arguments));
                }
                
                return this;
            }
            disconnect() {
                if (arguments.length === 1 && _.isArray(arguments[0])) {
                    _proto.disconnectFromEdges.call(this, arguments[0]);
                } else {
                    _proto.disconnectFromEdges.call(this, _.toArray(arguments));
                }
                
                return this;
            }
        }
        
        return Node;
    })();
    
    
    
    class Edge extends MarsObject {
        constructor(cfg = {}) {
            super(cfg);
        }
        connect() {
            
        }
        disconnect() {
            
        }
    }
    
    
    
    Graph.Node = Node;
    Graph.Edge = Edge;
    
    module.exports = Graph;
    return Graph;
    
})();
