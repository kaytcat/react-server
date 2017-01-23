import path from 'path';
import fs from 'fs';
import child_process from 'child_process';
import test from 'ava';
import rimraf from 'rimraf';

const tmpPath = path.join(__dirname, 'tmp');

// function clear(){
//   process.chdir(__dirname);
//   if (fs.existsSync(tmpPath)) rimraf.sync(tmpPath);
//   fs.mkdirSync(tmpPath);
//   process.chdir(tmpPath);
// }

test('test', async t => {
	process.chdir(`${__dirname}/fixtures/commands/start-basic/in-files`);

	const server = child_process.spawn(
		process.execPath,
		[
			path.join(__dirname, '..', 'bin', 'react-server-cli'),
			'start'
		]
	);

	let fullStdout = '';
	server.stdout.on('data', stdout => fullStdout += stdout);

	const expectedStdout = 'Started HTML server over HTTP on';
	const frequency = 100;
	let elapsed = 0;

	await new Promise(resolve => {
		const checkForExpectedStdout = setInterval(() => {
			if (!fullStdout.includes(expectedStdout) && elapsed < 5000) return elapsed += frequency;
			clearInterval(checkForExpectedStdout);
			resolve();
		}, frequency);
	});

	process.stdout.write(fullStdout);

	t.true(fullStdout.includes(expectedStdout), 'stdout includes server start notice');
	server.kill();
});
