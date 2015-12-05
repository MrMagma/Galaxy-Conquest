var Graph = (function() {
    
    let MarsObject = require("./MarsObject.js");
    let _ = require("./underscore-extended.js");
    
    class Graph extends MarsObject {
        constructor(cfg = {}) {
            super(cfg);
        }
    }
    
    
    
    var [Node, Edge] = (function() {
        
        let _proto = {
            /*
             Connects a Node to one or more Edges. Used by the `connect` method
             on Node.
             */
            connectToEdges(edges) {
                for (let edge of edges) {
                    if (edge instanceof Graph.Edge && !this.connected(edge)) {
                        this.connections.push(edge);
                        edge.connect(this);
                    }
                }
            },
            /*
             Connects an Edge to one or more Nodes. Used by the `connect`
             method on Edge.
             */
            connectToNodes(nodes) {
                for (let node of nodes) {
                    if (node instanceof Graph.Node && !this.connected(node)) {
                        this.connections.push(node);
                        node.connect(this);
                    }
                }
            },
            /*
             Used to disconnect a graph object from one or more others. Used by
             the `disconnect` methods on Node and Edge
             */
            disconnectMultiple(o1, disconnect) {
                for (let o2 of disconnect) {
                    _proto.disconnectFrom(o1, o2);
                }
            },
            /*
             Used to diconnect two graph objects from one another. Used by
             `disconnectMultiple`.
             */
            disconnectFrom(o1, o2) {
                if (!_.isObject(o1) || !_.isObject(o2)) {
                    return;
                }
                
                o1.connections = o1.connections
                    .filter(val => val._uid !== o2._uid);
                
                o2.connections = o2.connections
                    .filter(val => val._uid !== o1._uid);
            }
        };
        
        class Node extends MarsObject {
            constructor(cfg = {}) {
                super(cfg);
                this.connections = [];
            }
            /*
             Description:
                Connects this Node to one or more Edges.
             Usage:
                connect(edges)
                    Connects this Node to all Edges in an array.
                connect(edge1[, edge2, ...edgeN])
                    Connects this Node to all Edges supplied as arguments.
             */
            connect() {
                if (arguments.length === 1 && _.isArray(arguments[0])) {
                    _proto.connectToEdges.call(this, arguments[0]);
                } else {
                    _proto.connectToEdges.call(this, _.toArray(arguments));
                }
                
                return this;
            }
            /*
             Description:
                Disconnects this Node from one or more Edges.
             Usage:
                disconnect(edges)
                    Disconnects this Node from all Edges in an array.
                disconnect(edge1[, edge2, ...edgeN])
                    Disconnects this Node from all Edges supplied as arguments.
             */
            disconnect() {
                if (arguments.length === 1 && _.isArray(arguments[0])) {
                    _proto.disconnectMultiple(this, arguments[0]);
                } else {
                    _proto.disconnectMultiple(this, _.toArray(arguments));
                }
                
                return this;
            }
            /*
             Description:
                Checks to see if this Node is connected to a specific Edge, and
                if so returns true, otherwise it returns false.
             Usage:
                connected(edge)
                    Checks to see if this Node is connected to the `edge`.
                    `edge` must be an instance of Graph.Edge.
             */
            connected(testEdge) {
                if (!(testEdge instanceof Graph.Edge)) {
                    return false;
                }
                return _.findIndex(this.connections,
                    edge => edge._uid === testEdge._uid) !== -1;                
            }
        }
        
        class Edge extends MarsObject {
            constructor(cfg = {}) {
                super(cfg);
                this.connections = [];
            }
            /*
             Description:
                Connects this Edge to one or more Nodes.
             Usage:
                connect(nodes)
                    Connects this Edge to all Nodes in an array.
                connect(node1[, node2, ...nodeN])
                    Connects this Edge to all Nodes supplied as arguments.
             */
            connect() {
                if (arguments.length === 1 && _.isArray(arguments[0])) {
                    _proto.connectToNodes.call(this, arguments[0]);
                } else {
                    _proto.connectToNodes.call(this, _.toArray(arguments));
                }
                
                return this;
            }
            /*
             Description:
                Disconnects this Edge from one or more Nodes.
             Usage:
                disconnect(nodes)
                    Disconnects this Edge from all Nodes in an array.
                disconnect(node1[, node2, ...nodeN])
                    Disconnects this Edge from all Nodes supplied as arguments.
             */
            disconnect() {
                if (arguments.length === 1 && _.isArray(arguments[0])) {
                    _proto.disconnectMultiple(this, arguments[0]);
                } else {
                    _proto.disconnectMultiple(this, _.toArray(arguments));
                }
                
                return this;
            }
            /*
             Description:
                Checks to see if this Node is connected to a specific Edge, and
                if so returns true, otherwise it returns false.
             Usage:
                connected(node)
                    Checks to see if this Edge is connected to the `node`.
                    `node` must be an instance of Graph.Node.
             */
            connected(testNode) {
                if (!(testNode instanceof Graph.Node)) {
                    return false;
                }
                return _.findIndex(this.connections,
                    node => node._uid === testNode._uid) !== -1;
            }
        }
        
        return [Node, Edge];
        
    })();
    
    
    
    Graph.Node = Node;
    Graph.Edge = Edge;
    
    module.exports = Graph;
    return Graph;
    
})();
