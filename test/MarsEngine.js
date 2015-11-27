var assert = require("assert");
var _ = require("underscore");

describe("Mars Engine", function() {
    
    describe("Graphs", function() {
        
        var Graph = require("../Mars/build/Graph.js");
        
        describe("Graph", function() {
            
            describe("on", function() {
                
                it("should exist as a method", function() {
                    
                    var graph = new Graph();
                    
                    assert.notEqual(graph.on, undefined);
                    assert.equal(typeof graph.on, "function");
                    
                });
                
                it("should add event listeners when called", function() {
                    
                    var graph = new Graph();
                    
                    var listener = function() {
                        // Hi
                    };
                    
                    graph.on("test", listener);
                    
                    assert.notEqual(graph._listeners, undefined);
                    assert.notEqual(graph._listeners["test"], undefined);
                    assert.equal(graph._listeners["test"].constructor, Array);
                    assert.equal(graph._listeners["test"].length, 1);
                    assert.equal(typeof graph._listeners["test"][0], "function");
                    assert.equal(graph._listeners["test"][0].toString(), listener.toString());
                    
                });
                
                it("should only accept strings as event names", function() {
                    
                    var graph = new Graph();
                    
                    var key = 2;
                    
                    graph.on(key, function() {});
                    
                    assert.equal(graph._listeners[key], undefined);
                    
                });
                
                it("should only accept functions as listeners", function() {
                    
                    var graph = new Graph();
                    
                    graph.on("test", "No. Just no");
                    
                    assert.equal(graph._listeners["test"], undefined);
                    
                });
                
                it("should add multiple valid listeners in an array", function() {
                    
                    var graph = new Graph();
                    
                    var fn1 = function() {
                        // Function 1
                    };
                    
                    var fn2 = function() {
                        // Function 2
                    }
                    
                    graph.on("test", fn1);
                    
                    graph.on("test", fn2);
                    
                    assert.equal(graph._listeners["test"].length, 2);
                    assert.equal(graph._listeners["test"][0], fn1);
                    assert.equal(graph._listeners["test"][1], fn2);
                    
                });
                
            });
            
            describe("fire", function() {
                
                
                
            });
            
        });
        
        describe("Node", function() {
            
            
            
        });
        
        describe("Connection", function() {
            
            
            
        });
        
    });
    
});
