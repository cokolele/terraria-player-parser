const { readFileSync } = require("fs");

module.exports = class terrariaFileParser
{
    constructor(path)
    {
        this.buffer = readFileSync( path , [null, "r+"]);
        this.offset = 0;
    }

    readUInt8()
    {
        this.offset += 1;
        return this.buffer[this.offset - 1];
    }

    readInt32()
    {
        this.offset += 4;
        return this.buffer.readInt32LE( this.offset - 4 );
    }

    readUInt32()
    {
        this.offset += 4;
        return this.buffer.readUInt32LE( this.offset - 4 );
    }

    readBoolean()
    {
        return (!!this.readUInt8());
    }

    readBytes(count)
    {
        let data = [];
        for (let i = 0; i < count; i++)
            data[i] = this.readUInt8();

        return Buffer.from(data);
    }

    readString(length)
    {
        return this.readBytes( length ? length : this.readUInt8() ).toString("utf8");
    }

    readRGB()
    {
        return [ this.readUInt8(), this.readUInt8(), this.readUInt8()];
    }

    skipBytes(count)
    {
        this.offset += count;
    }
}