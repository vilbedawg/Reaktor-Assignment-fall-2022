const { Tokenizer } = require('./tokenizer');

class Parser {
	constructor() {
		this.tokens = [];
	}

	/*
	 * Main entry point.
	 * Program
	 */
	Program(content) {
		this.Tokenizer = new Tokenizer(content);
		this.Tokenizer.init();

		// Tokenize untill End of file.
		while (!this.Tokenizer.isEof()) {
			const tokens = this.Tokenizer.tokenize();
			tokens != null ? this.tokens.push(tokens) : null;
		}

		// Try to parse the tokenized packages and 
		// return them only if the JSON parsing is successful.
		if (this.validJSON()) return this.tokens;

		// Otherwise we dont return anything, so we dont try display 
		// invalid data on the frontend.
		return null;
	}

	validJSON() {
		try {
			JSON.parse(JSON.stringify(this.tokens));
			return true;
		} catch (error) {
			throw new Error("Parsing failed.")
		}
	}
}

module.exports = {
	Parser,
};
