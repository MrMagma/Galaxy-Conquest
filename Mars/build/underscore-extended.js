"use strict";var _=(function(){var lodash=require("lodash");var underscore=require("underscore");var mixin=require("mixin");var _=underscore.extendOwn(lodash,underscore,{getPathParent:function getPathParent(obj){var path=arguments.length <= 1 || arguments[1] === undefined?"":arguments[1];path = path.split(".");var ref=obj;while(path.length > 1 && ref !== undefined) {ref = ref[path.shift()];}return ref;},getPathData:function getPathData(obj){var path=arguments.length <= 1 || arguments[1] === undefined?"":arguments[1];return {ref:_.getPathParent(obj,path),key:_.getPathTail(path)};},getPathValue:function getPathValue(obj){var path=arguments.length <= 1 || arguments[1] === undefined?"":arguments[1];var _$getPathData=_.getPathData(obj,path);var ref=_$getPathData.ref;var key=_$getPathData.key;if(ref !== undefined){return ref[key];}},getPathTail:function getPathTail(){var path=arguments.length <= 0 || arguments[0] === undefined?"":arguments[0];return path.split(".").pop();},walkJSON:function walkJSON(json,walker){var path=arguments.length <= 2 || arguments[2] === undefined?"":arguments[2];for(var key in json) {if(json.hasOwnProperty(key)){var valPath=path;if(valPath.length){valPath += ".";}valPath += key;var dontWalk=walker(json[key],valPath);if(!dontWalk){_.walkJSON(json[key],walker,valPath);}}}},mix:function mix(){if(arguments.length > 0){var current=arguments[0];for(var i=1;i < arguments.length;i++) {current = mixin(current,arguments[i]);}return current;}}});module.exports = _;return _;})();