const aes = require("aes-js");

module.exports = class terrariaFileParser
{
    constructor(file)
    {
        const _this = this;

        return (async () => {
            await new Promise((resolve, reject) => {        
                const reader = new FileReader();

                reader.onload = function(e) {
                    _this.buffer = reader.result;
                    _this.offset = 0;
                    resolve();
                }

                reader.onerror = function(e) {
                    reader.abort();
                    throw new Error(reader.error);
                    reject();
                }

                reader.readAsArrayBuffer(file);
            });

            return _this;
        })();
    }

    readUInt8()
    {
        this.offset += 1;
        return this.buffer.getUint8( this.offset - 1, true );
    }

    readInt32()
    {
        this.offset += 4;
        return this.buffer.getInt32( this.offset - 4, true );
    }

    readUInt32()
    {
        this.offset += 4;
        return this.buffer.getUint32( this.offset - 4, true );
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

        return new Uint8Array(data);
    }

    readString(length)
    {
        return aes.utils.utf8.fromBytes( this.readBytes( length ? length : this.readUInt8() ) );
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