var Graph = (function() {
    
    let _ = require("underscore");
    let UIDGenerator = require("./UIDGenerator");
    
    const CALLBACK_UID_KEY = "_mars_graph_callback_uid";
    let uidGenerator = new UIDGenerator({
        sequenceLength: 30
    });
    
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
        _callbackify(callback) {
            if (typeof callback === "function") {
                if (!callback[CALLBACK_UID_KEY]) {
                    callback[CALLBACK_UID_KEY] = uidGenerator.generate();
                }
            } else if(callback.constructor === Array) {
                callback.map(fn => {
                    if (!fn[CALLBACK_UID_KEY]) {
                        fn[CALLBACK_UID_KEY] = uidGenerator.generate();
                    }
                })
            }
        }
        on(...args) {
            if (args.length === 1) {
                return this._onJSON.apply(this, args);
            }
            if (args.length >= 2) {
                return this._onEvtCallback.apply(this, args);
            }
            return this;
        }
        _onJSON(json) {
            if (typeof json !== "object") {
                return this;
            }
            
            for (let evt in json) {
                if (json.hasOwnProperty(evt)) {
                    this._onEvtCallback(evt, json[evt]);
                }
            }
            
            return this;
        }
        _onEvtCallback(evt, callback = () => {}) {
            if (typeof evt !== "string" ||
                (typeof callback !== "function" && callback.constructor !== Array)) {
                return this;
            }
            
            if (typeof this._listeners[evt] === "undefined" ||
                this._listeners[evt].constructor !== Array) {
                this._listeners[evt] = [];
            }
            
            if (typeof callback === "function") {
                callback[CALLBACK_UID_KEY] = uidGenerator.generate();
                this._listeners[evt].push(callback);
            } else if(callback.constructor === Array) {
                for (let listener of callback) {
                    this._onEvtCallback(evt, listener);
                }
            }
            
            return this;
        }
        off(...args) {
            if (args.length === 1) {
                return this._offJSON.apply(this, args);
            }
            if (args.length >= 2) {
                return this._offEvtCallback.apply(this, args);
            }
            return this;
        }
        _offJSON(json) {
            if (typeof json !== "object") {
                return this;
            }
            
            for (let evt in json) {
                if (json.hasOwnProperty(evt)) {
                    this._offEvtCallback(evt, json[evt]);
                }
            }
            
            return this;
        }
        _offEvtCallback(evt, callback) {
            if (this._listeners[evt] === undefined) {
                return this;
            }
            
            if (typeof callback === "function") {
                if (!callback[CALLBACK_UID_KEY]) {
                    return this;
                }
                let callbackUid = callback[CALLBACK_UID_KEY];
                let filtered = this._listeners[evt].filter(val => {
                    return (val[CALLBACK_UID_KEY] !== callbackUid);
                });
                
                if (!filtered.length) {
                    delete this._listeners[evt];
                } else {
                    this._listeners[evt] = filtered;
                }
            } else if (callback.constructor === Array) {
                for (let listener of callback) {
                    this._offEvtCallback(evt, listener);
                }
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
