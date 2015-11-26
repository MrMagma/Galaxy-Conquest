var Graph = (function() {
    
    function Graph(cfg) {
        
    }
    
    Graph.prototype = {
        data: function() {
            
        }
    };
    
    
    
    function Node(data) {
        
    }
    
    Node.prototype = {
        data: function() {
            
        },
        on: function() {
            
        }
    };
    
    
    
    function Edge(connections, data) {
        
    }
    
    Edge.prototype = {
        data: function(data) {
            
        },
        on: function() {
            
        },
        connect: function(node) {
            
        },
        unconnect: function(node) {
            
        }
    };
    
    
    
    Graph.Node = Node;
    Graph.Edge = Edge;
    
    return Graph;
    
})();
