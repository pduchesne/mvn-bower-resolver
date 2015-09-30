import tmp from 'tmp';
import xml from 'xml';
import childProcess from 'child_process';
import fs from 'fs';
import path from 'path';
import Logger from './Logger.js';

import {
	MAVEN_ACTION_DOWNLOADING,
	MAVEN_ACTIONS_DOWNLOADED,
	MAVEN_ACTIONS_UNPACKING,
	MAVEN_BOWER_PREFIX,
	POM_DEFAULT_PROPERTIES_JSON,
	POM_FILE_NAME,
	POM_PROJECT_ATTRS
} from './constants.js';

import {
	downloadMessageProcessorFactory,
	unpackingMessageProcessor,
} from './loggerProcessors.js';

function parseArtifactDescription(artifactDescription) {
	let parts = artifactDescription.split(':');
	let repositoryUrl =  [parts.shift(), parts.shift()].join(':');
	let repositoryId = repositoryUrl.split('/').reverse()[0];

	return {
		repositoryId,
		repositoryUrl,
		artifact: parts.join(':')
	}
}

function createPOMFileInFolder(data, folder) {
	let repoSection = {
		repositories: [
			{repository: [
				{id: data.repositoryId},
				{url: data.repositoryUrl}
			]}
		]
	};

	fs.writeFileSync(path.join(folder, POM_FILE_NAME), xml({
		project: Array.concat(
			POM_PROJECT_ATTRS,
			POM_DEFAULT_PROPERTIES_JSON,
			repoSection
		)
	}))
}

function runMavenUnpackCommand(data, cwd) {
	let options = [
		'dependency:unpack',
		`-Dartifact=${data.artifact}`,
		`-DoutputDirectory=${cwd}`,
		'-Dtransitive=false'
	];

	let executable = process.platform === 'win32' ? 'mvn.cmd' : 'mvn';
	let unpackCmd = childProcess.spawn(executable, options, {cwd});
	let promise = new Promise((resolve, reject) => {

		unpackCmd.on('exit', (status) => {
			if (status) {
				reject();
			} else {
				resolve();
			}
		})
	});

	return {
		subProcess: unpackCmd,
		promise
	}
}

function configureLogger(logger) {
	logger.registerProcessor([
		downloadMessageProcessorFactory(MAVEN_ACTION_DOWNLOADING),
		downloadMessageProcessorFactory(MAVEN_ACTIONS_DOWNLOADED),
		unpackingMessageProcessor
	]);
}

export default function mavenResolver(bower) {
	return {
		match(source) {
			return source.indexOf(MAVEN_BOWER_PREFIX) === 0;
		},

		fetch(endpoint) {
			let tempDir = tmp.dirSync();
			let logger = new Logger(bower.logger);
			let data = parseArtifactDescription(endpoint.source.substring(MAVEN_BOWER_PREFIX.length));

			configureLogger(logger);

			createPOMFileInFolder(data, tempDir.name);

			let cmdUnpack = runMavenUnpackCommand(data, tempDir.name);

			cmdUnpack.subProcess.stdout.on('data', logger.stdoutProcessor.bind(logger));

			return cmdUnpack.promise
				.then(() => {
					logger.showDebugInfo();

					return {
						tempPath: tempDir.name,
						removeIgnores: true
					}
				})
				.catch(() => {
					logger.showDebugInfo();

					return Promise.reject({
						code: "ERR_MAVEN_RESOLVER",
						message: logger.getErrorMessages()
					})
				});
		}
	}
}