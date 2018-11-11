const terrariaFileParser = require("./utils/terraria-file-parser.js");

class terrariaPlayerParser extends terrariaFileParser
{
	constructor(path)
	{
		try
		{
			super(path);
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

		data.version 	= this.ReadInt32();
		data.daco 		= this.ReadBytes(8);
		data.revision 	= this.ReadUInt32();
		this.SkipBytes(7);
		data.favorite 	= this.ReadBoolean(); //for some reason it is 64 bit boolean...
		data.name 		= this.ReadString();
		data.difficulty = this.ReadUInt8();
		data.playTime 	= this.ReadBytes(8); //new TimeSpan(binaryReader.ReadInt64()
		data.hair 		= this.ReadInt32();
		data.hairDye 	= this.ReadUInt8();
		this.SkipBytes(3); //wtf is BitsByte
		data.skinVariant = this.ReadUInt8();
		data.statLife = this.ReadInt32();
		data.statLifeMax = this.ReadInt32();
		data.statMana = this.ReadInt32();
		data.statManaMax = this.ReadInt32();
		data.extraAccessory = this.ReadBoolean();
		data.downedDD2EventAnyDifficulty = this.ReadBoolean();
		data.taxMoney = this.ReadInt32();
		data.hairColor = this.ReadRGB();
		data.skinColor = this.ReadRGB();
		data.eyeColor = this.ReadRGB();
		data.shirtColor = this.ReadRGB();
		data.underShirtColor = this.ReadRGB();
		data.pantsColor = this.ReadRGB();
		data.shoeColor = this.ReadRGB();

		data.armor = [];
		for (let i = 0; i < 20; i++)
		{
			data.armor[i] = {};
			data.armor[i].id = this.ReadInt32();
			data.armor[i].prefix = this.ReadUInt8();
		}

		data.dye = [];
		for (let i = 0; i < 10; i++)
		{
			data.dye[i] = {};
			data.dye[i].id = this.ReadInt32();
			data.dye[i].prefix = this.ReadUInt8();
		}
		
		data.inventory = [];
		for (let i = 0; i < 58; i++)
		{
			data.inventory[i] = {};

			const id = this.ReadInt32();
			if (id >= 3930)
			{
				data.inventory[i].id = 0;
				this.SkipBytes(5);
			}
			else
			{
				data.inventory[i].id = id;
				data.inventory[i].stack = this.ReadInt32();
				data.inventory[i].prefix = this.ReadUInt8();
				data.inventory[i].favorited = this.ReadBoolean();
			}
		}

		data.miscEquips = [];
		data.miscDyes = [];
		for (let i = 0; i < 5; i++)
		{
			data.miscEquips[i] = {};
			data.miscDyes[i] = {};

			let id = this.ReadInt32();
			if (id >= 3930)
			{
				data.miscEquips[i].id = 0;
				this.SkipBytes(1);
			}
			else
			{
				data.miscEquips[i].id = id;
				data.miscEquips[i].prefix = this.ReadUInt8();
			}

			id = this.ReadInt32();
			if (id >= 3930)
			{
				data.miscDyes[i].id = 0;
				this.SkipBytes(1);
			}
			else
			{
				data.miscDyes[i].id = id;
				data.miscDyes[i].prefix = this.ReadUInt8();
			}
		}

		data.bank = [];
		for (let i = 0; i < 40; i++)
		{
			data.bank[i] = {};

			data.bank[i].id = this.ReadInt32();
			data.bank[i].stack = this.ReadInt32();
			data.bank[i].prefix = this.ReadUInt8();
		}

		data.bank2 = [];
		for (let i = 0; i < 40; i++)
		{
			data.bank2[i] = {};

			data.bank2[i].id = this.ReadInt32();
			data.bank2[i].stack = this.ReadInt32();
			data.bank2[i].prefix = this.ReadUInt8();
		}

		data.bank3 = [];
		for (let i = 0; i < 40; i++)
		{
			data.bank3[i] = {};

			data.bank3[i].id = this.ReadInt32();
			data.bank3[i].stack = this.ReadInt32();
			data.bank3[i].prefix = this.ReadUInt8();
		}

		data.buffType = [];
		data.buffTime = [];
		let num = 22;
		for (let i = 0; i < num; i++)
		{
			data.buffType[i] = this.ReadInt32();
			data.buffTime[i] = this.ReadInt32();

			if (data.buffType[i] == 0)
			{
				i--;
				num--;
			}
		}

		data.spX = [];
		data.spY = [];
		data.spI = [];
		data.spN = [];
		for(let i = 0; i < 200; i++)
		{
			let num2 = this.ReadInt32();
			if (num2 != -1)
			{
				data.spX[i] = num;
				data.spY[i] = this.ReadInt32();
				data.spI[i] = this.ReadInt32();
				data.spN[i] = this.ReadString();
			}
			else
				break;
		}

		data.hbLocked = this.ReadBoolean();

		data.hideInfo = [];
		for(let i = 0; i < 13; i++)
			data.hideInfo[i] = this.ReadBoolean();

		data.anglerQuestsFinished = this.ReadInt32();

		data.DpadRadialBindings = [];
		for(let i = 0; i < 4; i++)
			data.DpadRadialBindings[i] = this.ReadInt32();

		data.builderAccStatus = [];
		for(let i = 0; i < 10; i++)
			data.builderAccStatus[i] = this.ReadInt32();

		data.bartenderQuestLog = this.ReadInt32();
				console.log(this.buffer.length);
		console.log(this.offset);

		return data;
	}

	DecryptFile()
	{
		/*
		 *  private static byte[] ENCRYPTION_KEY = new UnicodeEncoding().GetBytes("h3y_gUyZ");
		 *  using (CryptoStream cryptoStream = new CryptoStream((Stream) memoryStream, rijndaelManaged.CreateDecryptor(Player.ENCRYPTION_KEY, Player.ENCRYPTION_KEY), CryptoStreamMode.Read))
		 */
		try
		{		
			const { createDecipheriv } = require("crypto");
			const key = Buffer.from("h3y_gUyZ", "utf16le");
			const decipher = createDecipheriv('aes-128-cbc', key, key).setAutoPadding(false);

			this.buffer = decipher.update(this.buffer, "hex");
			decipher.final();
		}
		catch(e)
		{
			console.log(e);
		}
	}
}

module.exports = terrariaPlayerParser;