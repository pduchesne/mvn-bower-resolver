import {MAVEN_LOG_PREFIX_INFO} from './constants.js';

export function isMessageLineStartWith(messageLine, matcher) {
	messageLine = messageLine.toLowerCase();
	matcher = matcher.toLowerCase();
	let prefixedMatcher = `${MAVEN_LOG_PREFIX_INFO} ${matcher}`;

	return messageLine.indexOf(matcher) === 0 || messageLine.indexOf(prefixedMatcher) === 0;
}