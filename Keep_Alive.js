const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Cliff!!'));

app.listen(port, () =>
	console.log(`Your app is listening at http://localhost:${port}`)
);

// Run the app for 120 hours
const durationInHours = 120;
const millisecondsInHour = 60 * 60 * 1000;
const totalTimeToRun = durationInHours * millisecondsInHour;

setTimeout(() => {
	console.log(`The script run for ${durationInHours} hours and has stopped now.`);
	process.exit(0); // Exit the process after the duration ends
}, totalTimeToRun);

