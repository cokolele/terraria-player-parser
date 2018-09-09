const terrariaPlayerParser = require("../terraria-player-parser.js");

const players = ["sd"];

try
{
	players.forEach( char => {
		let player = new terrariaPlayerParser("./players/" + char + ".plr").Load();
/*		console.log("\n" + char);
		console.log( Object.keys(player) ); */

		console.log(player);
	});
}
catch (e)
{
	console.log(e);
}