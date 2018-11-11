const terrariaPlayerParser = require("../terraria-player-parser.js");

const players = ["hello"];

try
{
	players.forEach( char => {
		let player = new terrariaPlayerParser("C:/Users/Lukáš/Documents/my games/Terraria/Players/" + char + ".plr").Load();
/*		console.log("\n" + char);
		console.log( Object.keys(player) ); */

		//console.log(player);
	});
}
catch (e)
{
	console.log(e);
}