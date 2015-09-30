import {
	MAVEN_LOG_PREFIX_INFO,
	MAVEN_LOG_PREFIX_ERROR,
	MAVEN_ERROR_MESSAGE,
	SYMBOL_NEW_LINE
} from './constants.js';

import {isMessageLineStartWith} from './helpers.js';


export default class Logger {
	constructor(bowerLogger) {
		this._logger = bowerLogger;
		this._processors = [];
		this._messages = [];
	}

	registerProcessor(processors) {
		processors = Array.isArray(processors) ? processors : [processors];

		processors.forEach((processor) => {
			this._processors.push(processor);
		})
	}

	showDebugInfo() {
		let log = Array.prototype.concat([], 'Full maven build log:', this._messages);

		this._logger.debug('debug', log.join(SYMBOL_NEW_LINE));
	}

	getErrorMessages() {
		return this._messages.filter((messageLine) => {
			return isMessageLineStartWith(messageLine, MAVEN_LOG_PREFIX_ERROR)
		}).join(SYMBOL_NEW_LINE);
	}

	stdoutProcessor(data) {
		let message = data.toString('utf8');

		message.split(SYMBOL_NEW_LINE).forEach((messageLine) => {
			this._messages.push(messageLine);

			this._processors.forEach((processor) => {
				processor(messageLine, this._logger)
			})
		});

	}
}