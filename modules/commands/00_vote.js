module.exports.config = {
	name: "poll",
	version: "1.0.0",
	credits: "cliff",
	hasPermission: 0,
	usages: "poll [question] [options]",
	commandCategory: "utility",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const { threadID, messageID } = event;

	if (args.length < 3) {
		return api.sendMessage("Please provide a question and at least two options for the poll.", threadID, messageID);
	}

	const question = args[0];
	const options = args.slice(1);
	let pollMessage = `📊 *${question}*\n\n`;

	for (let i = 0; i < options.length; i++) {
		pollMessage += `${i + 1}. ${options[i]}\n`;
	}

	pollMessage += `\nReply with the number to vote!`;

	return api.sendMessage(pollMessage, threadID, messageID);
};
