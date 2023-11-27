const { Hercai } = require('hercai');

const herc = new Hercai();

module.exports.config = {
	name: 'hercai',
	version: '1.0.0',
	hasPermission: 0,
	credits: 'Norlito',
	description: 'Ask a question to Hercai AI',
	commandCategory: 'ai',
	usages: ['hercai <your_question>'],
	cooldowns: 2,
	usePrefix: true, // Enable this to use a prefix
};

module.exports.run = async ({ api, event, args }) => {
	if (args.length < 1) {
		return api.sendMessage('Please provide a question.', event.threadID);
	}

	const question = args.join(' ');

	// Replace 'v2' with your desired model if needed
	herc.question({ model: 'v2', content: question })
		.then((response) => {
			const reply = response.reply;

			api.sendMessage(reply, event.threadID);
		})
		.catch((error) => {
			console.error('Error while making the Hercai API request:', error);
			api.sendMessage('An error occurred while processing your question.', event.threadID);
		});
};
