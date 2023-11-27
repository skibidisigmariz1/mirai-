module.exports.config = {
	name: "showerthoughts",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "John Arida",
	description: "Random shower thoughts",
  usages: "...",
	commandCategory: "text",
	cooldowns: 5
};

module.exports.run = async ({ api, event,args }) => {
const axios = global.nodemodule["axios"];
const res = await axios.get(`https://api.popcat.xyz/showerthoughts`);
var john = res.data.result;
var arida = res.data.author

return api.sendMessage(`${john} \n~ ${arida}`, event.threadID, event.messageID)
} 