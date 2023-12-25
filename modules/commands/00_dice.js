const fs = require('fs');

// Helper function to roll a die
const rollDie = (sides = 6) => Math.floor(Math.random() * sides) + 1;

// Helper function to convert numeric roll to an emoji
const numberToEmoji = (roll) => {
	const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
	return diceEmojis[roll - 1];
};

module.exports.config = {
	name: "dice",
	version: "1.0.0",
	hasPermision: 0,
	credits: "Yazky",
	description: "Roll one or more virtual dice",
	usages: "[maxBet]",
	commandCategory: "games",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const threadID = event.threadID;
	const messageID = event.messageID;
	const maxBet = 17000;
	const betAmount = parseInt(args[0]) || 0;

	if (isNaN(betAmount) || betAmount < 0 || betAmount > maxBet) {
		return api.sendMessage(`Invalid bet amount. Please enter a number between 0 and ${maxBet}.`, threadID, messageID);
	}

	const userRoll = rollDie();
	const botRoll = rollDie();
	let resultMessage = `You got: ${numberToEmoji(userRoll)}\nYazkybot got: ${numberToEmoji(botRoll)}\n\n`;

	if (userRoll > botRoll) {
		resultMessage += `You won ₪${betAmount} with a result of ${userRoll}`;
	} else if (botRoll > userRoll) {
		resultMessage += `You lost ₪${betAmount} with a result of ${userRoll}`;
	} else {
		resultMessage += `Both of you were tied with a result of ${userRoll}`;
	}

	api.sendMessage(resultMessage, threadID, messageID);
};
