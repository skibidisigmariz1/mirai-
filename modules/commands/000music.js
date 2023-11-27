module.exports.config = {
  name: "music",
  version: "1.8",
  hasPermssion: 0,
  credits: "John lester",
  description: "( 𝙈𝙪𝙨𝙞𝙘 🎵 )",
  commandCategory: "mp3",
  usages: "( Search Music )",
  cooldowns: 3,
  dependencies: {
    "fs-extra": "",
    "request": "",
    "axios": "",
    "@distube/ytdl-core": "",
    "yt-search": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const axios = require("axios");
  const fs = require("fs-extra");
  const ytdl = require("@distube/ytdl-core");
  const request = require("request");
  const yts = require("yt-search");

  const input = event.body;
  const text = input.substring(12);
  const data = input.split(" ");

  if (data.length < 2) {
    return api.sendMessage("𝖧𝖾𝗅𝗅𝗈👋, 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗉𝗎𝗍 𝖺 𝗌𝗈𝗇𝗀 𝗍𝗈 𝗌𝖾𝖺𝗋𝖼𝗁 𝗈𝗇 𝗆𝗎𝗌𝗂𝖼", event.threadID);
  }

  data.shift();
  const song = data.join(" ");

  try {
    api.sendMessage(`🎵 | 𝘚𝘦𝘢𝘳𝘤𝘩𝘪𝘯𝘨 𝘔𝘶𝘴𝘪𝘤...`, event.threadID);

    const res = await axios.get(`https://api.heckerman06.repl.co/api/other/lyrics2?song=${encodeURIComponent(song)}`);
    const lyrics = res.data.lyrics || "🔴 𝖫𝗒𝗋𝗂𝖼𝗌 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽";
    const title = res.data.title || "🔴 𝖳𝗂𝗍𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽";
    const artist = res.data.artist || "🔴 𝖠𝗋𝗍𝗂𝗌𝗍 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽";

    const searchResults = await yts(song);
    if (!searchResults.videos.length) {
      return api.sendMessage("⚠️ 𝖴𝗇𝖾𝗑𝗉𝖾𝖼𝗍𝖾𝖽 𝖾𝗋𝗋𝗈𝗋, 𝖶𝗁𝗂𝗅𝖾 𝗌𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝗆𝗎𝗌𝗂𝖼..", event.threadID, event.messageID);
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;

    const stream = ytdl(videoUrl, { filter: "audioonly" });

    const fileName = `${event.senderID}.mp3`;
    const filePath = __dirname + `/cache/${fileName}`;

    stream.pipe(fs.createWriteStream(filePath));

    stream.on('response', () => {
      console.info('[DOWNLOADER]', 'Starting download now!');
    });

    stream.on('info', (info) => {
      console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
    });

    stream.on('end', () => {
      console.info('[DOWNLOADER] Downloaded');

      if (fs.statSync(filePath).size > 26214400) {
        fs.unlinkSync(filePath);
        return api.sendMessage('⚠ | ERROR The file could not be sent because it is larger than 25MB.', event.threadID);
      }

      const message = {
        body: `✿  𝙈𝙪𝙨𝙞𝙘 🎵 ✿ \n\n𝙎𝙤𝙣𝙜: ${title} `,
        attachment: fs.createReadStream(filePath)
      };

      api.sendMessage(message, event.threadID, () => {
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error('[ERROR]', error);
    api.sendMessage('⚠️ 𝖴𝗇𝖾𝗑𝗉𝖾𝖼𝗍𝖾𝖽 𝖾𝗋𝗋𝗈𝗋, 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋..', event.threadID);
  }
};