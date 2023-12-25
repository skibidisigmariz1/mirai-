module.exports.config = {
		name: "slots",
		version: "1.0.0",
		credits: "cliff",
		hasPermission: 0,
		usages: "slots [bet amount]",
		commandCategory: "economy",
		cooldowns: 5
};

module.exports.run = async ({ api, event, args, Currencies }) => {
		const { threadID, messageID } = event;
		const betAmount = parseInt(args[0]);

		if (isNaN(betAmount) || betAmount <= 0) {
				return api.sendMessage("Invalid bet amount. Please enter a positive number of coins.", threadID, messageID);
		}

		const userData = await Currencies.getData(event.senderID);
		const balance = userData.money;

		if (balance < betAmount) {
				return api.sendMessage(`🎰 You don't have enough coins to bet. Your balance is ₪${balance}.`, threadID, messageID);
		}

		// Slots emoji set
		const slotsEmoji = ['🍇', '🍉', '🍊', '🍋', '🍌', '🍒', '🍓', '🍍'];
		let slotsResult = [];
		for (let i = 0; i < 3; i++) {
				slotsResult.push(slotsEmoji[Math.floor(Math.random() * slotsEmoji.length)]);
		}

		// Check if user won
		const isWin = slotsResult.every((val, i, arr) => val === arr[0]);

		// Build the result string
		let resultString = slotsResult.join(' | ');
		resultString += '\n\n';

		if (isWin) {
				const winAmount = betAmount * 2;
				await Currencies.increaseMoney(event.senderID, winAmount);
				resultString += `🎰 Congratulations! You won ₪${winAmount}! 🎰`;
		} else {
				await Currencies.decreaseMoney(event.senderID, betAmount);
				resultString += `🎰 Sorry, you lost ₪${betAmount}. Better luck next time! 🎰`;
		}

		return api.sendMessage(resultString, threadID, messageID);
};
