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
                    assert.equal(_.isEqual(node2.connection[0]), true);
                    
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
            
        });
        
        describe("Edge", function() {
            
            it("should inherit from MarsObject", function() {
                
                assert.equal(new Edge() instanceof MarsObject, true);
                
            });
            
            it("should be able to connect to Nodes", function() {
                
                
                
            });
            
            it("should be able to connect to multiple Nodes", function() {
                
                
                
            });
            
            it("should be able to disconnect from Nodes", function() {
                
                
                
            });
            
            it("should be able to disconnect from multiple Nodes", function() {
                
                
                
            });
            
        });
        
    });
    
});
