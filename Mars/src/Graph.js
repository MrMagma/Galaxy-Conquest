var Graph = (function() {
    
    let MarsObject = require("./MarsObject.js");
    
    class Graph extends MarsObject {
        constructor(cfg = {}) {
            super(cfg);
        }
    }
    
    
    
    class Node extends MarsObject {
        constructor(cfg = {}) {
            super(cfg);
        }
    }
    
    
    
    class Edge extends MarsObject {
        constructor(cfg = {}) {
            super(cfg);
        }
        connect() {
            
        }
        unconnect() {
            
        }
    }
    
    
    
    Graph.Node = Node;
    Graph.Edge = Edge;
    
    module.exports = Graph;
    return Graph;
    
})();
