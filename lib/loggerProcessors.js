import {isMessageLineStartWith} from './helpers.js';

import {
	SYMBOL_SPACE,
	SYMBOL_PATH_SEPARATOR,
	MAVEN_ACTIONS_UNPACKING,
} from './constants.js';

export function downloadMessageProcessorFactory(action) {
	return function downloadMessageProcessor(messageLine, logger) {
		if (isMessageLineStartWith(messageLine, action)) {
			let url = messageLine.split(SYMBOL_SPACE)[1];
			logger.info(action, url);
		}
	}
}

export function unpackingMessageProcessor(messageLine, logger) {

	if (isMessageLineStartWith(messageLine, MAVEN_ACTIONS_UNPACKING)) {
		let logParts = messageLine.split(SYMBOL_SPACE);
		let from = logParts.indexOf(MAVEN_ACTIONS_UNPACKING);
		let to = logParts.indexOf('to');

		let fullSrcPath = logParts.filter((part, index) => {
			return index > from && index < to;
		});
		let fileName = fullSrcPath.join(SYMBOL_SPACE).split(SYMBOL_PATH_SEPARATOR).reverse()[0];

		logger.info(MAVEN_ACTIONS_UNPACKING, fileName)
	}
}

