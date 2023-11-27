const axios = require('axios');
const fs = require('fs');

module.exports.config = {
  name: "cat",
  version: "3.8",
  hasPermission: 0,
  credits: "Minn&Remod by Hazeyy", 
  description: "( 😼 𝙈𝙚𝙤𝙬𝙬 - 𝘾𝙖𝙩𝙂𝙋𝙏 )",
  commandCategory: "educ and fun",
  usages: "( Chat with CatGPT Image Generated Meeow 😾 )",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!(event.body.indexOf("cat") === 0 || event.body.indexOf("Cat") === 0)) return;
  const args = event.body.split(/\s+/);
  args.shift();
  const q = args.join(" "); 
  api.sendMessage("🗨️ | 𝘔𝘦𝘰𝘸𝘸 𝘮𝘦𝘰𝘸𝘸...", event.threadID, event.messageID);

  try {
    const response = await axios.post("https://catgpt.guru/api/chat", {
      messages: [
        {
          role: "user",
          content: q,
        },
      ],
    });

    // Apply the formatFont function to format the response text
    const formattedResponse = formatFont(response.data);

    api.sendMessage(formattedResponse, event.threadID, event.messageID);

    const imgData = await searchPinterest(q, event.threadID, event.messageID);

    if (imgData && imgData.length > 0) {
      api.sendMessage({
        body: `😾 𝘔𝘦𝘰𝘸𝘸 𝘮𝘦𝘰𝘸𝘸 `,
        attachment: imgData
      }, event.threadID, event.messageID);
    } else {
      api.sendMessage("🔴 𝖴𝗇𝖾𝗑𝗉𝖾𝖼𝗍𝖾𝖽 𝖤𝗋𝗋𝗈𝗋, 𝖶𝗁𝗂𝗅𝖾 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾𝗌", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage('catgpt didn\'t meow back:(', event.threadID, event.messageID);
  }
};

async function searchPinterest(query, threadID, messageID) {
  try {
    const res = await axios.get(`https://api-dien.kira1011.repl.co/pinterest?search=${encodeURIComponent(query)}`);
    const data = res.data.data;
    var num = 0;
    var imgData = [];
    for (var i = 0; i < 6; i++) {
      let path = __dirname + `/cache/${num+=1}.jpg`;
      let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path, Buffer.from(getDown, 'binary'));
      imgData.push(fs.createReadStream(__dirname + `/cache/${num}.jpg`));
    }
    for (let ii = 1; ii < 6; ii++) {
      fs.unlinkSync(__dirname + `/cache/${ii}.jpg`);
    }
    return imgData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports.run = async function({api, event}) {
  // You can add code here to handle the run command if needed.
};

function formatFont(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };

  let formattedText = "";
  for (const char of text) {
    if (char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }

  return formattedText;
}