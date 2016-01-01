var DataObject = (function() {
    
    let _ = require("./underscore-extended.js");
    
    const CHANGE_UID_PREFIX = "mars_data_object_change_uid_";
    
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
                        if (!check(nVal, val)) {
                            return;
                        }
                    }
                }
                
                if (self._checks[setKey] !== undefined) {
                    for (let processor of self._checks[setKey]) {
                        let possible = processor(nVal, val);
                        
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
    
    class DataObject {
        constructor(cfg = {}) {
            let {data = {}, checks = {}, change = {}, fetch = {}} = cfg;
            
            this._data = {};
            this._checks = {};
            
            this.data(data);
            this.check(checks);
            this.process(change);
            this.fetch(fetch);
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
    
    module.exports = DataObject;
    return DataObject;
    
})();
