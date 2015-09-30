'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.downloadMessageProcessorFactory = downloadMessageProcessorFactory;
exports.unpackingMessageProcessor = unpackingMessageProcessor;

var _helpersJs = require('./helpers.js');

var _constantsJs = require('./constants.js');

function downloadMessageProcessorFactory(action) {
	return function downloadMessageProcessor(messageLine, logger) {
		if ((0, _helpersJs.isMessageLineStartWith)(messageLine, action)) {
			var url = messageLine.split(_constantsJs.SYMBOL_SPACE)[1];
			logger.info(action, url);
		}
	};
}

function unpackingMessageProcessor(messageLine, logger) {

	if ((0, _helpersJs.isMessageLineStartWith)(messageLine, _constantsJs.MAVEN_ACTIONS_UNPACKING)) {
		(function () {
			var logParts = messageLine.split(_constantsJs.SYMBOL_SPACE);
			var from = logParts.indexOf(_constantsJs.MAVEN_ACTIONS_UNPACKING);
			var to = logParts.indexOf('to');

			var fullSrcPath = logParts.filter(function (part, index) {
				return index > from && index < to;
			});
			var fileName = fullSrcPath.join(_constantsJs.SYMBOL_SPACE).split(_constantsJs.SYMBOL_PATH_SEPARATOR).reverse()[0];

			logger.info(_constantsJs.MAVEN_ACTIONS_UNPACKING, fileName);
		})();
	}
}