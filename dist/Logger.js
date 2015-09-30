'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _constantsJs = require('./constants.js');

var _helpersJs = require('./helpers.js');

var Logger = (function () {
	function Logger(bowerLogger) {
		_classCallCheck(this, Logger);

		this._logger = bowerLogger;
		this._processors = [];
		this._messages = [];
	}

	_createClass(Logger, [{
		key: 'registerProcessor',
		value: function registerProcessor(processors) {
			var _this = this;

			processors = Array.isArray(processors) ? processors : [processors];

			processors.forEach(function (processor) {
				_this._processors.push(processor);
			});
		}
	}, {
		key: 'showDebugInfo',
		value: function showDebugInfo() {
			var log = Array.prototype.concat([], 'Full maven build log:', this._messages);

			this._logger.debug('debug', log.join(_constantsJs.SYMBOL_NEW_LINE));
		}
	}, {
		key: 'getErrorMessages',
		value: function getErrorMessages() {
			return this._messages.filter(function (messageLine) {
				return (0, _helpersJs.isMessageLineStartWith)(messageLine, _constantsJs.MAVEN_LOG_PREFIX_ERROR);
			}).join(_constantsJs.SYMBOL_NEW_LINE);
		}
	}, {
		key: 'stdoutProcessor',
		value: function stdoutProcessor(data) {
			var _this2 = this;

			var message = data.toString('utf8');

			message.split(_constantsJs.SYMBOL_NEW_LINE).forEach(function (messageLine) {
				_this2._messages.push(messageLine);

				_this2._processors.forEach(function (processor) {
					processor(messageLine, _this2._logger);
				});
			});
		}
	}]);

	return Logger;
})();

exports['default'] = Logger;
module.exports = exports['default'];