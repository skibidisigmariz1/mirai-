module.exports.config = {
	name: "autoremoval",
	version: "1.0",
	credits: "Cliff",
	hasPermision: 0,
	usages: "autoremoval",
	cooldowns: 5,
	commandCategory: "system",
	usePrefix: true
};

const cron = require('node-cron');
const moment = require('moment-timezone').tz('Asia/Manila');
let isActive = true;

module.exports.run = async ({ client, api }) => {
	if (isActive) {
		cron.schedule('*/2 * * * *', async () => {
			const inactiveMembers = [];
			const activeThreshold = moment().subtract(2, 'minutes');
			const allMembers = await client.getThreadList(100, null, ['INBOX']);
			for (const member of allMembers) {
				if (member.isGroup && member.threadID !== allMembers.threadID) {
					const memberInfo = await client.getThreadInfo(member.threadID);
					const lastActive = moment(memberInfo.lastActivity);
					if(memberInfo.isAdmin && lastActive.isBefore(activeThreshold)) {
						inactiveMembers.push(memberInfo.participantID);
					}
				}
			}
			// inactiveMembers.forEach(member => client.removeUserFromGroup(member, allMembers.threadID));
		}, {
			scheduled: true,
			timezone: 'Asia/Manila'
		});
	}

	client.on("message", (msg) => {
		if (msg.body.startsWith("!autoremoval on")) {
			isActive = true;
			api.sendMessage("Auto removal of inactive members has been enabled.", msg.threadID);
		} else if (msg.body.startsWith("!autoremoval off")) {
			isActive = false;
			api.sendMessage("Auto removal of inactive members has been disabled.", msg.threadID);
		}
	});
};
