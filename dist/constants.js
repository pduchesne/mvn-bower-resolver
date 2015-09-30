'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var MAVEN_BOWER_PREFIX = 'mvn+';

exports.MAVEN_BOWER_PREFIX = MAVEN_BOWER_PREFIX;
var POM_FILE_NAME = 'pom.xml';
exports.POM_FILE_NAME = POM_FILE_NAME;
var POM_DEFAULT_PROPERTIES_JSON = [{ groupId: 'bower.resolvers.helper' }, { artifactId: 'maven' }, { packaging: 'pom' }, { version: '1.0' }, { name: 'Bower Resolver Helper' }, { modelVersion: '4.0.0' }];

exports.POM_DEFAULT_PROPERTIES_JSON = POM_DEFAULT_PROPERTIES_JSON;
var POM_PROJECT_ATTRS = {
	_attr: {
		xmlns: "http://maven.apache.org/POM/4.0.0",
		"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
		"xsi:schemaLocation": "http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd "
	}
};

exports.POM_PROJECT_ATTRS = POM_PROJECT_ATTRS;
var MAVEN_ACTION_DOWNLOADING = 'downloading';
exports.MAVEN_ACTION_DOWNLOADING = MAVEN_ACTION_DOWNLOADING;
var MAVEN_ACTIONS_DOWNLOADED = 'downloaded';
exports.MAVEN_ACTIONS_DOWNLOADED = MAVEN_ACTIONS_DOWNLOADED;
var MAVEN_ACTIONS_UNPACKING = 'unpacking';
exports.MAVEN_ACTIONS_UNPACKING = MAVEN_ACTIONS_UNPACKING;
var MAVEN_LOG_PREFIX_INFO = '[info]';
exports.MAVEN_LOG_PREFIX_INFO = MAVEN_LOG_PREFIX_INFO;
var MAVEN_LOG_PREFIX_ERROR = '[error]';

exports.MAVEN_LOG_PREFIX_ERROR = MAVEN_LOG_PREFIX_ERROR;
var SYMBOL_SPACE = ' ';
exports.SYMBOL_SPACE = SYMBOL_SPACE;
var SYMBOL_PATH_SEPARATOR = _path2['default'].sep;
exports.SYMBOL_PATH_SEPARATOR = SYMBOL_PATH_SEPARATOR;
var SYMBOL_NEW_LINE = '\n';

exports.SYMBOL_NEW_LINE = SYMBOL_NEW_LINE;
var MAVEN_ERROR_MESSAGE = '';
exports.MAVEN_ERROR_MESSAGE = MAVEN_ERROR_MESSAGE;