'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = mavenResolver;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tmp = require('tmp');

var _tmp2 = _interopRequireDefault(_tmp);

var _xml = require('xml');

var _xml2 = _interopRequireDefault(_xml);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _LoggerJs = require('./Logger.js');

var _LoggerJs2 = _interopRequireDefault(_LoggerJs);

var _constantsJs = require('./constants.js');

var _loggerProcessorsJs = require('./loggerProcessors.js');

/*
  Parse pattern :
  [http://mvn-repo:]mvnGroupIf:mvnArtefactId:mvnVersion
*/
function parseArtifactDescription(artifactDescription) {
    var parts = artifactDescription.split(':');

    var repositoryUrl = undefined;
    var repositoryId = undefined;

    if (parts.length == 5) {
        repositoryUrl = [parts.shift(), parts.shift()].join(':');
        repositoryId = repositoryUrl.split('/').reverse()[0];
    }

	return {
		repositoryId: repositoryId,
		repositoryUrl: repositoryUrl,
		artifact: parts.join(':')
	};
}

function createPOMFileInFolder(data, folder) {
	var repoSection = data.repositoryUrl?
    {
		repositories: [{ repository: [{ id: data.repositoryId }, { url: data.repositoryUrl }] }]
	}:
    {};

	_fs2['default'].writeFileSync(_path2['default'].join(folder, _constantsJs.POM_FILE_NAME), (0, _xml2['default'])({
		project: Array.prototype.concat(_constantsJs.POM_PROJECT_ATTRS, _constantsJs.POM_DEFAULT_PROPERTIES_JSON, repoSection)
	}));
}

function runMavenUnpackCommand(data, cwd) {
	var options = ['dependency:unpack', '-Dartifact=' + data.artifact, '-DoutputDirectory=' + cwd, '-Dtransitive=false'];

	var executable = process.platform === 'win32' ? 'mvn.cmd' : 'mvn';
	var unpackCmd = _child_process2['default'].spawn(executable, options, { cwd: cwd });
	var promise = new Promise(function (resolve, reject) {

		unpackCmd.on('exit', function (status) {
			if (status) {
				reject();
			} else {
				resolve();
			}
		});
	});

	return {
		subProcess: unpackCmd,
		promise: promise
	};
}

function configureLogger(logger) {
	logger.registerProcessor([(0, _loggerProcessorsJs.downloadMessageProcessorFactory)(_constantsJs.MAVEN_ACTION_DOWNLOADING), (0, _loggerProcessorsJs.downloadMessageProcessorFactory)(_constantsJs.MAVEN_ACTIONS_DOWNLOADED), _loggerProcessorsJs.unpackingMessageProcessor]);
}

function mavenResolver(bower) {
	return {
		match: function match(source) {
			return source.indexOf(_constantsJs.MAVEN_BOWER_PREFIX) === 0;
		},

		fetch: function fetch(endpoint) {
			var tempDir = _tmp2['default'].dirSync();
			var logger = new _LoggerJs2['default'](bower.logger);
			var data = parseArtifactDescription(endpoint.source.substring(_constantsJs.MAVEN_BOWER_PREFIX.length));

			configureLogger(logger);

			createPOMFileInFolder(data, tempDir.name);

			var cmdUnpack = runMavenUnpackCommand(data, tempDir.name);

			cmdUnpack.subProcess.stdout.on('data', logger.stdoutProcessor.bind(logger));

			return cmdUnpack.promise.then(function () {
				logger.showDebugInfo();

				return {
					tempPath: tempDir.name,
					removeIgnores: true
				};
			})['catch'](function () {
				logger.showDebugInfo();

				return Promise.reject({
					code: "ERR_MAVEN_RESOLVER",
					message: logger.getErrorMessages()
				});
			});
		}
	};
}

module.exports = exports['default'];