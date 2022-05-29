class grammar {
	// Define some basic starting points
	isAlpha = (c) => (c >= 65 && c <= 90) || (c >= 97 && c <= 122); // A-Z / a-z
	isDigit = (c) => c >= 48 && c <= 57; // 0-9

	// Whitespace
	isWhitespace = (c) => c === 32; // space
	isAnyWhitespace = (c) => [32, 10, 13].indexOf(c) >= 0;

	// Newline
	isNewline = (c) => c === 10; // \n
	isCarriageReturn = (c) => c === 13; // \r

	// Comments
	isCommentStart = (c) => c === 35; // #
	isNonAscii = (c) => c >= 128 && c < 0;
	isNonEol = (c) => c === 9 || (c >= 32 && c <= 127) || this.isNonAscii(c);
	isEol = (c) => c === this.isNewline(c) || this.isCarriageReturn(c) || !this.isNonEol(c);

	// Key-Value pairs
	isUnquotedKey = (c) => this.isAlpha(c) || this.isDigit(c) || [45, 95].indexOf(c) >= 0; // A-Z / a-z / 0-9 / - / _
	isKeyValSep = (c) => c === 61; // =

	// Basic String
	isQuotationMark = (c) => c === 34; // "
	isSingleQuotation = (c) => c === 39; // '
	isBasicUnescaped = (c) =>
		this.isWhitespace(c) || c === 33 || (c >= 35 && c <= 91) || (c >= 93 && c <= 126) || this.isNonAscii(c);
	isEscape = (c) => c === 92; // \
	isEscapeChar = (c) =>
		[
			34, // "
			92, // \
			98, // b
			102, // f
			110, // n
			114, // r
			116, // t
			117, // u
			85 // U
		].indexOf(c) >= 0;

	// Array values
	isArrayOpen = (c) => c === 91; // [
	isArrayClose = (c) => c === 93; // ]
	isCommaSep = (c) => c === 44; // ,

	// Brackets
	isObjectOpen = (c) => c === 123;
	isObjectClose = (c) => c === 125;

	isClosingBracket = (c) => this.isObjectClose(c) || this.isArrayClose(c);
}

module.exports = grammar;
