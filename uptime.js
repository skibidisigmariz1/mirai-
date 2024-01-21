const Monitor = require('ping-monitor');
const notifier = require('node-notifier');

const myMonitor = new Monitor({
		address: '127.0.0.1', // Replace with the IP address of the web server running the bot or leave as 127.0.0.1, also known as localhost (just for pros 🐧)
		port: 8080, // Bot's port
		interval: 10, // 10 seconds
		config: {
				intervalUnits: 'seconds', // minutes, seconds, hour
				generateId: false // defaults to true
		}
});

myMonitor.on('up', function (res, state) {
		console.log('Check Connected: ' + res.address + ':' + res.port + ' is Online!'); //ping 
});

myMonitor.on('down', function (res, state) {
		console.log('Check Connected: ' + res.address + ':' + res.port + ' is Offline!');
		return notifier.notify({ title: 'Check Connected', message: 'Bot is Dead =))' }); // notification
});

myMonitor.on('stop', function (res, state) {
		console.log(res.address + ' monitor has stopped.');
		return notifier.notify({ title: 'Check Connected', message: 'Bot is Dead =))' });
});

myMonitor.on('error', function (error, res) {
		console.log(error);
		return notifier.notify({ title: 'Check Connected', message: 'Bot is Dead =))' });
});

myMonitor.on('timeout', function (error, res) {
		console.log(error);
		return notifier.notify({ title: 'Check Connected', message: 'Bot is Dead =))' });
});
