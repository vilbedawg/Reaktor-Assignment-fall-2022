const { Tokenizer } = require('./tokenizer');

class Parser {

	constructor() {
		this.tokens = [];
	}

	/*
	 * Main entry point.
	 * Program
	 */
	Program(string) {
		this.Tokenizer = new Tokenizer(string);
		this.Tokenizer.init();

		while (!this.Tokenizer.isEof()) {
			// not jumping out correctly
			const tokens = this.Tokenizer.tokenize();
			tokens != null ? this.tokens.push(tokens) : null;
		}

		const valid = this.validJSON();
		if (valid) return this.tokens;

		return null;
	}

	validJSON() {
		try {
			const s = JSON.stringify(this.tokens);
			const p = JSON.parse(s);
			return true;
		} catch (error) {
			return false;
		}
	}
}

module.exports = {
	Parser,
};
