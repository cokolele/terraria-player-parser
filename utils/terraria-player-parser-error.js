module.exports = function TerrariaPlayerParserError(error, message) {
	if (error.name == "TerrariaPlayerParserError")
		return error;

	if (message)
		error.message = `${message}\n${error.name}: ${error.message}`;
	error.name = "TerrariaPlayerParserError";
	return error;
};