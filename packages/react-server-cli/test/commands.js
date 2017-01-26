import path from 'path';
import fs from 'fs';
import readdirSyncRecursive from 'fs-readdir-recursive';
import outputFileSync from 'output-file-sync';
import child_process from 'child_process';
import test from 'ava';
import rimraf from 'rimraf';

const fixturesPath = path.join(__dirname, 'fixtures', 'commands');

fs.readdirSync(fixturesPath).forEach(testName => {
	// process.stdout.write(testName);
	if (testName[0] === '.') return;



	// FIXME: Remove!
	// if (testName !== 'start-basic' && testName !== 'start-missing-routesz') return;

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
		// process.chdir(`${__dirname}/fixtures/commands/start-basic/in-files`);


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

		if (stdoutIncludes) {
			process.stdout.write(`${testName} stdoutIncludes\n`)
			process.stdout.write(stdoutIncludes)
			process.stdout.write('\n')
		} else if (stderrIncludes) {
			process.stdout.write(`${testName} stderrIncludes\n`)
			process.stdout.write(stderrIncludes);
			process.stdout.write('\n');
		}

		await new Promise(resolve => {
			const checkForExpectedStdout = setInterval(() => {
				if (!stdout.includes(stdoutIncludes) && elapsed < 5000) return elapsed += frequency;
				clearInterval(checkForExpectedStdout);
				resolve();
			}, frequency);
		});

		// FIXME: Remove!
		process.stdout.write(`\n${testName} stdout\n`);
		process.stdout.write(stdout);
		process.stdout.write(`\n${testName} stderr\n`);
		process.stdout.write(stderr);


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

// clear();
// outputFileSync('foo', 'bar');
// process.stdout.write(fixturesPath);

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
