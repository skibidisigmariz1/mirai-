const axios = require("axios");
const { createReadStream, unlinkSync } = require("fs");
const { resolve } = require("path");

module.exports.config = {
  name: "noti",
  version: "2.8",
  hasPermssion: 0,
  credits: "Hazeyy", //Credits to Mojako for this cmd
  description: "( 𝘼𝙣𝙣𝙤𝙪𝙣𝙘𝙚𝙢𝙚𝙣𝙩 )",
  usePrefix: true,
  commandCategory: "notification",
  usages: "( Announcement to all Groups )",
  cooldowns: 5,
};


module.exports.run = async function ({ api, event, args }) {
  
  const adminIDs = ['100048892837161', 'ADMIN_ID_2'];

    if (!adminIDs.includes(event.senderID)) {
        api.sendMessage("‼️ 𝖠𝗋𝖾 𝗒𝗈𝗎 𝖧𝖺𝗓𝖾𝗒𝗒? 𝖮𝖿𝖼𝗈𝗎𝗋𝗌𝖾 𝗇𝗈𝗍 𝖿𝗎𝖼𝗄𝗒𝗈𝗎 𝖻𝗂𝗍𝖼𝗁 𝗀𝖾𝗍 𝗅𝗈𝗌𝗍", event.threadID);
        return;
    }
  
  const threadList = await api.getThreadList(25, null, ["INBOX"]);
  let sentCount = 0;
  const custom = args.join(" ");

  async function sendMessage(thread) {
    try {
      await api.sendMessage(
        `𝙉𝙊𝙏𝙄𝘾𝙀 𝙁𝙍𝙊𝙈 𝘿𝙀𝙑𝙀𝙇𝙊𝙋𝙀𝙍 
 ---------------- 
『𝘋𝘦𝘷𝘦𝘭𝘰𝘱𝘦𝘳 𝘕𝘢𝘮𝘦』: 𝖧𝖺𝗓𝖾𝗒𝗒
 --------------- 
 『𝗡𝗼𝘁𝗶𝗰𝗲』${custom}`,
        thread.threadID
      );
      sentCount++;

      const content =`${custom}`;
      const languageToSay = "tl"; 
      const pathFemale = resolve(__dirname, "cache", `${thread.threadID}_female.mp3`);

      
      await global.utils.downloadFile(
        `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
          content
        )}&tl=${languageToSay}&client=tw-ob&idx=1`,
        pathFemale
      );
      api.sendMessage(
        { attachment: createReadStream(pathFemale) },
        thread.threadID,
        () => unlinkSync(pathFemale)
      );
    } catch (error) {
      console.error("😿 𝖤𝗋𝗋𝗈𝗋 𝗌𝖾𝗇𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌", error);
    }
  }

  for (const thread of threadList) {
    if (sentCount >= 20) {
      break;
    }
    if (thread.isGroup && thread.name != thread.threadID && thread.threadID != event.threadID) {
      await sendMessage(thread);
    }
  }

  if (sentCount > 0) {
    api.sendMessage(`✅ 𝖠𝗇𝗇𝗈𝗎𝗇𝖼𝖾𝗆𝖾𝗇𝗍 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗌𝖾𝗇𝗍..`, event.threadID);
  } else {
    api.sendMessage(
      "😿 𝖭𝗈 𝗀𝗋𝗈𝗎𝗉𝗌 𝖿𝗈𝗎𝗇𝖽",
      event.threadID
    );
  }
};