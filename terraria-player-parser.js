const terrariaFileParser = require("./utils/terraria-file-parser.js");

class terrariaPlayerParser extends terrariaFileParser
{
	constructor(path)
	{
		try
		{
			super(path, "player");
		}
		catch (e)
		{
			if (e.code = "ENOENT")
				e.message = `terraria-player-parser error \ndescription: wrong path \ndetails: ${e.stack}`;
			else
				e.message = `terraria-player-parser error \ndetails: ${e.stack}`;

			throw e;
		}
	}

	Load()
	{
		this.DecryptFile();

		let data = {};

		data.version = this.ReadInt32();
		data.daco = this.ReadBytes(8);
		data.revision = this.ReadUInt32();
		data.favorite = this.ReadBytes(8);
		data.name = this.ReadString();
		data.difficulty = this.ReadByte();
		data.playTime = this.ReadBytes(8); //new TimeSpan(binaryReader.ReadInt64()
		data.hair = this.ReadInt32();
		data.hairDye = this.ReadByte();
/*		
		dačo
		data.name = this.ReadString();
*/
		return data;
	}

	DecryptFile()
	{
		/*
		 *  private static byte[] ENCRYPTION_KEY = new UnicodeEncoding().GetBytes("h3y_gUyZ");
		 *  using (CryptoStream cryptoStream = new CryptoStream((Stream) memoryStream, rijndaelManaged.CreateDecryptor(Player.ENCRYPTION_KEY, Player.ENCRYPTION_KEY), CryptoStreamMode.Read))
		 */
		const crypto = require("crypto");
		const key = Buffer.from("h3y_gUyZ", "utf16le");
		const decipher = crypto.createDecipheriv('aes-128-cbc', key, key).setAutoPadding(false);

		this.buffer = decipher.update(this.buffer, "hex");
		decipher.final();
	}
}

module.exports = terrariaPlayerParser;