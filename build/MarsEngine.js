(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";function _typeof(obj){return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol?"symbol":typeof obj;}var MarsGame=(function(){function Mars(){var cfg=arguments.length <= 0 || arguments[0] === undefined?{}:arguments[0];this._fps = 30;this._frameInterval = 1000 / this._fps;}Mars.prototype = {FPS:function FPS(value){var type=typeof value === "undefined"?"undefined":_typeof(value);if(type === "number" || type === "string"){if(typeof value === "string"){value = parseInt(value);if(isNaN(value)){console.error("Please supply a valid value to the \"FPS\" method");return;}}this._fps = value;this._frameInterval = 1000 / this._fps;}return this._fps;},init:function init(){},load:function load(){},progress:function progress(){},update:function update(){},preload:function preload(){},load:function load(){}};module.exports = Mars;return Mars;})();
},{}],2:[function(require,module,exports){
"use strict";var MarsEngine=(function(){var Engine={Game:require("./MarsGame.js")};module.exports = Engine;return Engine;})();
},{"./MarsGame.js":1}]},{},[2])