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
            } else if (_.isArray(callback)) {
                callback.map(fn => {
                    if (!fn[CALLBACK_UID_KEY]) {
                        fn[CALLBACK_UID_KEY] = uidGenerator.generate();
                    }
                });
            }
            return callback;
        }
        
        function getCheckKeys(self, path) {
            let setKey = `${CHANGE_UID_PREFIX}${path}_set`;
            let getKey = `${CHANGE_UID_PREFIX}${path}_get`;
            let verifyKey = `${CHANGE_UID_PREFIX}${path}_verify`;
            let init = false;
            
            if (self._checks[verifyKey] === undefined) {
                init = true;
                self._checks[verifyKey] = [];
            }
            if (self._checks[getKey] === undefined) {
                init = true;
                self._checks[getKey] = [];
            }
            if (self._checks[setKey] === undefined) {
                init = true;
                self._checks[setKey] = [];
            }
            
            return [getKey, setKey, verifyKey, init];
        }
        
        function attachAccessors(self, path, [getKey, setKey, verifyKey]) {
            let {ref, key} = _.getPathData(self._data, path);
            
            if (ref === undefined) {
                return this;
            }
            
            let val = ref[key];
            
            Object.defineProperty(ref, key, {
                set(nVal) {
                    if (self._checks[verifyKey] !== undefined) {
                        for (let check of self._checks[verifyKey]) {
                            if (!check(nVal)) {
                                return;
                            }
                        }
                    }
                    
                    if (self._checks[setKey] !== undefined) {
                        for (let processor of self._checks[setKey]) {
                            let possible = processor(nVal);
                            
                            if (possible !== undefined) {
                                nVal = possible;
                            }
                        }
                    }
                    
                    val = nVal;
                },
                get() {
                    let retVal = val;
                    
                    if (self._checks[getKey] !== undefined) {
                        for (fetcher of self._checks[getKey]) {
                            retVal = fetchers(val);
                        }
                    }
                    
                    return retVal;
                }
            })
        }
        
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
                
                if (!_.isArray(callbacks)) {
                    callbacks = [callbacks];
                }
                
                callbacks = callbacks.filter(val => {
                    return _.isFunction(val);
                }).map(callbackify);
                
                if (!callbacks.length) {
                    return this;
                }
                
                if (!_.isArray(this._listeners[evt])) {
                    this._listeners[evt] = [];
                }
                
                this._listeners[evt] = this._listeners[evt].concat(callbacks);
                
                return this;
            },
            offJSON(json) {
                if (!_.isObject(json)) {
                    return this;
                }
                
                for (let evt in json) {
                    if (json.hasOwnProperty(evt)) {
                        _proto.offEvtCallback.call(this, evt, json[evt]);
                    }
                }
                
                return this;
            },
            offEvtCallback(evt, callbacks = []) {
                if (this._listeners[evt] === undefined) {
                    return this;
                }
                
                if (!_.isArray(callbacks)) {
                    callbacks = [callbacks];
                }
                
                callbacks = callbacks.filter(val => {
                    return (_.isFunction(val) && val[CALLBACK_UID_KEY]);
                }).map(val => {
                    return val[CALLBACK_UID_KEY];
                });
                
                if (!callbacks.length) {
                    return this;
                }
                
                let filtered = this._listeners[evt].filter(val => {
                    return (callbacks.indexOf(val[CALLBACK_UID_KEY]) === -1)
                });
                
                if (!filtered.length) {
                    delete this._listeners[evt];
                } else {
                    this._listeners[evt] = filtered;
                }
                
                return this;
            },
            fireJSON(json) {
                for (let eventName in json) {
                    if (json.hasOwnProperty(eventName)) {
                        _proto.fireEvent.call(this, eventName, json[eventName]);
                    }
                }
                return this;
            },
            fireEvent(eventNames, data) {
                if (!_.isArray(eventNames)) {
                    eventNames = [eventNames];
                }
                
                eventNames = eventNames.filter(val => {
                    return (_.isString(val));
                });
                
                if (!eventNames.length) {
                    return this;
                }
                
                for (let evtName of eventNames) {
                    if (this._listeners.hasOwnProperty(evtName)) {
                        for (let listener of this._listeners[evtName]) {
                            listener(data);
                        }
                    }
                }
                
                return this;
            },
            dataKeyValue(path, value) {
                if (!_.isString(path)) {
                    return this;
                }
                
                let {ref, key} = _.getPathData(this._data, path);
                
                if (ref !== undefined) {
                    ref[key] = value;
                }
            },
            processJSON(json, path = "") {
                for (let key in json) {
                    if (json.hasOwnProperty(key)) {
                        let valPath = path;
                        if (valPath.length) {
                            valPath += ".";
                        }
                        valPath += key;
                        
                        if (_.isFunction(json[key]) || _.isArray(json[key])) {
                            _proto.processKeyValue.call(this, valPath, json[key]);
                        } else if (_.isObject(json[key])) {
                            _proto.processJSON.call(this, json[key], valPath);
                        }
                    }
                }
            },
            processKeyValue(path, listeners) {
                if (!_.isString(path)) {
                    return this;
                }
                
                if (!_.isArray(listeners)) {
                    listeners = [listeners];
                }
                
                listeners = listeners.filter(val => {
                    return _.isFunction(val);
                });
                
                let [getKey, setKey, verifyKey, init] = getCheckKeys(this, path);
                
                this._checks[setKey] = this._checks[setKey].concat(listeners);
                
                if (init) {
                    attachAccessors(this, path, [
                        getKey,
                        setKey,
                        verifyKey
                    ]);
                }
            },
            checkJSON(json, path = "") {
                for (let key in json) {
                    if (json.hasOwnProperty(key)) {
                        let valPath = path;
                        if (valPath.length) {
                            valPath += ".";
                        }
                        valPath += key;
                        
                        if (_.isFunction(json[key]) || _.isArray(json[key])) {
                            _proto.checkKey.call(this, valPath, json[key]);
                        } else if (_.isObject(json[key])) {
                            _proto.checkJSON.call(this, json[key], valPath);
                        }
                    }
                }
            },
            checkKey(path, checks) {
                if (!_.isString(path) || _.isUndefined(checks)) {
                    return this;
                }
                
                if (!_.isArray(checks)) {
                    checks = [checks];
                }
                
                checks = checks.filter(val => {
                    return (_.isFunction(val));
                });
                
                let [getKey, setKey, verifyKey, init] = getCheckKeys(this, path);
                
                this._checks[verifyKey] = this._checks[verifyKey].concat(checks);
                
                if (init) {
                    attachAccessors(this, path, [
                        getKey,
                        setKey,
                        verifyKey
                    ]);
                }            
                
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
                    return _proto.offJSON.apply(this, arguments);
                }
                if (arguments.length >= 2) {
                    return _proto.offEvtCallback.apply(this, arguments);
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
                if (arguments.length === 1 && _.isObject(arguments[0])) {
                    _proto.fireJSON.apply(this, arguments);
                } else if (arguments.length >= 1) {
                    _proto.fireEvent.apply(this, arguments);
                }
                
                return this;
            }
            data() {
                if (arguments.length === 1) {
                    this._data = _.merge(this._data, arguments[0]);
                } else if (arguments.length >= 2) {
                    _proto.dataKeyValue.apply(this, arguments);
                }
                return this._data;
            }
            process() {
                if (arguments.length === 1) {
                    _proto.processJSON.apply(this, arguments);
                } else if (arguments.length === 2) {
                    _proto.processKeyValue.apply(this, arguments);
                }
                return this;
            }
            fetch() {
                
            }
            check() {
                if (arguments.length === 1) {
                    _proto.checkJSON.apply(this, arguments);
                } else if (arguments.length === 2) {
                    _proto.checkKey.apply(this, arguments);
                }
                return this;
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
