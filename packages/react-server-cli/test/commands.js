import path from 'path';
import fs from 'fs';
import readdirSyncRecursive from 'fs-readdir-recursive';
import outputFileSync from 'output-file-sync';
import child_process from 'child_process';
import test from 'ava';
import rimraf from 'rimraf';

const fixturesPath = path.join(__dirname, 'fixtures', 'commands');

fs.readdirSync(fixturesPath).forEach(testName => {
	if (testName[0] === '.') return;

	test(`${testName} command`, async t => {
		const testPath = path.join(fixturesPath, testName);
		const tmpPath = path.join(testPath, 'tmp');
		changeToTempDir(tmpPath);

		Object.entries(readDir(path.join(testPath, 'in-files')))
			.forEach(([filename, content]) =>
				outputFileSync(filename, content)
			);

		const {
			args,
			stdoutIncludes,
			stderrIncludes
		} = JSON.parse(fs.readFileSync(path.join(testPath, 'options.json')));

		const server = child_process.spawn(
			process.execPath,
			[
				path.join(__dirname, '..', 'bin', 'react-server-cli'),
				...args
			]
		);

		let stdout = '';
		let stderr = '';

		server.stdout.on('data', chunk => stdout += chunk);
		server.stderr.on('data', chunk => stderr += chunk);

		const frequency = 100;
		let elapsed = 0;

		await new Promise(resolve => {
			const checkForExpectedStdout = setInterval(() => {
				if (!stdout.includes(stdoutIncludes) && elapsed < 5000) return elapsed += frequency;
				clearInterval(checkForExpectedStdout);
				resolve();
			}, frequency);
		});

		if (stdoutIncludes) t.true(stdout.includes(stdoutIncludes), 'stdout includes expected output');
		if (stderrIncludes) t.true(stderr.includes(stderrIncludes), 'stderr includes expected output');

		server.kill();

		// Clean up again after the test
		rimraf.sync(tmpPath);
	});
});

function changeToTempDir(tmpPath){
	if (fs.existsSync(tmpPath)) rimraf.sync(tmpPath);
	fs.mkdirSync(tmpPath);
	process.chdir(tmpPath);
}

function noDotDirectory(x){
	return x !== '.';
}

function readDir(dirPath){
	const files = {};
	if (fs.existsSync(dirPath)) {
		readdirSyncRecursive(dirPath, noDotDirectory).forEach(filename => {
			files[filename] = fs.readFileSync(path.join(dirPath, filename));
		});
	}
	return files;
};
