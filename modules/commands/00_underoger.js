const axios = require('axios');

module.exports.config = {
	name: "uncleroger",
	version: "2.3.0",
	credits: "akhirokiyoshi api by lian",
	hasPermission: 0,
	commandCategory: "utility",
	usage: "[ prefix ]uncleroger [promt]",
	usePrefix: true,
	cooldown: 0
};

module.exports.run = async ({ api, event, args }) => {
	try {
		const response = await axios.get(`https://lianeapi.onrender.com/@nealianacagara/api/UncleRoger?query=${args.join(" ")}`);
		api.sendMessage(response.data.message, event.threadID, () => null, event.messageID);
		api.sendMessage("I hope that answers your question!", event.threadID);
	} catch (error) {
		console.error(error);
		api.sendMessage("Oops! Something went wrong. Please try again later. ", event.threadID);
	}
};