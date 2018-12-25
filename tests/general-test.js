const terrariaPlayerParser = require("../terraria-player-parser-node.js");
const path = require("path");

const players = ["sd"];

players.forEach( char => {
	const playerFile = path.resolve(__dirname, `players/${char}.plr`);
	let player = new terrariaPlayerParser( playerFile ).Load();

	console.log(player.bank);
	console.log(player.bank2);
	console.log(player.bank3);
});