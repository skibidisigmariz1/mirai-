module.exports.config = {
  name: "wyr",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Siegfried Sama",
  usages: "...",
  description: "whould you rather?",
  commandCategory: "text",
    cooldowns: 2,
};
module.exports.run = async ({ api, event,args }) => {
const axios = global.nodemodule["axios"];
const res = await axios.get(`https://api.popcat.xyz/wyr`);
var Siegfried = res.data.ops1;
var Sama = res.data.ops2;
return api.sendMessage(`Whould you rather? \n \nOption 1: ${Siegfried} \n \nOr \n \nOption 2: ${Sama}`, event.threadID, event.messageID)
}