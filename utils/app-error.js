/*
module.exports = function appError(description, originalError)
{
	let newMessage = "terraria-player-parser error\n";
	if (description) newMessage += `description: ${description}\n`;
	newMessage += originalError.message;

	return originalError.message = newMessage + originalError.message;
}
*/

/*
class ExtendedError extends Error {
	constructor(message){
		super(message)
		this.name = this.constructor.name
		this.message = message
		if (typeof Error.captureStackTrace === 'function'){
			Error.captureStackTrace(this, this.constructor)
		} else {
			this.stack = (new Error(message)).stack
		}
	}
}

class RethrownError extends ExtendedError {
	constructor(message, error){
		super(message)
		if (!error) throw new Error('RethrownError requires a message and error')
		this.original = error
		this.new_stack = this.stack
		let message_lines =  (this.message.match(/\n/g)||[]).length + 1
		this.stack = this.stack.split('\n').slice(0, message_lines+1).join('\n') + '\n' + error.stack
	}
}


module.exports = class TerrariaPlayerParserError extends Error
{
	constructor(description, originalError)
	{
		super(description);
		this.message = description;
		if (originalError)
		{
			
		}
	}
}*/