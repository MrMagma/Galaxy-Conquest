var Graph = (function() {
    
    class GraphObject {
        constructor({data = {}, listen = {}, verify = {}, change = {}}) {
            this._listeners = {};
            this._data = {};
            this._checks = {};
            this._changeListeners = {};
            
            for (let evt in listen) {
                if (listen.hasOwnProperty(evt)) {
                    this.on(evt, listen[evt]);
                }
            }
            this.data(data);
            this.verify(verify);
            this.change(change);
        }
        data(dat) {
            this._data = _.extendOwn(this._data, dat);
            return this;
        }
        on(evt, callback = () => {}) {
            if (typeof this._listeners[evt] === "undefined" ||
                window.isNaN(this.listeners[evt]) ||
                this._listeners[evt].constructor !== Array) {
                this.listeners[evt] = [];
            }
            
            if (callback.constructor === Function) {
                this._listeners[evt].push(callback)
            } else if(callback.constructor === Array) {
                this._listeners[evt].push.apply(this._listeners[evt],
                    callback);
            }
            
            return this;
        }
        fire(evt, data = {}) {
            if (typeof this.listeners[evt] !== "undefined") {
                for (let listener of this.listeners[evt]) {
                    listener(data);
                }
            }
            
            return this;
        }
        change(listeners) {
            _.mapObject(listeners, function(value, key) {
                
            });
            return this;
        }
        verify(checks) {
            _.mapObject(checks, function(value, key) {
                
            });
            return this;
        }
    }
    
    class Graph extends GraphObject {
        constructor(cfg = {}) {
            super(cfg);
        }
    }
    
    
    
    class Node extends GraphObject {
        constructor(cfg = {}) {
            super(cfg);
        }
    }
    
    
    
    class Edge extends GraphObject {
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
