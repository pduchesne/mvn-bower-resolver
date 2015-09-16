import tmp from 'tmp';
import childProcess from 'child_process';

const MVN_PREFIX = 'mvn+';

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

function buildMVNCmdOptions(data, destFolder) {
	return [
		`-Dtransitive=false`,
		`-Dartifact=${data.artifact}`,
		`-DremoteRepositories=${data.repoId}::::${data.repositoryUrl}`,
		`-DoutputDirectory=${destFolder}`
	];
}

export default function mavenResolver(bower) {
	return {
		match(src) {
			return src.indexOf(MVN_PREFIX) === 0;
		},

		fetch(endpoint) {
			let tempDir = tmp.dirSync();
			console.log(tempDir.name);
			let data = parseArtifactDescription(endpoint.source.substring(MVN_PREFIX.length));
			let options = Array.concat(buildMVNCmdOptions(data, tempDir.name), ['dependency:get', 'dependency:copy', 'dependency:unpack']);

			return new Promise((resolve, reject) => {
				let mvnCmd = childProcess.spawn('mvn', options, {stdio: 'inherit', cwd: tempDir.name});

				mvnCmd.on('exit', resolve);
			}).then(() => {
					return {
						tempPath: tempDir.name,
						removeIgnores: true
					}
				})
		}
	}
}