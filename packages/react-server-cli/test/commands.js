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
	const server = child_process.spawn(process.execPath, [path.join(__dirname, '..', 'bin', 'react-server-cli'), 'start']);

	server.stderr.on('data', stderr => process.stderr.write(stderr));
	server.stdout.on('data', stdout => process.stdout.write(stdout));

	await new Promise(resolve => {
		setTimeout(() => {
			resolve();
			server.kill();
		}, 3000);
	});
});
