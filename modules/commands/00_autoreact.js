const axios = require("axios");

let autoReactEnabled = true; // Variable to toggle auto-reaction on/off

module.exports.config = {
	name: "autoreact",
	version: "1.0.0", // Update with the appropriate version number
	hasPermission: 0,
	credits: "JV Barcenas & cyril",
	description: "Toggle auto-reaction based on message content",
	commandCategory: "Utility", // Update this with an appropriate category
	cooldowns: 5,
};

async function autoReactCommand(event) {
	try {
		if (autoReactEnabled) {
			const apiUrl = `https://school-project-lianefca.bene-edu-ph.repl.co/autoreact?query=${encodeURIComponent(event.body)}`;

			const response = await axios.get(apiUrl);
			const aiResponse = response.data.response; // Assuming the API returns a 'response' field

			// Set reaction using your bot's API function
			api.setMessageReaction(aiResponse, () => {}, true);
		}
	} catch (error) {
		console.error('Error fetching or setting reactions:', error);
	}
}

function toggleAutoReact(status) {
	autoReactEnabled = status.toLowerCase() === 'on';
}