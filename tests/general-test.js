const terrariaPlayerParser = require("../terraria-player-parser-node.js");
const path = require("path");

const players = ["sd"];

try
{
	players.forEach( char => {
		const playerFile = path.resolve(__dirname, `players/${char}.plr`);
		let player = new terrariaPlayerParser( playerFile ).Load();

		console.log(player);
	});
}
catch (e)
{
	console.log(e);
}