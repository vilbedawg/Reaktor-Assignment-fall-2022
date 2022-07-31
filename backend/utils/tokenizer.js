const grammar = require('./grammar');
const Reader = require('./reader');
const character = new grammar();

const Spec = [
	[/\[\[package\]]/i, "PACKAGE"],
	[/\[package\]/i, "PACKAGE"],
	[/\[package\.dependencies\]/i, "PACKAGE.DEPENDENCIES"],
	[/\[package\.extras\]/i, "PACKAGE.EXTRAS"],
	[/\[metadata\]/i, "METADATA"],
	[/\[metadata\.files\]/i, "METADATA.FILES"],
];

class Tokenizer extends Reader {
	constructor(string) {
		super(string);
		this.string = string;
		this.type = "";
		this.tokens = [];
		this.deps = [];
		this.metadata = [];
	}

  // Checks the header for the current tokens
	isMatch(val) {
		if (val == '' && val == null) return null;
		const matched = Spec.find((x) => x[0].exec(val));
		if (matched != null || matched != undefined) {
			this.type = matched[1];
			return matched[1];
		}
		return null;
	}

  // Reads the content untill a newline
	readComment() {
		let readLine = "";
		while (!character.isEol(this.current_char) && !this.isEof()) {
			this.advance();
			readLine += String.fromCharCode(this.current_char);
		}
		return readLine;
	}

  // Reads the content inside untill given condition is met
	readWhile(condition) {
		let readLine = "";
		while (!this.isEof() && condition(this.current_char)) {
			readLine += String.fromCharCode(this.current_char);
			this.advance();
		}
		return readLine;
	}

  // Reads the content inside square brackets [ ]
	readArray() {
		let tokens = [];
		while (!this.isEof() && !character.isArrayClose(this.current_char)) {
			if (character.isAnyWhitespace(this.current_char)) {
				this.advance();
				continue;
			}

			const val = this.readValue((x) => character.isArrayClose(x));
			val != null ? tokens.push(val) : null;
			this.advance();
		}

		return tokens;
	}

  // Reads the content inside curly brackets { }
	readObject() {
		let tokens = [];

		while (!this.isEof() && !character.isObjectClose(this.current_char)) {
			const c = this.current_char;
			if (character.isWhitespace(c)) {
				this.advance();
				continue;
			}
			const key = this.readValue((x) => character.isKeyValSep(x));
			if (key == null) this.SyntaxError('Values must have keypair');

			if (!character.isUnquotedKey(key.charCodeAt(0))) {
				this.SyntaxError(`Key: ${key} must be a key value`);
			}
			this.advance();
			const value = this.readValue((x) => character.isNewline(x));
			if (value == null) this.SyntaxError('Key must have a value');
			tokens.push([key, value]);
			this.advance();
		}

		return Object.fromEntries(tokens);
	}

  // Reads the content of a string quotation
	readString() {
		let escaped = false;
		const val = this.readWhile((c) => {
			if (character.isQuotationMark(c) && !escaped) return false;

			if (character.isEscape(c)) {
				escaped = true;
			} else if (escaped) {
				if (!character.isEscapeChar(c)) {
					this.SyntaxError(`Invalid escape character: ${String.fromCodePoint(c)}`);
				}
				escaped = false;
			} else if (!character.isBasicUnescaped(c)) {
				this.SyntaxError(`Invalid character in string: ${String.fromCodePoint(c)}`);
			}
			return true;
		});
		return val;
	}

  // Reads the key value of an object
	readKey(condition) {
		let readLine = "";
		while (!this.isEof() && !condition(this.current_char) && !character.isClosingBracket(this.peek())) {
			readLine += String.fromCharCode(this.current_char);
			this.advance();
		}
		character.isUnquotedKey(this.current_char)
			? (readLine += String.fromCharCode(this.current_char))
			: null;

		return readLine.replace(',', '');
	}

  // Reads the value of an object
	readValue(condition) {
		while (!this.isEof() && !condition(this.current_char)) {
			const c = this.current_char;
			if (character.isCommentStart(c)) {
				this.SyntaxError("Comments are not allowed inside of values");
			} else if (character.isUnquotedKey(c)) {
				const val = this.readKey((x) => character.isAnyWhitespace(x) || character.isCommaSep(x));
				return val;
			} else if (character.isQuotationMark(c)) {
				this.advance();
				const val = this.readString();
				return val;
			} else if (character.isSingleQuotation(c)) {
				this.advance();
				const val = this.readWhile(
					(x) =>
						!character.isCarriageReturn(x) ||
						!character.isNewline(x) ||
						!character.isSingleQuotation(x)
				);
				return val;
			} else if (character.isArrayOpen(c)) {
				this.advance();
				const val = this.readArray();
				this.advance();
				return val;
			} else if (character.isObjectOpen(c)) {
				this.advance();
				const val = this.readObject();
				return val;
			} else if (character.isEol(c)) {
				return;
			} else {
				this.advance();
			}
		}
		return null;
	}

	pushTokens(key, value) {
		if (this.type == "PACKAGE.DEPENDENCIES") {
			this.deps.push([key, value]);
		} else if (this.type == "PACKAGE.EXTRAS") {
			this.deps.push([key, value]);
		} else if (this.type == "METADATA.FILES") {
			this.metadata.push([key, value]);
		} else {
			this.tokens.push([key, value]);
		}
	}

  // Starts by reading the contents of the file line by line.
  // The function names are pretty self explanatory, 
  // so no further details about them for now.
	tokenize() {
		let key = "";
		while (!this.isEof() && this.current_char != null) {
			let c = this.current_char;
			if (this.isEof()) break;                          

			if (character.isKeyValSep(c)) {
				this.advance();
				const val = this.readValue((x) => character.isNewline(x));
				if (val == null) this.SyntaxError(`${key}: requires a value`);
				this.pushTokens(key, val);
				this.advance();
			} else if (character.isCommentStart(c)) {
				this.readComment();
				this.advance();
			} else if (character.isNonAscii(c)) {
				this.SyntaxError(`Unable to read next token: "${String.fromCodePoint(c)}" not supported.`);
			} else {
				const val = this.readWhile((x) => !character.isAnyWhitespace(x));
				const matched = this.isMatch(val);
				if (matched == "PACKAGE" || matched == "METADATA") 
          break;
				else 
          key = val;

				this.advance();
			}
		}

		return this.createPackage();
	}

  // Create a package by creating a new object from the tokens
	createPackage() {
		try {
			if (this.tokens.length <= 0) return null;

			const PKG = Object.fromEntries(this.tokens);
			const DEPENDENCIES = Object.fromEntries(this.deps);
			this.deps = [];
			this.tokens = [];
			if (this.type == "METADATA.FILES") {
				// const METADATA_FILES = Object.fromEntries(this.metadata);
				// return { ...PKG, METADATA_FILES };
				return null;
			}
			return { ...PKG, DEPENDENCIES };
		} catch (error) {
			throw new Error("Error at package creation:", error);
		}
	}
}

module.exports = {
	Tokenizer,
};
