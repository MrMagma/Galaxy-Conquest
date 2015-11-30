var Graph = (function() {
    
    let _ = require("./underscore-extended.js");
    
    let UIDGenerator = require("./UIDGenerator");
    
    const CALLBACK_UID_KEY = "_mars_graph_callback_uid";
    const CHANGE_UID_PREFIX = "mars_graph_change_uid_";
    let uidGenerator = new UIDGenerator({
        sequenceLength: 30
    });
    
    var GraphObject = (function() {
        
        function callbackify(callback) {
            if (_.isFunction(callback)) {
                if (!callback[CALLBACK_UID_KEY]) {
                    callback[CALLBACK_UID_KEY] = uidGenerator.generate();
                }
            } else if(callback.constructor === Array) {
                callback.map(fn => {
                    if (!fn[CALLBACK_UID_KEY]) {
                        fn[CALLBACK_UID_KEY] = uidGenerator.generate();
                    }
                });
            }
            return callback;
        };
        
        let _proto = {
            onJSON(json) {
                if (!_.isObject(json)) {
                    return this;
                }
                
                for (let evt in json) {
                    if (json.hasOwnProperty(evt)) {
                        _proto.onEvtCallback.call(this, evt, json[evt]);
                    }
                }
                
                return this;
            },
            onEvtCallback(evt, callbacks) {
                if (!_.isString(evt) || _.isUndefined(callbacks)) {
                    return this;
                }
                
                if (callbacks.constructor !== Array) {
                    callbacks = [callbacks];
                }
                
                callbacks = callbacks.filter(val => {
                    return _.isFunction(val);
                }).map(callbackify);
                
                if (!callbacks.length) {
                    return this;
                }
                
                if (_.isUndefined(this._listeners[evt]) ||
                    this._listeners[evt].constructor !== Array) {
                    this._listeners[evt] = [];
                }
                
                this._listeners[evt].push.apply(this._listeners[evt], callbacks);
                
                return this;
            }
        };
        
        class GraphObject {
            constructor({data = {}, listen = {}, checks = {}, change = {}}) {
                this._listeners = {};
                this._data = {};
                this._checks = {};
                
                for (let evt in listen) {
                    if (listen.hasOwnProperty(evt)) {
                        this.on(evt, listen[evt]);
                    }
                }
                this.data(data);
                this.check(checks);
                this.process(change);
            }
            /*
             Description:
                Adds one or more event listeners to this object
             Usage:
                on(event, callback)
                    Adds `callback` as a listener for the `event` event
                on(event, callbacks)
                    Adds all methods within the `callbacks` array as listeners
                    for the `event` event
                on(json)
                    Uses a `json` object where the keys are event names and the
                    values are event listeners (or arrays of listeners) and Adds
                    them
             */
            on() {
                if (arguments.length === 1) {
                    return _proto.onJSON.apply(this, arguments);
                }
                if (arguments.length >= 2) {
                    return _proto.onEvtCallback.apply(this, arguments);
                }
                return this;
            }
            /*
             Description:
                Unbinds one or more event listeners from an object
             Usage:
                off(event, listener)
                    Removes the listener on the `event` event matching `listener`
                    (if any)
                off(event, listeners)
                    Unbinds all listeners within the `listeners` array from the
                    `event` event
                off(json)
                    Uses a JSON object where the keys are event names and the values
                    are event listeners (or groups of them) and remove all listeners
                    from their respective events
             */
            off() {
                if (arguments.length === 1) {
                    return this._offJSON.apply(this, arguments);
                }
                if (arguments.length >= 2) {
                    return this._offEvtCallback.apply(this, arguments);
                }
                return this;
            }
            _offJSON(json) {
                if (!_.isObject(json)) {
                    return this;
                }
                
                for (let evt in json) {
                    if (json.hasOwnProperty(evt)) {
                        this._offEvtCallback(evt, json[evt]);
                    }
                }
                
                return this;
            }
            _offEvtCallback(evt, callbacks = []) {
                if (this._listeners[evt] === undefined) {
                    return this;
                }
                
                if (callbacks.constructor !== Array) {
                    callbacks = [callbacks];
                }
                
                callbacks = callbacks.filter(val => {
                    return (_.isFunction(val) && val[CALLBACK_UID_KEY]);
                });
                
                for (let listener of callbacks) {
                    let uid = listener[CALLBACK_UID_KEY];
                    
                    let filtered = this._listeners[evt].filter(val => {
                        return (val[CALLBACK_UID_KEY] !== uid);
                    });
                    
                    if (!filtered.length) {
                        delete this._listeners[evt];
                    } else {
                        this._listeners[evt] = filtered;
                    }
                }
                
                return this;
            }
            /*
             Description:
                Fires one or more events with optional data
             Usage:
                fire(event, data)
                    Fires the `event` event passing the `data` object to it
                fire(events, data)
                    Fires all events in `events` passing the data object to them
                fire(json)
                    `json` is a JSON object containing the names of events as keys
                    and the data to pass to them when fired as values
             */
            fire() {
                if (!arguments.length) {
                    return this;
                }
                
                if (arguments.length === 1 && _.isObject(arguments[0]) &&
                    arguments[0].constructor !== Array) {
                    return this._fireJSON.apply(this, arguments);
                }
                if (arguments[0].constructor === Array) {
                    return this._fireEvents.apply(this, arguments);
                }
                if (_.isString(arguments[0])) {
                    return this._fireEvent.apply(this, arguments);
                }
                
                return this;
            }
            _fireJSON(json) {
                for (let eventName in json) {
                    if (json.hasOwnProperty(eventName)) {
                        this._fireEvent(eventName, json[eventName]);
                    }
                }
                return this;
            }
            _fireEvents(eventNames, data) {
                for (let eventName of eventNames) {
                    this._fireEvent(eventName, data);
                }
                return this;
            }
            _fireEvent(eventName, data) {
                if (this._listeners.hasOwnProperty(eventName)) {
                    for (let listener of this._listeners[eventName]) {
                        listener(data);
                    }
                }
                return this;
            }
            data() {
                if (arguments.length === 1) {
                    this._data = _.merge(this._data, arguments[0]);
                } else if (arguments.length >= 2) {
                    this._dataKeyValue.apply(this, arguments);
                }
                return this._data;
            }
            _dataKeyValue(path, value) {
                if (!_.isString(path)) {
                    return this;
                }
                
                let {ref, key} = _.getPathData(this._data, path);
                
                if (ref !== undefined) {
                    ref[key] = value;
                }
            }
            process() {
                if (arguments.length === 1) {
                    this._processJSON.apply(this, arguments);
                } else if (arguments.length === 2) {
                    this._processKeyValue.apply(this, arguments);
                }
                return this;
            }
            _processJSON(json, path = "") {
                for (let key in json) {
                    if (json.hasOwnProperty(key)) {
                        let valPath = path;
                        if (valPath.length) {
                            valPath += ".";
                        }
                        valPath += key;
                        
                        if (_.isFunction(json[key]) || _.isArray(json[key])) {
                            this._processKeyValue(valPath, json[key]);
                        } else if (_.isObject(json[key])) {
                            this._processJSON(json[key], valPath);
                        }
                    }
                }
            }
            _processKeyValue(path, listeners) {
                if (!_.isString(path)) {
                    return this;
                }
                
                if (listeners.constructor !== Array) {
                    listeners = [listeners];
                }
                
                listeners = listeners.filter(val => {
                    return _.isFunction(val);
                });
                
                let [getKey, setKey, verifyKey, init] = this._checkKeys(path);
                
                this._checks[setKey].push.apply(this._checks[setKey], listeners);
                
                let {ref, key} = _.getPathData(this._data, path);
                
                if (ref !== undefined && init) {
                    this._attachAccessors(ref, key, path, [
                        getKey,
                        setKey,
                        verifyKey
                    ]);
                }
            }
            fetch() {
                
            }
            check() {
                if (arguments.length === 1) {
                    this._checkJSON.apply(this, arguments);
                } else if (arguments.length === 2) {
                    this._checkKey.apply(this, arguments);
                }
                return this;
            }
            _checkJSON(json, path = "") {
                for (let key in json) {
                    if (json.hasOwnProperty(key)) {
                        let valPath = path;
                        if (valPath.length) {
                            valPath += ".";
                        }
                        valPath += key;
                        
                        if (_.isFunction(json[key]) || _.isArray(json[key])) {
                            this._checkKey(valPath, json[key]);
                        } else if (_.isObject(json[key])) {
                            this._checkJSON(json[key], valPath);
                        }
                    }
                }
            }
            _checkKey(path, checks) {
                if (!_.isString(path) || _.isUndefined(checks)) {
                    return this;
                }
                
                if (checks.constructor !== Array) {
                    checks = [checks];
                }
                
                checks = checks.filter(val => {
                    return (_.isFunction(val));
                });
                
                let [getKey, setKey, verifyKey, init] = this._checkKeys(path);
                
                this._checks[verifyKey].push.apply(this._checks[verifyKey], checks);
                
                let {ref, key} = _.getPathData(this._data, path);
                
                if (ref !== undefined && init) {
                    this._attachAccessors(ref, key, path, [
                        getKey,
                        setKey,
                        verifyKey
                    ]);
                }            
                
                return this;
            }
            _checkKeys(path) {
                let setKey = `${CHANGE_UID_PREFIX}${path}_set`;
                let getKey = `${CHANGE_UID_PREFIX}${path}_get`;
                let verifyKey = `${CHANGE_UID_PREFIX}${path}_verify`;
                let init = false;
                
                if (this._checks[verifyKey] === undefined) {
                    init = true;
                    this._checks[verifyKey] = [];
                }
                if (this._checks[getKey] === undefined) {
                    init = true;
                    this._checks[getKey] = [];
                }
                if (this._checks[setKey] === undefined) {
                    init = true;
                    this._checks[setKey] = [];
                }
                
                return [getKey, setKey, verifyKey, init];
            }
            _attachAccessors(ref, key, path, [getKey, setKey, verifyKey]) {
                let val = ref[key];
                
                Object.defineProperty(ref, key, {
                    set: (function(nVal) {
                        if (this._checks[verifyKey] !== undefined) {
                            for (let check of this._checks[verifyKey]) {
                                if (!check(nVal)) {
                                    return;
                                }
                            }
                        }
                        
                        if (this._checks[setKey] !== undefined) {
                            for (let processor of this._checks[setKey]) {
                                let possible = processor(nVal);
                                
                                if (possible !== undefined) {
                                    nVal = possible;
                                }
                            }
                        }
                        
                        val = nVal;
                    }).bind(this),
                    get: (function() {
                        let retVal = val;
                        
                        if (this._checks[getKey] !== undefined) {
                            for (fetcher of this._checks[getKey]) {
                                retVal = fetchers(val);
                            }
                        }
                        
                        return retVal;
                    }).bind(this)
                })
            }
        }
    
        return GraphObject;
    
    })();
    
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
