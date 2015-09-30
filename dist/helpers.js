'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.isMessageLineStartWith = isMessageLineStartWith;

var _constantsJs = require('./constants.js');

function isMessageLineStartWith(messageLine, matcher) {
	messageLine = messageLine.toLowerCase();
	matcher = matcher.toLowerCase();
	var prefixedMatcher = _constantsJs.MAVEN_LOG_PREFIX_INFO + ' ' + matcher;

	return messageLine.indexOf(matcher) === 0 || messageLine.indexOf(prefixedMatcher) === 0;
}