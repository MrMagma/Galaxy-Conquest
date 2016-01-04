var assert = require("assert");
var _ = require("underscore");

describe("MarsGame", function() {
    
    var MarsGame = require("../Mars/build/MarsGame.js");
    var MarsObject = require("../Mars/build/MarsObject.js");
    
    it("should extend MarsObject", function() {
        
        var game = new MarsGame();
        
        assert.equal(game instanceof MarsObject, true);
        
        clearTimeout(game._frameTimeout);
        
    });
    
    it("should have frameCount data", function() {
        
        var game = new MarsGame();
        
        assert.notEqual(game.data("frameCount"), undefined);
        
        clearTimeout(game._frameTimeout);
        
    });
    
    it("should have fps data", function() {
        
        var game = new MarsGame();
        
        assert.notEqual(game.data("fps"), undefined);
        
        clearTimeout(game._frameTimeout);
        
    });
    
    it("fps should default to 60", function() {
        
        var game = new MarsGame();
        
        assert.equal(game.data("fps"), 60);
        
        clearTimeout(game._frameTimeout);
        
    });
    
    // NOTE (Joshua): I'm not going to write any more tests for MarsGame until
    // I can figure out how to manage the fact that it runs a loop that I'd
    // need to test as well.
    
});
