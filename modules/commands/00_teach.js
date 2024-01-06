module.exports.config = {
	name: "teach",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Hazeyy", // Thanks to my friend John Lester for helping me out 
	description: "( 𝙏𝙚𝙖𝙘𝙝 𝙎𝙞𝙢 )",
	commandCategory: "no prefix",
	usages: "( Ask and Teach Sim )",
	cooldowns: 3
};

const axios = require("axios");

module.exports.handleEvent = async function ({ api, event }) {
	if (!(event.body.indexOf("teach") === 0 || event.body.indexOf("Teach") === 0)) return;
	const args = event.body.split(/\s+/);
	args.shift();

	if (args.length === 0) return api.sendMessage("😺 Please put a message", event.threadID, event.messageID);
	let text = args.join(" ");
	let data = text.split(">");
	let ask = (typeof data[0] !== "undefined") ? data[0].trim() : data[0];
	let answer = (typeof data[1] !== "undefined") ? data[1].trim() : data[1];
	if (!text.includes(">") || data.length === 1 || typeof answer === "undefined" || answer === "" || typeof ask === "undefined" || ask === "") return api.sendMessage(`😾 𝖶𝗋𝗈𝗇𝗀 𝗐𝖺𝗒 𝗈𝖿 𝗍𝖾𝖺𝖼𝗁\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: ${global.config.PREFIX}${this.config.name} 𝖧𝖾𝗅𝗅𝗈 > 𝖧𝖾𝗅𝗅𝗈 𝖽𝗂𝗇 𝗉𝗈\n𝖠𝗌𝗄: 𝖧𝖾𝗅𝗅𝗈\n𝖠𝗇𝗌𝗐𝖾𝗋: 𝖧𝖾𝗅𝗅𝗈 𝖽𝗂𝗇 𝗉𝗈`, event.threadID, event.messageID);
	try {
		let { data } = await axios.post("https://simsimi.fun/api/v2/?mode=teach&lang=en&message=" + encodeURIComponent(ask) + "&answer=" + encodeURIComponent(answer));
		if (data.success == true) {
			return api.sendMessage(`🗨️ 𝖠𝗌𝗄: ${ask}\n💬 𝖠𝗇𝗌𝗐𝖾𝗋: ${answer}\n\n𝖳𝗁𝖺𝗇𝗄𝗒𝗈𝗎 𝖿𝗈𝗋 𝗍𝖾𝖺𝖼𝗁𝗂𝗇𝗀 𝖲𝗂𝗆 😸`, event.threadID, event.messageID);
		} else {
			return api.sendMessage("😿 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝖾𝖽", event.threadID, event.messageID);
		}
	} catch {
		return api.sendMessage("😿 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝖾𝖽", event.threadID, event.messageID);
	}
};

module.exports.run = async function ({ api, event }) { }
