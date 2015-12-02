"use strict";var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if("value" in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();var _slicedToArray=(function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n = (_s = _i.next()).done);_n = true) {_arr.push(_s.value);if(i && _arr.length === i)break;}}catch(err) {_d = true;_e = err;}finally {try{if(!_n && _i["return"])_i["return"]();}finally {if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i);}else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};})();function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass !== "function" && superClass !== null){throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var Graph=(function(){var _=require("./underscore-extended.js");var UIDGenerator=require("./UIDGenerator");var CALLBACK_UID_KEY="_mars_graph_callback_uid";var CHANGE_UID_PREFIX="mars_graph_change_uid_";var uidGenerator=new UIDGenerator({sequenceLength:30});var GraphObject=(function(){function callbackify(callback){if(_.isFunction(callback)){if(!callback[CALLBACK_UID_KEY]){callback[CALLBACK_UID_KEY] = uidGenerator.generate();}}else if(_.isArray(callback)){callback.map(function(fn){if(!fn[CALLBACK_UID_KEY]){fn[CALLBACK_UID_KEY] = uidGenerator.generate();}});}return callback;}function getCheckKeys(self,path){var setKey="" + CHANGE_UID_PREFIX + path + "_set";var getKey="" + CHANGE_UID_PREFIX + path + "_get";var verifyKey="" + CHANGE_UID_PREFIX + path + "_verify";var init=false;if(self._checks[verifyKey] === undefined){init = true;self._checks[verifyKey] = [];}if(self._checks[getKey] === undefined){init = true;self._checks[getKey] = [];}if(self._checks[setKey] === undefined){init = true;self._checks[setKey] = [];}return [getKey,setKey,verifyKey,init];}function attachAccessors(self,path,_ref){var _ref2=_slicedToArray(_ref,3);var getKey=_ref2[0];var setKey=_ref2[1];var verifyKey=_ref2[2];var _$getPathData=_.getPathData(self._data,path);var ref=_$getPathData.ref;var key=_$getPathData.key;if(ref === undefined){return self;}var val=ref[key];Object.defineProperty(ref,key,{set:function set(nVal){if(self._checks[verifyKey] !== undefined){var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=self._checks[verifyKey][Symbol.iterator](),_step;!(_iteratorNormalCompletion = (_step = _iterator.next()).done);_iteratorNormalCompletion = true) {var check=_step.value;if(!check(nVal)){return;}}}catch(err) {_didIteratorError = true;_iteratorError = err;}finally {try{if(!_iteratorNormalCompletion && _iterator.return){_iterator.return();}}finally {if(_didIteratorError){throw _iteratorError;}}}}if(self._checks[setKey] !== undefined){var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=self._checks[setKey][Symbol.iterator](),_step2;!(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);_iteratorNormalCompletion2 = true) {var processor=_step2.value;var possible=processor(nVal);if(possible !== undefined){nVal = possible;}}}catch(err) {_didIteratorError2 = true;_iteratorError2 = err;}finally {try{if(!_iteratorNormalCompletion2 && _iterator2.return){_iterator2.return();}}finally {if(_didIteratorError2){throw _iteratorError2;}}}}val = nVal;},get:function get(){var retVal=val;if(self._checks[getKey] !== undefined){var _iteratorNormalCompletion3=true;var _didIteratorError3=false;var _iteratorError3=undefined;try{for(var _iterator3=self._checks[getKey][Symbol.iterator](),_step3;!(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done);_iteratorNormalCompletion3 = true) {var fetcher=_step3.value;retVal = fetcher(val);}}catch(err) {_didIteratorError3 = true;_iteratorError3 = err;}finally {try{if(!_iteratorNormalCompletion3 && _iterator3.return){_iterator3.return();}}finally {if(_didIteratorError3){throw _iteratorError3;}}}}return retVal;}});}var _proto={onJSON:function onJSON(json){if(!_.isObject(json)){return this;}for(var evt in json) {if(json.hasOwnProperty(evt)){_proto.onEvtCallback.call(this,evt,json[evt]);}}return this;},onEvtCallback:function onEvtCallback(evt,callbacks){if(!_.isString(evt) || _.isUndefined(callbacks)){return this;}if(!_.isArray(callbacks)){callbacks = [callbacks];}callbacks = callbacks.filter(function(val){return _.isFunction(val);}).map(callbackify);if(!callbacks.length){return this;}if(!_.isArray(this._listeners[evt])){this._listeners[evt] = [];}this._listeners[evt] = this._listeners[evt].concat(callbacks);return this;},offJSON:function offJSON(json){if(!_.isObject(json)){return this;}for(var evt in json) {if(json.hasOwnProperty(evt)){_proto.offEvtCallback.call(this,evt,json[evt]);}}return this;},offEvtCallback:function offEvtCallback(evt){var callbacks=arguments.length <= 1 || arguments[1] === undefined?[]:arguments[1];if(this._listeners[evt] === undefined){return this;}if(!_.isArray(callbacks)){callbacks = [callbacks];}callbacks = callbacks.filter(function(val){return _.isFunction(val) && val[CALLBACK_UID_KEY];}).map(function(val){return val[CALLBACK_UID_KEY];});if(!callbacks.length){return this;}var filtered=this._listeners[evt].filter(function(val){return callbacks.indexOf(val[CALLBACK_UID_KEY]) === -1;});if(!filtered.length){delete this._listeners[evt];}else {this._listeners[evt] = filtered;}return this;},fireJSON:function fireJSON(json){for(var eventName in json) {if(json.hasOwnProperty(eventName)){_proto.fireEvent.call(this,eventName,json[eventName]);}}return this;},fireEvent:function fireEvent(eventNames,data){if(!_.isArray(eventNames)){eventNames = [eventNames];}eventNames = eventNames.filter(function(val){return _.isString(val);});if(!eventNames.length){return this;}var _iteratorNormalCompletion4=true;var _didIteratorError4=false;var _iteratorError4=undefined;try{for(var _iterator4=eventNames[Symbol.iterator](),_step4;!(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done);_iteratorNormalCompletion4 = true) {var evtName=_step4.value;if(this._listeners.hasOwnProperty(evtName)){var _iteratorNormalCompletion5=true;var _didIteratorError5=false;var _iteratorError5=undefined;try{for(var _iterator5=this._listeners[evtName][Symbol.iterator](),_step5;!(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done);_iteratorNormalCompletion5 = true) {var listener=_step5.value;listener(data);}}catch(err) {_didIteratorError5 = true;_iteratorError5 = err;}finally {try{if(!_iteratorNormalCompletion5 && _iterator5.return){_iterator5.return();}}finally {if(_didIteratorError5){throw _iteratorError5;}}}}}}catch(err) {_didIteratorError4 = true;_iteratorError4 = err;}finally {try{if(!_iteratorNormalCompletion4 && _iterator4.return){_iterator4.return();}}finally {if(_didIteratorError4){throw _iteratorError4;}}}return this;},dataKeyValue:function dataKeyValue(path,value){if(!_.isString(path)){return this;}var _$getPathData2=_.getPathData(this._data,path);var ref=_$getPathData2.ref;var key=_$getPathData2.key;if(ref !== undefined){ref[key] = value;}},processJSON:function processJSON(json){var _this=this;_.walkJSON(json,function(val,path){if(_.isFunction(val) || _.isArray(val)){_proto.processKeyValue.call(_this,path,val);return true;}});},processKeyValue:function processKeyValue(path,listeners){if(!_.isString(path)){return this;}if(!_.isArray(listeners)){listeners = [listeners];}listeners = listeners.filter(function(val){return _.isFunction(val);});var _getCheckKeys=getCheckKeys(this,path);var _getCheckKeys2=_slicedToArray(_getCheckKeys,4);var getKey=_getCheckKeys2[0];var setKey=_getCheckKeys2[1];var verifyKey=_getCheckKeys2[2];var init=_getCheckKeys2[3];this._checks[setKey] = this._checks[setKey].concat(listeners);if(init){attachAccessors(this,path,[getKey,setKey,verifyKey]);}},fetchJSON:function fetchJSON(json){var _this2=this;var path=arguments.length <= 1 || arguments[1] === undefined?"":arguments[1];_.walkJSON(json,function(val,path){if(_.isFunction(val) || _.isArray(val)){_proto.fetchKeyValue.call(_this2,path,val);return true;}});},fetchKeyValue:function fetchKeyValue(path,fetchers){if(!_.isString(path)){return this;}if(!_.isArray(fetchers)){fetchers = [fetchers];}fetchers = fetchers.filter(function(val){return _.isFunction(val);});var _getCheckKeys3=getCheckKeys(this,path);var _getCheckKeys4=_slicedToArray(_getCheckKeys3,4);var getKey=_getCheckKeys4[0];var setKey=_getCheckKeys4[1];var verifyKey=_getCheckKeys4[2];var init=_getCheckKeys4[3];this._checks[getKey] = this._checks[setKey].concat(fetchers);if(init){attachAccessors(this,path,[getKey,setKey,verifyKey]);}},checkJSON:function checkJSON(json){var _this3=this;var path=arguments.length <= 1 || arguments[1] === undefined?"":arguments[1];_.walkJSON(json,function(val,path){if(_.isFunction(val) || _.isArray(val)){_proto.checkKey.call(_this3,path,val);return true;}});},checkKey:function checkKey(path,checks){if(!_.isString(path) || _.isUndefined(checks)){return this;}if(!_.isArray(checks)){checks = [checks];}checks = checks.filter(function(val){return _.isFunction(val);});var _getCheckKeys5=getCheckKeys(this,path);var _getCheckKeys6=_slicedToArray(_getCheckKeys5,4);var getKey=_getCheckKeys6[0];var setKey=_getCheckKeys6[1];var verifyKey=_getCheckKeys6[2];var init=_getCheckKeys6[3];this._checks[verifyKey] = this._checks[verifyKey].concat(checks);if(init){attachAccessors(this,path,[getKey,setKey,verifyKey]);}return this;}};var GraphObject=(function(){function GraphObject(_ref3){var _ref3$data=_ref3.data;var data=_ref3$data === undefined?{}:_ref3$data;var _ref3$listen=_ref3.listen;var listen=_ref3$listen === undefined?{}:_ref3$listen;var _ref3$checks=_ref3.checks;var checks=_ref3$checks === undefined?{}:_ref3$checks;var _ref3$change=_ref3.change;var change=_ref3$change === undefined?{}:_ref3$change;_classCallCheck(this,GraphObject);this._listeners = {};this._data = {};this._checks = {};for(var evt in listen) {if(listen.hasOwnProperty(evt)){this.on(evt,listen[evt]);}}this.data(data);this.check(checks);this.process(change);} /*
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
             */_createClass(GraphObject,[{key:"on",value:function on(){if(arguments.length === 1){return _proto.onJSON.apply(this,arguments);}if(arguments.length >= 2){return _proto.onEvtCallback.apply(this,arguments);}return this;} /*
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
             */},{key:"off",value:function off(){if(arguments.length === 1){return _proto.offJSON.apply(this,arguments);}if(arguments.length >= 2){return _proto.offEvtCallback.apply(this,arguments);}return this;} /*
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
             */},{key:"fire",value:function fire(){if(arguments.length === 1 && _.isObject(arguments[0])){_proto.fireJSON.apply(this,arguments);}else if(arguments.length >= 1){_proto.fireEvent.apply(this,arguments);}return this;} /*
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
             */},{key:"data",value:function data(){if(arguments.length === 1){if(_.isObject(arguments[0])){this._data = _.merge(this._data,arguments[0]);}else if(_.isString(arguments[0])){return _.getPathValue(this._data,arguments[0]);}}else if(arguments.length >= 2){_proto.dataKeyValue.apply(this,arguments);}return this._data;} /*
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
             */},{key:"process",value:function process(){if(arguments.length === 1){_proto.processJSON.apply(this,arguments);}else if(arguments.length === 2){_proto.processKeyValue.apply(this,arguments);}return this;} /*
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
             */},{key:"fetch",value:function fetch(){if(arguments.length === 1){_proto.fetchJSON.apply(this,arguments);}else if(arguments.length === 2){_proto.fetchKeyValue.apply(this,arguments);}return this;} /*
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
             */},{key:"check",value:function check(){if(arguments.length === 1){_proto.checkJSON.apply(this,arguments);}else if(arguments.length === 2){_proto.checkKey.apply(this,arguments);}return this;}}]);return GraphObject;})();return GraphObject;})();var Graph=(function(_GraphObject){_inherits(Graph,_GraphObject);function Graph(){var cfg=arguments.length <= 0 || arguments[0] === undefined?{}:arguments[0];_classCallCheck(this,Graph);return _possibleConstructorReturn(this,Object.getPrototypeOf(Graph).call(this,cfg));}return Graph;})(GraphObject);var Node=(function(_GraphObject2){_inherits(Node,_GraphObject2);function Node(){var cfg=arguments.length <= 0 || arguments[0] === undefined?{}:arguments[0];_classCallCheck(this,Node);return _possibleConstructorReturn(this,Object.getPrototypeOf(Node).call(this,cfg));}return Node;})(GraphObject);var Edge=(function(_GraphObject3){_inherits(Edge,_GraphObject3);function Edge(){var cfg=arguments.length <= 0 || arguments[0] === undefined?{}:arguments[0];_classCallCheck(this,Edge);return _possibleConstructorReturn(this,Object.getPrototypeOf(Edge).call(this,cfg));}_createClass(Edge,[{key:"connect",value:function connect(){}},{key:"unconnect",value:function unconnect(){}}]);return Edge;})(GraphObject);Graph.Node = Node;Graph.Edge = Edge;module.exports = Graph;return Graph;})();