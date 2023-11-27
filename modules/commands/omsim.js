module.exports.config = {
	name: "goiadmin",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "John Arida",
	description: "Bot will rep ng tag admin or rep ng tagbot ",
	commandCategory: "Other",
	usages: "",
	cooldowns: 1
};
module.exports.handleEvent = function({ api, event }) {
	if (event.senderID !== "100072744662713") {
		var aid = ["100053549552408"];
		for (const id of aid) {
		if ( Object.keys(event.mentions) == id) {
			var msg = ["Stop mentioning my creator, he's busy 😗","natulog na ata","My Creator is currently offline 😢", "Sorry, naka bebetime pa don't disturb him 🙄","Do you like my creator thats why your tagging him? Why dont you add him https://www.facebook.com/swordigo.swordslush 😏"," Another tag in my Creator, i will kick your fucking ass 😈"];
			api.setMessageReaction("😍", event.messageID, (err) => {}, true);
			return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
		}
		}}
};
module.exports.run = async function({}) {
}