const terrariaFileParser = require("./utils/terraria-file-parser.js");
const TerrariaPlayerParserError = require("./utils/terraria-player-parser-error.js");
const aes = require("aes-js");

class terrariaPlayerParser extends terrariaFileParser
{
    constructor(file)
    {
        try {
            super(file);
        } catch(e) {
            throw TerrariaPlayerParserError(e, "Problem with opening the file");
        }
    }

// constructor cant be asynchronous
    async LoadFile()
    {
        await super.LoadFile();
    }

    async Parse()
    {
        try {
            this.DecryptFile();
        } catch(e) {
            throw TerrariaPlayerParserError(e, "Problem with decrypting the file");
        }

        let data = {};
        try {
            data.version        = this.ReadInt32();
            data.magicNumber    = this.ReadString(7);
            data.fileType       = this.ReadUInt8();
            data.revision       = this.ReadUInt32();
            this.SkipBytes(7);
            data.favorite       = this.ReadBoolean(); //64 bit bool

            if ( data.version < 194 || data.magicNumber != "relogic" || data.fileType != 3 )
                throw new Error("world file version is not supported (only 1.3.5.3) or corrupted metadata");

            data.name           = this.ReadString();
            data.difficulty     = this.ReadUInt8();
            data.playTime       = this.ReadBytes(8); //new TimeSpan(binaryReader.ReadInt64())
            data.hair           = this.ReadInt32();
            data.hairDye        = this.ReadUInt8();
            data.hideVisual     = this.ParseBitsByte(10);
            data.hideMisc       = this.ParseBitsByte(8);
            data.skinVariant    = this.ReadUInt8();
            data.statLife       = this.ReadInt32();
            data.statLifeMax    = this.ReadInt32();
            data.statMana       = this.ReadInt32();
            data.statManaMax    = this.ReadInt32();
            data.extraAccessory = this.ReadBoolean();
            data.downedDD2EventAnyDifficulty = this.ReadBoolean();
            data.taxMoney       = this.ReadInt32();

            data.hairColor      = this.ReadRGB();
            data.skinColor      = this.ReadRGB();
            data.eyeColor       = this.ReadRGB();
            data.shirtColor     = this.ReadRGB();
            data.underShirtColor = this.ReadRGB();
            data.pantsColor     = this.ReadRGB();
            data.shoeColor      = this.ReadRGB();
            data.armor = [];
            for (let i = 0; i < 20; i++) {
                data.armor[i] = {};
                data.armor[i].id = this.ReadInt32();
                data.armor[i].prefix = this.ReadUInt8();
            }
            data.dye = [];
            for (let i = 0; i < 10; i++) {
                data.dye[i] = {};
                data.dye[i].id = this.ReadInt32();
                data.dye[i].prefix = this.ReadUInt8();
            }
            data.inventory = [];
            for (let i = 0; i < 58; i++) {
                data.inventory[i] = {};
                const id = this.ReadInt32();
                if (id >= 3930) {
                    data.inventory[i].id = 0;
                    this.SkipBytes(5);
                } else {
                    data.inventory[i].id = id;
                    data.inventory[i].stack = this.ReadInt32();
                    data.inventory[i].prefix = this.ReadUInt8();
                    data.inventory[i].favorited = this.ReadBoolean();
                }
            }
            data.miscEquips = [];
            data.miscDyes = [];
            for (let i = 0; i < 5; i++) {
                data.miscEquips[i] = {};
                data.miscDyes[i] = {};

                let id = this.ReadInt32();
                if (id >= 3930) {
                    data.miscEquips[i].id = 0;
                    this.SkipBytes(1);
                } else {
                    data.miscEquips[i].id = id;
                    data.miscEquips[i].prefix = this.ReadUInt8();
                }

                id = this.ReadInt32();
                if (id >= 3930) {
                    data.miscDyes[i].id = 0;
                    this.SkipBytes(1);
                } else {
                    data.miscDyes[i].id = id;
                    data.miscDyes[i].prefix = this.ReadUInt8();
                }
            }

            data.bank = [];
            for (let i = 0; i < 40; i++) {
                data.bank[i] = {};
                data.bank[i].id = this.ReadInt32();
                data.bank[i].stack = this.ReadInt32();
                data.bank[i].prefix = this.ReadUInt8();
            }
            data.bank2 = [];
            for (let i = 0; i < 40; i++) {
                data.bank2[i] = {};
                data.bank2[i].id = this.ReadInt32();
                data.bank2[i].stack = this.ReadInt32();
                data.bank2[i].prefix = this.ReadUInt8();
            }
            data.bank3 = [];
            for (let i = 0; i < 40; i++) {
                data.bank3[i] = {};
                data.bank3[i].id = this.ReadInt32();
                data.bank3[i].stack = this.ReadInt32();
                data.bank3[i].prefix = this.ReadUInt8();
            }

            data.buffType = [];
            data.buffTime = [];
            let num = 22;
            for (let i = 0; i < num; i++) {
                data.buffType[i] = this.ReadInt32();
                data.buffTime[i] = this.ReadInt32();
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
                let num2 = this.ReadInt32();
                if (num2 != -1) {
                    data.spX[i] = num;
                    data.spY[i] = this.ReadInt32();
                    data.spI[i] = this.ReadInt32();
                    data.spN[i] = this.ReadString();
                } else
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
        } catch (e) {
            throw TerrariaPlayerParserError(e, "Problem with parsing the file");
        }

        return data;
    }

    ParseBitsByte(size)
    {
        /*
         * returns an array of bits values, reversed, booleans
         * 
         * example with 96 and 3 as this.ReadUInt8() :
         *  size = 10 bits  bytes [96,3]    0b_0110_0000_0000_0011  BitsByte bool [t,t,f,f,f,f,f,f,f,f]
         */

        let bytes = [];
        for (let i = size; i > 0; i = i - 8)
            bytes.push( this.ReadUInt8() );

        let bitValues = [];
        for (let i = 0, j = 0; i < size; i++, j++) {
            if (j == 8)
                j = 0;
            bitValues[i] = (bytes[~~(i / 8)] & (1 << j)) > 0;
        }

        return bitValues;
    }

    DecryptFile()
    {
        /*
         * source code:
         *
         *  private static byte[] ENCRYPTION_KEY = new UnicodeEncoding().GetBytes("h3y_gUyZ");
         *  using (CryptoStream cryptoStream = new CryptoStream((Stream) memoryStream, rijndaelManaged.CreateDecryptor(Player.ENCRYPTION_KEY, Player.ENCRYPTION_KEY), CryptoStreamMode.Read))
         */

        const key = new Uint8Array([104,0,51,0,121,0,95,0,103,0,85,0,121,0,90,0]);
        const cbc = new aes.ModeOfOperation.cbc(key, key);
        this.buffer = cbc.decrypt( new Uint8Array(this.buffer) );
        this.buffer = new DataView(this.buffer.buffer);
    }
}

window.terrariaPlayerParser = terrariaPlayerParser;