var MarsObject = (function() {
    let _ = require("./underscore-extended.js");

    let UIDGenerator = require("./UIDGenerator");
    
    const CALLBACK_UID_KEY = "_mars_graph_callback_uid";
    const CHANGE_UID_PREFIX = "mars_graph_change_uid_";
    
    let uidGenerator = new UIDGenerator({
        sequenceLength: 30
    });
    
    /*
     Adds a callback UID property to a function or all elements of an array so
     we can keep track of our callbacks and do cool stuff with them
     */
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
    
    /*
     Gets the keys for the different check (set, get, verify) events for a
     specific path.
     */
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
    
    /*
     Attaches getter and setter methods to a property on an object so we can
     fire events and mess with things when someone tries to do something with
     it.
     */
    function attachAccessors(self, path, [getKey, setKey, verifyKey]) {
        let {ref, key} = _.getPathData(self._data, path);
        
        if (ref === undefined) {
            return self;
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
                    for (let fetcher of self._checks[getKey]) {
                        retVal = fetcher(val);
                    }
                }
                
                return retVal;
            }
        });
    }
    
    /*
     `_proto` is an object containing methods that we would like to use in
     MarsObject but don't necessarily want being exposed to the whole world
     and cluttering things up */
    let _proto = {
        /*
         Used by the `on` method when only one argument is given.
         Checks if the argument it's been given is JSON and if so it loops over
         every property and calls the `onEvtCallback` method with the key as
         the event name and the value as the listener(s)
         */
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
        /*
         Used by the `on` method when two arguments are supplied and the
         `onJSON` method to add a listener or group of listeners for an
         event.
         */
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
        /*
         Used by the `off` method when one argument is supplied.
         Behaves the same way as `onJSON` except it calls
         `offEvtCallback`
         */
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
        /*
         Used by the `off` method when 2 arguments are supplied and the `offJSON`
         method.
         Takes an event name and a callback or group of callbacks and loops over
         the callbacks unbinding all listeners on the specified event that have
         the same UID
         */
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
        /*
         Used by the `fire` method when one argument is supplied.
         Takes in a JSON object and loops over all keys contained and passes
         them to the `fireEvent` method as event names along with values as
         event data.
         */
        fireJSON(json) {
            for (let eventName in json) {
                if (json.hasOwnProperty(eventName)) {
                    _proto.fireEvent.call(this, eventName, json[eventName]);
                }
            }
            return this;
        },
        /*
         Used by the `fire` method when one argument is supplied and the
         `fireJSON` method.
         Takes in one or more event names and some data and calls every event,
         passing in the data to the listeners
         */
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
        /*
         Used by the `data` method when 2 or more arguments are given.
         Takes in a string representing the path to a value on the data object
         and a value to set it to and sets the element at the path.
         */
        dataKeyValue(path, value) {
            if (!_.isString(path)) {
                return this;
            }
            
            let {ref, key} = _.getPathData(this._data, path);
            
            if (ref !== undefined) {
                ref[key] = value;
            }
        },
        /*
         Called by the `process` method when one argument is supplied.
         Takes in a JSON object representing the structure of the data object
         with values representing processors and calls `processKeyValue` for
         them. Works recursively.
         */
        processJSON(json) {
            _.walkJSON(json, (val, path) => {
                if (_.isFunction(val) || _.isArray(val)) {
                    _proto.processKeyValue.call(this, path, val);
                    return true;
                }
            })
        },
        /*
         Used by the `process` method when two or more arguments are supplied
         and the `processJSON` method.
         Takes in a string representing the path to a value on the data object
         and the processor(s) to attach to it and, if the path is defined,
         attaches them.
         */
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
        /*
         Called by the `fetch` method when one argument is supplied.
         Takes in a JSON object representing the structure of the data object
         with values representing fetchers and calls `fetchKeyValue` for
         them. Works recursively.
         */
        fetchJSON(json, path = "") {
            _.walkJSON(json, (val, path) => {
                if (_.isFunction(val) || _.isArray(val)) {
                    _proto.fetchKeyValue.call(this, path, val);
                    return true;
                }
            })
        },
        /*
         Used by the `fetch` method when two or more arguments are supplied and
         the `fetchJSON` method.
         Takes in a string representing the path to a value on the data object
         and the fetcher(s) to attach to it and, if the path is defined,
         attaches them.
         */
        fetchKeyValue(path, fetchers) {
            if (!_.isString(path)) {
                return this;
            }
            
            if (!_.isArray(fetchers)) {
                fetchers = [fetchers];
            }
            
            fetchers = fetchers.filter(val => {
                return _.isFunction(val);
            });
            
            let [getKey, setKey, verifyKey, init] = getCheckKeys(this, path);
            
            this._checks[getKey] = this._checks[setKey].concat(fetchers);
            
            if (init) {
                attachAccessors(this, path, [
                    getKey,
                    setKey,
                    verifyKey
                ]);
            }
        },
        /*
         Called by the `check` method when one argument is supplied.
         Takes in a JSON object representing the structure of the data object
         with values representing fetchers and calls `checkKeyValue` for
         them. Works recursively.
         */
        checkJSON(json, path = "") {
            _.walkJSON(json, (val, path) => {
                if (_.isFunction(val) || _.isArray(val)) {
                    _proto.checkKey.call(this, path, val);
                    return true;
                }
            });
        },
        /*
         Used by the `check` method when two or more arguments are supplied and
         the `checkJSON` method.
         Takes in a string representing the path to a value on the data object
         and the checker(s) to attach to it and, if the path is defined,
         attaches them.
         */
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
    
    class MarsObject {
        constructor(cfg = {}) {
            let {data = {}, listen = {}, checks = {}, change = {}} = cfg;
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
        /*
         Description:
            Gets and or sets data on the data object, accepting simple
            key-value pairs, more complex path-value pairs, or a json data
            structure to merge with the data object
         Usage:
            data()
                Returns the data object
            data(path)
                Returns the element on the data object at `path`
            data(path, value)
                Sets the data at `path` to value
            data(json)
                Deep merges `json` with the data object
         */
        data() {
            if (arguments.length === 1) {
                if (_.isObject(arguments[0])) {
                    this._data = _.merge(this._data, arguments[0]);
                } else if (_.isString(arguments[0])) {
                    return _.getPathValue(this._data, arguments[0]);
                }
            } else if (arguments.length >= 2) {
                _proto.dataKeyValue.apply(this, arguments);
            }
            return this._data;
        }
        /*
         Description:
            Allows code to be written to process requests to set data on
            this object
         Usage:
            process(path, processor)
                Attaches the `processor` method to any `set` events on
                the data found at `path` on the data object
            process(json)
                Takes an object consisting of processors and objects in
                which the path to a processor (i.e. something.somethingElse)
                represents the path to the value on the data objec that
                the processor should be attached to
         */
        process() {
            if (arguments.length === 1) {
                _proto.processJSON.apply(this, arguments);
            } else if (arguments.length >= 2) {
                _proto.processKeyValue.apply(this, arguments);
            }
            return this;
        }
        /*
         Description:
            Allows code to be written which is triggered upon an attempt
            to get a value on the data object and can modify that data
            before it is passed out.
         Usage:
            fetch(path, fetcher)
                Attaches `fetcher` (or all functions contained within it if
                it's an array) to requests for the value at `path` on the
                data object
            fetch(json)
                Takes an object consisting of fetchers and objects in
                which the path to a fetcher (i.e. something.somethingElse)
                represents the path to the value on the data object that
                the fetcher should be attached to
         */
        fetch() {
            if (arguments.length === 1) {
                _proto.fetchJSON.apply(this, arguments);
            } else if (arguments.length >= 2) {
                _proto.fetchKeyValue.apply(this, arguments);
            }
            return this;
        }
        /*
         Description:
            Allows code to be written which checks if a value is valid for
            some element on the data object before it is set and blocks
            the set attempt if it is not valid.
         Usage:
            check(path, checks)
                Adds the functions in checks (or just `checks` if it's a
                function) as pre-set checks for the element on `path` in the
                data object.
            check(json)
                Takes an object consisting of checks and objects in
                which the path to a check (i.e. something.somethingElse)
                represents the path to the value on the data object that
                the check should be attached to
         */
        check() {
            if (arguments.length === 1) {
                _proto.checkJSON.apply(this, arguments);
            } else if (arguments.length >= 2) {
                _proto.checkKey.apply(this, arguments);
            }
            return this;
        }
    }

    module.exports = MarsObject;
    return MarsObject;

})();
