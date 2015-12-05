var assert = require("assert");
var _ = require("underscore");

describe("Mars Engine", function() {
    
    describe("Graphs", function() {
        
        var Graph = require("../Mars/build/Graph.js");
        var Node = Graph.Node;
        var Edge = Graph.Edge;
        
        var MarsObject = require("../Mars/build/MarsObject.js");
        
        describe("Graph", function() {
            
            it("should inherit from MarsObject", function() {
                
                assert.equal(new Graph() instanceof MarsObject, true);
                
            });
            
        });
        
        describe("Node", function() {
            
            it("should inherit from MarsObject", function() {
                
                assert.equal(new Node() instanceof MarsObject, true);
                
            });
            
            it("should have a connect method", function() {
                
                var node = new Node();
                
                assert.notEqual(node.connect, undefined);
                assert.equal(_.isFunction(node.connect), true);
                
            });
            
            describe("the connect method", function() {
                
                it("should connect to Edges", function() {
                    
                    var node = new Node();
                    
                    var edge = new Edge();
                    
                    node.connect(edge);
                    
                    assert.notEqual(node.connections, undefined);
                    assert.equal(_.isArray(node.connections), true);
                    assert.equal(node.connections.length, 1);
                    assert.equal(node.connections[0] instanceof Edge, true);
                    assert.equal(_.isEqual(node.connections[0], edge), true);
                    
                });
                
                it("should be able to connect to multiple Edges", function() {
                    
                    var node = new Node();
                    
                    var edge1 = new Edge();
                    
                    var edge2 = new Edge();
                    
                    node.connect(edge1);
                    node.connect(edge2);
                    
                    assert.equal(node.connections.length, 2);
                    assert.equal(_.isEqual(node.connections[0], edge1), true);
                    assert.equal(_.isEqual(node.connections[1], edge2), true);
                    
                })
                
                it("should accept multiple arguments", function() {
                    
                    var node = new Node();
                    
                    var edge1 = new Edge();
                    
                    var edge2 = new Edge();
                    
                    node.connect(edge1, edge2);
                    
                    assert.equal(node.connections.length, 2);
                    assert.equal(_.isEqual(node.connections[0], edge1), true);
                    assert.equal(_.isEqual(node.connections[1], edge2), true);
                    
                });
                
                it("should accept an array of Edges", function() {
                    
                    var node = new Node();
                    
                    var edge1 = new Edge();
                    
                    var edge2 = new Edge();
                    
                    node.connect([edge1, edge2]);
                    
                    assert.equal(node.connections.length, 2);
                    assert.equal(_.isEqual(node.connections[0], edge1), true);
                    assert.equal(_.isEqual(node.connections[1], edge2), true);
                    
                });
                
                it("should only accept Edges", function() {
                    
                    var node1 = new Node();
                    
                    node1.connect(2);
                    
                    assert.equal(node1.connections.length, 0);
                    
                    var node2 = new Node();
                    
                    var edge = new Edge();
                    
                    node2.connect([42, edge]);
                    
                    assert.equal(node2.connections.length, 1);
                    assert.equal(_.isEqual(node2.connections[0], edge), true);
                    
                });
                
            });
            
            it("should have a disconnect method", function() {
                
                var node = new Node();
                
                assert.notEqual(node.disconnect, undefined);
                assert.equal(_.isFunction(node.disconnect), true);
                
            });
            
            describe("the disconnect method", function() {
                
                it("should be able to disconnect from Edges", function() {
                    
                    var node = new Node();
                    
                    var edge1 = new Edge();
                    var edge2 = new Edge();
                    
                    node.connect(edge1, edge2);
                    
                    node.disconnect(edge1);
                    
                    assert.equal(node.connections.length, 1);
                    assert.equal(_.isEqual(node.connections[0], edge2), true);
                    
                });
                
                it("should accept multiple arguments", function() {
                    
                    var node = new Node();
                    
                    var edge1 = new Edge();
                    var edge2 = new Edge();
                    var edge3 = new Edge();
                    var edge4 = new Edge();
                    
                    node.connect(edge1, edge2, edge3, edge4);
                    
                    node.disconnect(edge1, edge3);
                    
                    assert.equal(node.connections.length, 2);
                    assert.equal(_.union(node.connections, [edge2, edge4]).length, 2);
                    
                });
                
                it("should accept an array of edges", function() {
                    
                    var node = new Node();
                    
                    var edge1 = new Edge();
                    var edge2 = new Edge();
                    var edge3 = new Edge();
                    var edge4 = new Edge();
                    
                    node.connect(edge1, edge2, edge3, edge4);
                    
                    node.disconnect([edge1, edge3]);
                    
                    assert.equal(node.connections.length, 2);
                    assert.equal(_.union(node.connections, [edge2, edge4]).length, 2);
                    
                });
                
            });
            
            it("should have a connected method", function() {
                
                var node = new Node();
                
                assert.notEqual(node.connected, undefined);
                assert.equal(_.isFunction(node.connected), true);
                
            });
            
            describe("the connected method", function() {
                
                it("should return whether or not a Node is connected to a specific Edge", function() {
                    
                    var node = new Node();
                    
                    var edge1 = new Edge();
                    var edge2 = new Edge();
                    
                    node.connect(edge1);
                    
                    assert.equal(node.connected(edge1), true);
                    assert.equal(node.connected(edge2), false);
                    
                });
                
            });
            
        });
        
        describe("Edge", function() {
            
            it("should inherit from MarsObject", function() {
                
                assert.equal(new Edge() instanceof MarsObject, true);
                
            });
            
            it("should have a connect method", function() {
                
                var edge = new Edge();
                
                assert.notEqual(edge.connect, undefined);
                
            });
            
            describe("the connect method", function() {
            
                it("should be able to connect to Nodes", function() {
                    
                    var edge = new Edge();
                    
                    var node = new Node();
                    
                    edge.connect(node);
                    
                    assert.notEqual(edge.connections, undefined);
                    assert.equal(_.isArray(edge.connections), true);
                    assert.equal(edge.connections.length, 1);
                    assert.equal(_.isEqual(edge.connections[0], node), true);
                    
                });
                
                it("should be able to connect to multiple Nodes", function() {
                    
                    var edge = new Edge();
                    
                    var node1 = new Node();
                    
                    var node2 = new Node();
                    
                    edge.connect(node1);
                    edge.connect(node2);
                    
                    assert.equal(edge.connections.length, 2);
                    assert.equal(_.isEqual(edge.connections[0], node1), true);
                    assert.equal(_.isEqual(edge.connections[1], node2), true);
                    
                })
                
                it("should accept multiple arguments", function() {
                    
                    var edge = new Edge();
                    
                    var node1 = new Node();
                    
                    var node2 = new Node();
                    
                    edge.connect(node1, node2);
                    
                    assert.equal(edge.connections.length, 2);
                    assert.equal(_.isEqual(edge.connections[0], node1), true);
                    assert.equal(_.isEqual(edge.connections[1], node2), true);
                    
                });
                
                it("should accept an array of Nodes", function() {
                    
                    var edge = new Edge();
                    
                    var node1 = new Node();
                    
                    var node2 = new Node();
                    
                    edge.connect([node1, node2]);
                    
                    assert.equal(edge.connections.length, 2);
                    assert.equal(_.isEqual(edge.connections[0], node1), true);
                    assert.equal(_.isEqual(edge.connections[1], node2), true);
                    
                });
                
                it("should only accept Nodes", function() {
                    
                    var edge1 = new Edge();
                    
                    edge1.connect(2);
                    
                    assert.equal(edge1.connections.length, 0);
                    
                    var edge2 = new Edge();
                    
                    var node = new Node();
                    
                    edge2.connect([42, node]);
                    
                    assert.equal(edge2.connections.length, 1);
                    assert.equal(_.isEqual(edge2.connections[0], node), true);
                    
                });
                
            });
            
            it("should have a disconnect method", function() {
                
                var node = new Edge();
                
                assert.notEqual(node.disconnect, undefined);
                assert.equal(_.isFunction(node.disconnect), true);
                
            });
            
            describe("the disconnect method", function() {
                
                it("should be able to disconnect from Nodes", function() {
                    
                    var edge = new Edge();
                    
                    var node1 = new Node();
                    var node2 = new Node();
                    
                    edge.connect(node1, node2);
                    
                    edge.disconnect(node1);
                    
                    assert.equal(edge.connections.length, 1);
                    assert.equal(_.isEqual(edge.connections[0], node2), true);
                    
                });
                
                it("should accept multiple arguments", function() {
                    
                    var edge = new Edge();
                    
                    var node1 = new Node();
                    var node2 = new Node();
                    var node3 = new Node();
                    var node4 = new Node();
                    
                    edge.connect(node1, node2, node3, node4);
                    
                    edge.disconnect(node1, node3);
                    
                    assert.equal(edge.connections.length, 2);
                    assert.equal(_.union(edge.connections, [node2, node4]).length, 2);
                    
                });
                
                it("should accept an array of edges", function() {
                    
                    var edge = new Edge();
                    
                    var node1 = new Node();
                    var node2 = new Node();
                    var node3 = new Node();
                    var node4 = new Node();
                    
                    edge.connect(node1, node2, node3, node4);
                    
                    edge.disconnect([node1, node3]);
                    
                    assert.equal(edge.connections.length, 2);
                    assert.equal(_.union(edge.connections, [node2, node4]).length, 2);
                    
                });
                
                it("should have a connected method", function() {
                    
                    var edge = new Edge();
                    
                    assert.notEqual(edge.connected, undefined);
                    assert.equal(_.isFunction(edge.connected), true);
                    
                });
                
                describe("the connected method", function() {
                    
                    it("should return whether or not a Node is connected to a specific Edge", function() {
                        
                        var edge = new Edge();
                        
                        var node1 = new Node();
                        var node2 = new Node();
                        
                        edge.connect(node1);
                        
                        assert.equal(edge.connected(node1), true);
                        assert.equal(edge.connected(node2), false);
                        
                    });
                    
                });
                
            });
            
        });
        
        describe("Graph", function() {
            
            it("should have an add method", function() {
                
                var graph = new Graph();
                
                assert.notEqual(graph.add, undefined);
                assert.equal(_.isFunction(graph.add), true);
                
            });
            
            describe("the add method", function() {
                
                it("should add a Node to the nodes list", function() {
                    
                    var graph = new Graph();
                    
                    var node = new Node();
                    
                    graph.add(node);
                    
                    assert.notEqual(graph.nodes, undefined);
                    assert.equal(graph.nodes.length, 1);
                    assert.equal(_.isEqual(graph.nodes[0], node), true);
                    
                });
                
                it("should add multiple Nodes to the nodes list", function() {
                    
                    var graph = new Graph();
                    
                    var node1 = new Node();
                    var node2 = new Node();
                    
                    graph.add(node1, node2);
                    
                    assert.equal(graph.nodes.length, 2);
                    assert.equal(_.union(graph.nodes, [node1, node2]).length, 2);
                    
                });
                
                it("should add an Edge to the edges list", function() {
                    
                    var graph = new Graph();
                    
                    var edge = new Edge();
                    
                    graph.add(edge);
                    
                    assert.equal(graph.edges.length, 1);
                    assert.equal(_.isEqual(graph.edges[0], edge), true);
                    
                });
                
                it("should add multiple Edges to the edges list", function() {
                    
                    var graph = new Graph();
                    
                    var edge1 = new Edge();
                    var edge2 = new Edge();
                    
                    graph.add(edge1, edge2);
                    
                    assert.equal(graph.edges.length, 2);
                    assert.equal(_.union(graph.edges, [edge1, edge2]).length, 2);
                    
                });
                
                it("should accept Nodes and Edges mixed", function() {
                    
                    var graph = new Graph();
                    
                    var edge1 = new Edge();
                    var node1 = new Node();
                    var node2 = new Node();
                    
                    graph.add(node1, edge1, node2);
                    
                    assert.equal(graph.edges.length, 1);
                    assert.equal(_.isEqual(graph.edges[0], edge1), true);
                    assert.equal(graph.nodes.length, 2);
                    assert.equal(_.union(graph.nodes, [node1, node2]).length, 2);
                    
                });
                
                it("should accept an array of Nodes and Edges", function() {
                    
                    var graph = new Graph();
                    
                    var edge1 = new Edge();
                    var node1 = new Node();
                    var node2 = new Node();
                    
                    graph.add([node1, edge1, node2]);
                    
                    assert.equal(graph.edges.length, 1);
                    assert.equal(_.isEqual(graph.edges[0], edge1), true);
                    assert.equal(graph.nodes.length, 2);
                    assert.equal(_.union(graph.nodes, [node1, node2]).length, 2);
                    
                });
                
                it("should only accept Nodes and Edges", function() {
                    
                    var graph = new Graph();
                    
                    var edge1 = new Edge();
                    var node1 = new Node();
                    var node2 = new Node();
                    
                    graph.add(node1, edge1, 35, node2);
                    
                    assert.equal(graph.edges.length, 1);
                    assert.equal(_.isEqual(graph.edges[0], edge1), true);
                    assert.equal(graph.nodes.length, 2);
                    assert.equal(_.union(graph.nodes, [node1, node2]).length, 2);
                    
                });
                
            });
            
            it("should have a remove method", function() {
                
                var graph = new Graph();
                
                assert.notEqual(graph.remove, undefined);
                assert.equal(_.isFunction(graph.remove), true);
                
            });
            
            describe("the remove method", function() {
                
                it("should remove a Node", function() {
                    
                    var graph = new Graph();
                    
                    var node1 = new Node();
                    var node2 = new Node();
                    
                    graph.add(node1, node2);
                    
                    graph.remove(node1);
                    
                    assert.equal(graph.nodes.length, 1);
                    assert.equal(_.isEqual(graph.nodes[0], node2), true);
                    
                });
                
                it("should remove multiple Nodes", function() {
                    
                    var graph = new Graph();
                    
                    var node1 = new Node();
                    var node2 = new Node();
                    var node3 = new Node();
                    var node4 = new Node();
                    
                    graph.add(node1, node2, node3, node4);
                    
                    graph.remove(node2, node3);
                    
                    assert.equal(graph.nodes.length, 2);
                    assert.equal(_.union(graph.nodes, [node1, node4]).length, 2);
                    
                });
                
                it("should remove an Edge", function() {
                    
                    var graph = new Graph();
                    
                    var edge1 = new Edge();
                    var edge2 = new Edge();
                    
                    graph.add(edge1, edge2);
                    
                    graph.remove(edge1);
                    
                    assert.equal(graph.edges.length, 1);
                    assert.equal(_.isEqual(graph.edges[0], edge2), true);
                    
                });
                
                it("should remove multiple Edges", function() {
                    
                    var graph = new Graph();
                    
                    var edge1 = new Edge();
                    var edge2 = new Edge();
                    var edge3 = new Edge();
                    var edge4 = new Edge();
                    
                    graph.add(edge1, edge2, edge3, edge4);
                    
                    graph.remove(edge2, edge3);
                    
                    assert.equal(graph.edges.length, 2);
                    assert.equal(_.union(graph.edges, [edge1, edge4]).length, 2);
                    
                });
                
                it("should accept a combination of Nodes and Edges", function() {
                    
                    var graph = new Graph();
                    
                    var node1 = new Node();
                    var node2 = new Node();
                    var edge1 = new Edge();
                    var edge2 = new Edge();
                    
                    graph.add(node1, edge1, node2, edge2);
                    
                    graph.remove(edge1, node2);
                    
                    assert.equal(graph.nodes.length, 1);
                    assert.equal(_.isEqual(graph.nodes[0], node1), true);
                    assert.equal(graph.edges.length, 1);
                    assert.equal(_.isEqual(graph.edges[0], edge2), true);
                    
                });
                
                it("should accept an array of Nodes and Edges", function() {
                    
                    var graph = new Graph();
                    
                    var node1 = new Node();
                    var node2 = new Node();
                    var edge1 = new Edge();
                    var edge2 = new Edge();
                    
                    graph.add(node1, edge1, node2, edge2);
                    
                    graph.remove([edge1, node2]);
                    
                    assert.equal(graph.nodes.length, 1);
                    assert.equal(_.isEqual(graph.nodes[0], node1), true);
                    assert.equal(graph.edges.length, 1);
                    assert.equal(_.isEqual(graph.edges[0], edge2), true);
                    
                });
                
            });
            
        });
        
    });
    
});
