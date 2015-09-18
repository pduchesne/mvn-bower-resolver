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
} from './processors.js';

function parseArtifactDescription(artifactDescription) {
	let parts = artifactDescription.split(':');
	let repositoryUrl =  [parts.shift(), parts.shift()].join(':');
	let repoId = repositoryUrl.split('/').reverse()[0];

	return {
		repoId,
		repositoryUrl,
		artifact: parts.join(':')
	}
}

function buildRepositoriesJSON(data) {
	return  {
		repositories: [
			{repository: [
				{id: data.repoId},
				{url: data.repositoryUrl}
			]}
		]
	}
}

function createPOMFile(repoId, repoURL) {
	let repoSection = {
		repositories: [
			{repository: [
				{id: repoId},
				{url: repoURL}
			]}
		]
	};

	return xml({
		project: Array.concat(
			POM_PROJECT_ATTRS,
			POM_DEFAULT_PROPERTIES_JSON,
			repoSection
		)
	})
}

function runMavenUnpackCommand(data, cwd) {
	let options = [
		'dependency:unpack',
		`-Dartifact=${data.artifact}`,
		`-DoutputDirectory=${cwd}`,
		'-Dtransitive=false'
	];

	let unpackCmd = childProcess.spawn('mvn', options, {cwd});
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
		cmd: unpackCmd,
		promise
	}
}

export default function mavenResolver(bower) {
	return {
		match(source) {
			return source.indexOf(MAVEN_BOWER_PREFIX) === 0;
		},

		fetch(endpoint) {
			let tempDir = tmp.dirSync();
			let logger = new Logger(bower.logger);

			logger.registerProcessor([
				downloadMessageProcessorFactory(MAVEN_ACTION_DOWNLOADING),
				downloadMessageProcessorFactory(MAVEN_ACTIONS_DOWNLOADED),
				unpackingMessageProcessor
			]);

			let data = parseArtifactDescription(endpoint.source.substring(MAVEN_BOWER_PREFIX.length));
			let pomFileContent = createPOMFile(data.repoId, data.repositoryUrl);
			fs.writeFileSync(path.join(tempDir.name, 'pom.xml'), pomFileContent);

			let cmdUnpack = runMavenUnpackCommand(data, tempDir.name, {
				tempPath: tempDir.name,
				removeIgnores: true
			});

			cmdUnpack.cmd.stdout.on('data', logger.stdoutProcessor.bind(logger));

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