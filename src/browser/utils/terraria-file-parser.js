class terrariaFileParser
{
	constructor(file)
	{
		const reader = new FileReader();
		const _this = this;

		reader.onload = function(e) {
			_this.offset = 0;
			_this.buffer = new DataView(reader.result);
			console.log("done")
		}

		reader.onerror = function(e) {
			reader.abort();
			throw new Error(reader.error);
		}

		reader.readAsArrayBuffer(file);
	}

	ReadUInt8()
	{
		this.offset += 1;
		return this.buffer.getUint8( this.offset - 1, true );
	}

	ReadInt16()
	{
		this.offset += 2;
		return this.buffer.getInt16( this.offset - 2, true );
	}

	ReadUInt16()
	{
		this.offset += 2;
		return this.buffer.getUint16( this.offset - 2, true );
	}

	ReadInt32()
	{
		this.offset += 4;
		return this.buffer.getInt32( this.offset - 4, true );
	}

	ReadUInt32()
	{
		this.offset += 4;
		return this.buffer.getUint32( this.offset - 4, true );
	}

	ReadFloat32()
	{
		this.offset += 4;
		return this.buffer.getFloat32( this.offset - 4, true );
	}

	ReadFloat64()
	{
		this.offset += 8;
		return this.buffer.getFloat64( this.offset - 8, true );
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

		return new Uint8Array(data);
	}

	ReadString()
	{
		return String.fromCharCode.apply(null, this.ReadBytes( this.ReadUInt8() ));
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

export default terrariaFileParser;