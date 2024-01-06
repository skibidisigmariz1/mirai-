const path = require('path');
const fs = require('fs');
const axios = require('axios');
	
module.exports.config = {
	name: "rankup",
	version: "7.3.1",
	hasPermssion: 1,
	credits: "John Lester",
	description: "Announce rankup for each group, user",
	usePrefix: true,
	commandCategory: "Edit-IMG",
	dependencies: {
		"fs-extra": ""
	},
	cooldowns: 2,
};

module.exports.handleEvent = async function({
	api, event, Currencies, Users, getText }) {
	var { threadID, senderID } = event;
	const { loadImage, createCanvas } = require("canvas");
	const fs = global.nodemodule["fs-extra"];
	const axios = global.nodemodule["axios"];
	let pathImg = __dirname + "/cache/rankup/rankup.gif";
	let pathAvt1 = __dirname + "/cache/Avtmot.png";
	var id1 = event.senderID;


	threadID = String(threadID);
	senderID = String(senderID);

	const thread = global.data.threadData.get(threadID) || {};

	let exp = (await Currencies.getData(senderID))
		.exp;
	exp = exp += 1;

	if (isNaN(exp)) return;

	if (typeof thread["rankup"] != "undefined" && thread["rankup"] == false) {
		await Currencies.setData(senderID, {
			exp
		});
		return;
	};

	const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
	const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

	// ... (existing code remains unchanged)

	if (level > curLevel && level != 1) {
			const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
			var message = (typeof thread.customRankup == "undefined") ? getText("levelup") : thread.customRankup;

			message = message
					.replace(/\{name}/g, name)
					.replace(/\{level}/g, level);

			const moduleName = this.config.name;

			var background = [
					"https://i.imgur.com/h6UbIMO.gif", "https://i.imgur.com/vnnyLV8.gif", "https://i.imgur.com/9Kq4ySX.gif",					"https://i.imgur.com/zZxcj9A.gif", "https://i.imgur.com/vfNN0wz.gif", "https://i.imgur.com/zZM4IHC.gif"
			];
			var rd = background[Math.floor(Math.random() * background.length)];
			let getAvtmot = (
					await axios.get(
							`https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
							{ responseType: "arraybuffer" }
					)
			).data;
			fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

			let getBackground = (
					await axios.get(`${rd}`, {
							responseType: "arraybuffer"
					})
			).data;
			fs.writeFileSync(pathImg, Buffer.from(getBackground, "utf-8"));

			let baseImage = await loadImage(pathImg);
			let baseAvt1 = await loadImage(pathAvt1);
			let canvas = createCanvas(720, 720); // Adjust canvas size to match the picture size
			let ctx = canvas.getContext("2d");

			// Draw the background
			ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

			// Draw the member's picture on the GIF
			ctx.drawImage(baseAvt1, 150, 150, 100, 100); // Adjust position and size as needed

			const imageBuffer = canvas.toBuffer();
			fs.writeFileSync(pathImg, imageBuffer);
			fs.removeSync(pathAvt1);

			api.sendMessage({
					body: message,
					mentions: [{
							tag: name,
							id: senderID
					}],
					attachment: fs.createReadStream(pathImg)
			}, event.threadID, () => fs.unlinkSync(pathImg));
	}

	await Currencies.setData(senderID, {
		exp
	});
	return;
}

module.exports.languages = {
	"en": {
		"on": "on",
		"off": "off",
		"successText": "success notification rankup!",
		"levelup": "✿━━━━━━━━━━━━━━━━━━✿\n𝙇𝙫𝙡 𝙐𝙥!『 {name} 』👏, 𝖸𝗈𝗎𝗋 𝗍𝗒𝗉𝗂𝗇𝗀 𝖺𝖻𝗂𝗅𝗂𝗍𝗂𝖾𝗌 𝗁𝖺𝗌 𝗋𝖾𝖺𝖼𝗁𝖾𝖽 𝗅𝖾𝗏𝖾𝗅 {level}\n✿━━━━━━━━━━━━━━━━━━✿",
	}
}

module.exports.run = async function({ api, event, Threads, getText }) {
	const {
		threadID
		, messageID
	} = event;
	let data = (await Threads.getData(threadID))
		.data;

	if (typeof data["rankup"] == "undefined" || data["rankup"] == false) data["rankup"] = true;
	else data["rankup"] = false;

	await Threads.setData(threadID, {
		data
	});
	global.data.threadData.set(threadID, data);
	return api.sendMessage(`${(data["rankup"] == true) ? getText("on") : getText("off")} ${getText("successText")}`, threadID, messageID);
}