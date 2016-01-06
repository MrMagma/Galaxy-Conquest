var EventObject = (function() {
    
    let _ = require("./underscore-extended.js");
    
    let UIDGenerator = require("./UIDGenerator");
    
    const CALLBACK_UID_KEY = "_mars_event_callback_uid";
    
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
        }
    };
    
    class EventObject {
        constructor(cfg = {}) {
            let {listen = {}} = cfg;
            
            this._listeners = [];
            
            this.on(listen);
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
            Another method of calling the fire method.
         Usage:
            emit([arg1[, arg2[, ...argN]]])
                Calls the fire method with the given arguments.
         */
        emit() {
            this.fire.apply(this, _.toArray(arguments));
        }
    }
    
    module.exports = EventObject;
    return EventObject;
    
})();
