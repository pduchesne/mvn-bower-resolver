import path from 'path';

export const MAVEN_BOWER_PREFIX = 'mvn+';

export const POM_FILE_NAME = 'pom.xml';
export const POM_DEFAULT_PROPERTIES_JSON = [
	{groupId: 'bower.resolvers.helper'},
	{artifactId: 'maven'},
	{packaging: 'pom'},
	{version: '1.0'},
	{name: 'Bower Resolver Helper'},
	{modelVersion: '4.0.0'}
];

export const POM_PROJECT_ATTRS = {
	_attr: {
		xmlns:"http://maven.apache.org/POM/4.0.0",
		"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
		"xsi:schemaLocation": "http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd "
	}
};

export const MAVEN_ACTION_DOWNLOADING = 'downloading';
export const MAVEN_ACTIONS_DOWNLOADED = 'downloaded';
export const MAVEN_ACTIONS_UNPACKING = 'unpacking';
export const MAVEN_LOG_PREFIX_INFO = '[info]';
export const MAVEN_LOG_PREFIX_ERROR = '[error]';

export const SYMBOL_SPACE = ' ';
export const SYMBOL_PATH_SEPARATOR = path.sep;
export const SYMBOL_NEW_LINE = '\n';

export const MAVEN_ERROR_MESSAGE = '';