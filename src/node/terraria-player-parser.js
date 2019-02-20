const terrariaFileParser = require("./utils/terraria-file-parser.js");
const TerrariaPlayerParserError = require("./utils/terraria-player-parser-error.js");
const { createDecipheriv } = require("crypto");

module.exports = class terrariaPlayerParser extends terrariaFileParser
{
    constructor(path)
    {
        try {
            super(path);
        } catch (e) {
            throw new TerrariaPlayerParserError(e, "Problem with opening the file");
        }
    }

    parse()
    {
        try {
            this.decryptFile();
        } catch (e) {
            throw new TerrariaPlayerParserError(e, "Problem with decrypting the file");
        }
        
        try {
            return this.parsePlayer();
        } catch (e) {
            throw new TerrariaPlayerParserError(e, "Problem with parsing the file");
        }
    }

    parsePlayer()
    {
        let data = {};
        data.version        = this.readInt32();
        data.magicNumber    = this.readString(7);
        data.fileType       = this.readUInt8();
        data.revision       = this.readUInt32();
        this.skipBytes(7);
        data.favorite       = this.readBoolean(); //64 bit bool

        if ( data.version < 194 || data.magicNumber != "relogic" || data.fileType != 3 )
            throw new Error("player file version is not supported (only 1.3.5.3) or corrupted metadata");

        data.name           = this.readString();
        data.difficulty     = this.readUInt8();
        data.playTime       = this.readBytes(8); //new TimeSpan(binaryReader.ReadInt64())
        data.hair           = this.readInt32();
        data.hairDye        = this.readUInt8();
        data.hideVisual     = this.parseBitsByte(10);
        data.hideMisc       = this.parseBitsByte(8);
        data.skinVariant    = this.readUInt8();
        data.statLife       = this.readInt32();
        data.statLifeMax    = this.readInt32();
        data.statMana       = this.readInt32();
        data.statManaMax    = this.readInt32();
        data.extraAccessory = this.readBoolean();
        data.downedDD2EventAnyDifficulty = this.readBoolean();
        data.taxMoney       = this.readInt32();

        data.hairColor      = this.readRGB();
        data.skinColor      = this.readRGB();
        data.eyeColor       = this.readRGB();
        data.shirtColor     = this.readRGB();
        data.underShirtColor = this.readRGB();
        data.pantsColor     = this.readRGB();
        data.shoeColor      = this.readRGB();
        data.armor = [];
        for (let i = 0; i < 20; i++) {
            data.armor[i] = {};
            data.armor[i].id = this.readInt32();
            data.armor[i].prefix = this.readUInt8();
        }
        data.dye = [];
        for (let i = 0; i < 10; i++) {
            data.dye[i] = {};
            data.dye[i].id = this.readInt32();
            data.dye[i].prefix = this.readUInt8();
        }
        data.inventory = [];
        for (let i = 0; i < 58; i++) {
            data.inventory[i] = {};
            const id = this.readInt32();
            if (id >= 3930) {
                data.inventory[i].id = 0;
                this.skipBytes(5);
            } else {
                data.inventory[i].id = id;
                data.inventory[i].stack = this.readInt32();
                data.inventory[i].prefix = this.readUInt8();
                data.inventory[i].favorited = this.readBoolean();
            }
        }
        data.miscEquips = [];
        data.miscDyes = [];
        for (let i = 0; i < 5; i++) {
            data.miscEquips[i] = {};
            data.miscDyes[i] = {};

            let id = this.readInt32();
            if (id >= 3930) {
                data.miscEquips[i].id = 0;
                this.skipBytes(1);
            } else {
                data.miscEquips[i].id = id;
                data.miscEquips[i].prefix = this.readUInt8();
            }

            id = this.readInt32();
            if (id >= 3930) {
                data.miscDyes[i].id = 0;
                this.skipBytes(1);
            } else {
                data.miscDyes[i].id = id;
                data.miscDyes[i].prefix = this.readUInt8();
            }
        }

        data.bank = [];
        for (let i = 0; i < 40; i++) {
            data.bank[i] = {};
            data.bank[i].id = this.readInt32();
            data.bank[i].stack = this.readInt32();
            data.bank[i].prefix = this.readUInt8();
        }
        data.bank2 = [];
        for (let i = 0; i < 40; i++) {
            data.bank2[i] = {};
            data.bank2[i].id = this.readInt32();
            data.bank2[i].stack = this.readInt32();
            data.bank2[i].prefix = this.readUInt8();
        }
        data.bank3 = [];
        for (let i = 0; i < 40; i++) {
            data.bank3[i] = {};
            data.bank3[i].id = this.readInt32();
            data.bank3[i].stack = this.readInt32();
            data.bank3[i].prefix = this.readUInt8();
        }

        data.buffType = [];
        data.buffTime = [];
        let num = 22;
        for (let i = 0; i < num; i++) {
            data.buffType[i] = this.readInt32();
            data.buffTime[i] = this.readInt32();
            if (data.buffType[i] == 0) {
                i--;
                num--;
            }
        }

        data.spX = [];
        data.spY = [];
        data.spI = [];
        data.spN = [];
        for(let i = 0; i < 200; i++) {
            let num2 = this.readInt32();
            if (num2 != -1) {
                data.spX[i] = num;
                data.spY[i] = this.readInt32();
                data.spI[i] = this.readInt32();
                data.spN[i] = this.readString();
            } else
                break;
        }

        data.hbLocked = this.readBoolean();
        data.hideInfo = [];
        for(let i = 0; i < 13; i++)
            data.hideInfo[i] = this.readBoolean();

        data.anglerQuestsFinished = this.readInt32();
        data.DpadRadialBindings = [];
        for(let i = 0; i < 4; i++)
            data.DpadRadialBindings[i] = this.readInt32();
        data.builderAccStatus = [];
        for(let i = 0; i < 10; i++)
            data.builderAccStatus[i] = this.readInt32();
        data.bartenderQuestLog = this.readInt32();

        return data;
    }

    parseBitsByte(size)
    {
        /*
         * returns an array of bits values, reversed, booleans
         * 
         * example with 96 and 3 as this.readUInt8() :
         *  size = 10 bits  bytes [96,3]    0b_0110_0000_0000_0011  BitsByte bool [t,t,f,f,f,f,f,f,f,f]
         */

        let bytes = [];
        for (let i = size; i > 0; i = i - 8)
            bytes.push( this.readUInt8() );

        let bitValues = [];
        for (let i = 0, j = 0; i < size; i++, j++) {
            if (j == 8)
                j = 0;
            bitValues[i] = (bytes[~~(i / 8)] & (1 << j)) > 0;
        }

        return bitValues;
    }

    decryptFile()
    {
        /*
         * source code:
         *
         *  private static byte[] ENCRYPTION_KEY = new UnicodeEncoding().GetBytes("h3y_gUyZ");
         *  using (CryptoStream cryptoStream = new CryptoStream((Stream) memoryStream, rijndaelManaged.CreateDecryptor(Player.ENCRYPTION_KEY, Player.ENCRYPTION_KEY), CryptoStreamMode.Read))
         */

        const key = Buffer.from("h3y_gUyZ", "utf16le");
        const decipher = createDecipheriv('aes-128-cbc', key, key).setAutoPadding(false);

        this.buffer = decipher.update(this.buffer, "hex");
        decipher.final();
    }
}