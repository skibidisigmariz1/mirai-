module.exports.config = {
	name: 'ai',
	version: '1.1.1',
	hasPermssion: 0,
	credits: 'Deku',
	description: 'An AI powered by ChatGPT',
	usePrefix: false,
	commandCategory: 'chatbots',
	usages: '[prompt]',
	cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
 const b = require('axios');
	let txt = args.join(" ");
try {
	if (!txt){ return api.sendMessage("Please provide a question first!", event.threadID, event.messageID)
}
api.sendMessage(`🔍"${txt}"`,event.threadID, event.messageID);
	const res = await b.get(`https://chatgayfeyti.archashura.repl.co/?gpt=${txt}`);
let resu = res.data.content;
api.sendMessage(resu, event.threadID, event.messageID)
		} catch (err){
return api.sendMessage("API Error", event.threadID, event.messageID)
		 }  
	}