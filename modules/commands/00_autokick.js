const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

module.exports.config = {
	name: "setautoremoval",
	version: "1.0.0",
	credits: "Mirai Team",
	hasPermission: ["ADMINISTRATOR"],
	usages: [
		"setautoremoval enable",
		"setautoremoval disable"
	],
	commandCategory: "group",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args, Threads }) => {
	const threadID = event.threadID;

	// Load or initialize the removal settings
	const settingsPath = path.join(__dirname, 'autoremovalSettings.json');
	let settings;
	if (fs.existsSync(settingsPath)) {
		settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
	} else {
		settings = {};
	}

	// Ensure the bot is an admin
	const threadInfo = await Threads.getInfo(threadID);
	if (!threadInfo.adminIDs.some(e => e.id == api.getCurrentUserID())) {
		return api.sendMessage('I am not an admin in this group chat, so I cannot execute this command.', threadID);
	}

	// Command logic
	switch (args[0]) {
		case 'enable':
			if (settings[threadID] && settings[threadID].enabled) {
				return api.sendMessage('Auto-removal of inactive members is already enabled in this group.', threadID);
			}

			settings[threadID] = { enabled: true }; // Enable auto-removal
			fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

			// Define and start the cron job here
			cron.schedule('*/1 * * *', () => {
				// Custom logic to remove inactive members
				// Example: check last active time and remove members inactive for more than a month
				console.log('Checking for inactive members and removing them if necessary');
			}, {
				scheduled: true,
				timezone: "Asia/Ho_Chi_Minh"
			});

			api.sendMessage('Auto-removal of inactive members has been enabled.', threadID);
			break;

		case 'disable':
			if (settings[threadID] && settings[threadID].enabled) {
				settings[threadID].enabled = false; // Disable auto-removal
				fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
				api.sendMessage('Auto-removal of inactive members has been disabled.', threadID);
			} else {
				api.sendMessage('Auto-removal of inactive members is not enabled in this group.', threadID);
			}
			break;

		default:
			api.sendMessage('Invalid command! Use "setautoremoval enable" or "setautoremoval disable".', threadID);
	}
};
