const { Tokenizer } = require('./tokenizer');
const encoder = new TextEncoder();
const grammar = require('./grammar');
const g = new grammar();
class Parser {
	constructor() {
		this.tokenizer = new Tokenizer();
		this.tokens = [];
	}

	/*
	 * Main entry point.
	 * Program
	 */
	Program(string) {
		// encode the buffer array into ASCII characters
		const encoded = encoder.encode(string);
		this.tokenizer.init(encoded);

		while (!this.tokenizer.isEOF()) {
			const tokens = this.tokenizer.tokenize();
			this.tokens.push(tokens);
		}

		const parsed = this.parse();
		/**
		 * TODO;
		 *  -- Parse the tokens received from the tokenizer
		 *  -- Create interfaces for the package models
		 *  -- Do some additional error handling, because there aint nun
		 */

		// try to parse into json at the end
		return parsed;
	}

	parse() {
		const x = this.tokens
			.map((x) => x.tokens)
			.forEach((pgk) => {
				console.log(pgk);
				for (let item in pgk) {
					const { type, key, value } = pgk[item];

					console.log(value);
				}
			});
		return x;
	}
}

module.exports = {
	Parser,
};
