const terrariaPlayerParser = require("../node/terraria-player-parser.js");
const path = require("path");

const players = ["sd"];

players.forEach( char => {
	const playerFile = path.resolve(__dirname, `players/${char}.plr`);
	let player = new terrariaPlayerParser( playerFile ).Load();

	console.log(player.name);
});