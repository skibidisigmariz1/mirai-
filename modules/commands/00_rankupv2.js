module.exports.config = {
	name: "rankup2",
	version: "1.0.1",
	hasPermssion: 1,
	credits: "Mirai Team",
	description: "tell the reached rank of the user",
	commandCategory: "Edit-IMG",
	usePrefix: true,
	cooldowns: 0,
	dependencies: {
		"fs-extra": ""
	},  
};

module.exports.handleEvent = async function({ api, event, Currencies, Users, getText }) {
	var { threadID, senderID } = event;
	const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];

	threadID = String(threadID);
	senderID = String(senderID);

	const thread = global.data.threadData.get(threadID) || {};

	let exp = (await Currencies.getData(senderID)).exp;
	exp = exp + 1; // Increment exp by 1

	if (isNaN(exp)) return;

	if (typeof thread["rankup"] != "undefined" && !thread["rankup"]) {
		await Currencies.setData(senderID, { exp });
		return;
	};

	const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3)) - 1) / 2);
	const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3)) - 1) / 2);

	if (level > curLevel && level != 1) {
		const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
		var message = (typeof thread.customRankup == "undefined") ? getText("levelup") : thread.customRankup;
		let arrayContent;

		message = message
			.replace(/\{name}/g, name)
			.replace(/\{level}/g, level);

		if (!existsSync(__dirname + "/noprefix/rankup/")) mkdirSync(__dirname + "/noprefix/rankup/", { recursive: true });
		if (existsSync(__dirname + `/noprefix/rankup/rankup.gif`)) arrayContent = { body: message, attachment: createReadStream(__dirname + `/noprefix/rankup/rankup.gif`), mentions: [{ tag: name, id: senderID }] };
		else arrayContent = { body: message, mentions: [{ tag: name, id: senderID }] };

		const moduleName = this.config.name;
		api.sendMessage(arrayContent, threadID, async function (error, info) {
			if (error) return console.error(error);
			if (global.configModule[moduleName].autoUnsend) {
				await new Promise(resolve => setTimeout(resolve, global.configModule[moduleName].unsendMessageAfter * 1000));
				return api.unsendMessage(info.messageID);
			}
		});
	}

	await Currencies.setData(senderID, { exp });
}

module.exports.languages = {
	"vi": {
		"off": "Tắt",
		"on": "Bật",
		"successText": "Thông báo lên rương thành công!",
		"levelup": "Lên cấp! {name}, kỹ năng đánh máy đã đạt cấp {level} 🎉"
	},
	"en": {
		"on": "on",
		"off": "off",
		"successText": "success notification rankup!",
		"levelup": "Lvl Up! \"{name}\"👏, Your typing abilities has reached level {level}"
	}
}

module.exports.run = async function({ api, event, Threads, getText }) {
	const { threadID, messageID } = event;
	const data = await Threads.getData(threadID);
	const threadData = data.data || {};

	if (typeof threadData["rankup"] == "undefined" || threadData["rankup"] === false) threadData["rankup"] = true;
	else threadData["rankup"] = false;

	await Threads.setData(threadID, { data: threadData });
	global.data.threadData.set(threadID, threadData);

	const text = threadData["rankup"] ? getText("on") : getText("off");
	return api.sendMessage(`${text} ${getText("successText")}`, threadID, messageID);
}
