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
            connectToEdges(edges) {
                for (let edge of edges) {
                    if (edge instanceof Graph.Edge && !this.connected(edge)) {
                        this.connections.push(edge);
                        edge.connect(this);
                    }
                }
            },
            // disconnectFromEdges(disconnect = []) {
            //     disconnect = disconnect.map(edge => edge._uid);
            //     this.connections = this.connections.filter(edge => {
            //         if (disconnect.indexOf(edge._uid) !== -1) {
            //             edge.disconnect(this);
            //             return false;
            //         }
            //         return true;
            //     });
            // },
            connectToNodes(nodes) {
                for (let node of nodes) {
                    if (node instanceof Graph.Node && !this.connected(node)) {
                        this.connections.push(node);
                        node.connect(this);
                    }
                }
            },
            // disconnectFromNodes(disconnect) {
            //     disconnect = disconnect.map(node => node._uid);
            //     this.connections = this.connections.filter(node => {
            //         if (disconnect.indexOf(node._uid) !== -1) {
            //             node.disconnect(this);
            //             return false;
            //         }
            //         return true;
            //     });
            // }
            disconnectMultiple(o1, disconnect) {
                for (let o2 of disconnect) {
                    _proto.disconnectFrom(o1, o2);
                }
            },
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
                    _proto.disconnectMultiple(this, arguments[0]);
                } else {
                    _proto.disconnectMultiple(this, _.toArray(arguments));
                }
                
                return this;
            }
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
            connect() {
                if (arguments.length === 1 && _.isArray(arguments[0])) {
                    _proto.connectToNodes.call(this, arguments[0]);
                } else {
                    _proto.connectToNodes.call(this, _.toArray(arguments));
                }
                
                return this;
            }
            disconnect() {
                if (arguments.length === 1 && _.isArray(arguments[0])) {
                    _proto.disconnectMultiple(this, arguments[0]);
                } else {
                    _proto.disconnectMultiple(this, _.toArray(arguments));
                }
                
                return this;
            }
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
