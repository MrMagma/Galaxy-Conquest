var Graph = (function() {
    
    function Graph(cfg) {
        
    }
    
    Graph.prototype = {
        data() {
            
        }
    };
    
    
    
    function Node(data) {
        
    }
    
    Node.prototype = {
        data() {
            
        },
        change() {
            
        }
    };
    
    
    
    function Edge(connections, data) {
        
    }
    
    Edge.prototype = {
        data(data) {
            
        },
        change() {
            
        },
        connect(node) {
            
        },
        unconnect(node) {
            
        }
    };
    
    
    
    Graph.Node = Node;
    Graph.Edge = Edge;
    
    return Graph;
    
})();
