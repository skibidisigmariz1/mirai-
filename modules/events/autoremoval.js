module.exports.config = {
	name: "autoremoval",
	eventType: ["message"],
	version: "1.0",
	credits: "Cliff",
	description: "Auto removal of inactive members",
	dependencies: {
		"fs-extra": "^10.0.0"
	}
};

const cron = require('node-cron');
const moment = require('moment-timezone').tz('Asia/Manila');

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
	inactiveMembers.forEach(member => client.removeUserFromGroup(member, allMembers.threadID));
}, {
	scheduled: true,
	timezone: 'Asia/Manila'
});
