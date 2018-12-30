const { readFileSync } = require("fs");

module.exports = class terrariaFileParser
{
	constructor(path)
	{
		this.buffer = readFileSync( path , [null, "r+"]);
		this.offset = 0;
	}

	ReadUInt8()
	{
		this.offset += 1;
		return this.buffer[this.offset - 1];
	}

	ReadInt16()
	{
		this.offset += 2;
		return this.buffer.readInt16LE( this.offset - 2 );
	}

	ReadUInt16()
	{
		this.offset += 2;
		return this.buffer.readUInt16LE( this.offset - 2 );
	}

	ReadInt32()
	{
		this.offset += 4;
		return this.buffer.readInt32LE( this.offset - 4 );
	}

	ReadUInt32()
	{
		this.offset += 4;
		return this.buffer.readUInt32LE( this.offset - 4 );
	}

	ReadFloat32()
	{
		this.offset += 4;
		return this.buffer.readFloatLE( this.offset - 4 );
	}

	ReadFloat64()
	{
		this.offset += 8;
		return this.buffer.readDoubleLE( this.offset - 8 );
	}

	ReadBoolean()
	{
		return (!!this.ReadUInt8());
	}

	ReadBytes(count)
	{
		let data = [];
		for (let i = 0; i < count; i++)
			data[i] = this.ReadUInt8();

		return Buffer.from(data);
	}

	ReadString()
	{
		return this.ReadBytes( this.ReadUInt8() ).toString("utf8");
	}

	ReadRGB()
	{
		return [ this.ReadUInt8(), this.ReadUInt8(), this.ReadUInt8()];
	}

	SkipBytes(count)
	{
		this.offset += count;
	}

	JumpTo(offset)
	{
		this.offset = offset;
	}
}