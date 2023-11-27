module.exports.config = {
    name: "pinterest",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Joshua Sy",
    description: "Image search",
    usePrefix: true,
    commandCategory: "utilities",
    usages: "[Text]",
    cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const request = require("request");
    const keySearch = args.join(" ");
    if(keySearch.includes("-") == false) return api.sendMessage('Please enter in the format, example: pinterest Naruto - 10 (Only 50 can generate images.)', event.threadID, event.messageID);
    const keySearchs = keySearch.substr(0, keySearch.indexOf('-'));
    const numberSearch = keySearch.split("-").pop() || 6;

    // Send "Please wait" message
    api.sendMessage("Please wait, searching for images...", event.threadID);

    const res = await axios.get(`https://api-dien.kira1011.repl.co/pinterest?search=${encodeURIComponent(keySearchs)}`);
    const data = res.data.data;
    var num = 0;
    var imgData = [];
    for (var i = 0; i < parseInt(numberSearch); i++) {
        let path = __dirname + `/cache/${num+=1}.jpg`;
        let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
        imgData.push(fs.createReadStream(__dirname + `/cache/${num}.jpg`));
    }

    // Send the search results
    api.sendMessage({
        attachment: imgData,
        body: numberSearch + ' Search results for keyword: ' + keySearchs
    }, event.threadID, event.messageID);

    // Delete the cached images
    for (let ii = 1; ii <= parseInt(numberSearch); ii++) {
        fs.unlinkSync(__dirname + `/cache/${ii}.jpg`);
    }
};