const { Tokenizer } = require('./tokenizer');
const grammar = require('./grammar');
const Reader = require('./reader');
const g = new grammar();

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
			const tokens = this.Tokenizer.tokenize();
			tokens != null ? this.tokens.push(tokens) : null; 
			
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
