const grammar = require('./grammar');
const Reader = require('./reader');
const g = new grammar();

const Spec = [
	[/\[\[package\]]/i, 'PACKAGE'],
	[/\[package\]/i, 'PACKAGE'],
	[/\[package\.dependencies\]/i, 'PACKAGE.DEPENDENCIES'],
	[/\[package\.extras\]/i, 'PACKAGE.EXTRAS'],
	[/\[metadata\]/i, 'METADATA'],
	[/\[metadata\.files\]/i, 'METADATA.FILES'],
];

class Tokenizer extends Reader {

	constructor(string) {
		super(string);
		this.string = string;
	}
	readComment() {
		let str = '';
		while (!g.isEol(this.current_char) && !this.isEof()) {
			this.advance();
			str += String.fromCharCode(this.current_char);
		}
		return str;
	}

	readKey(condition) {
		let s = '';
		while (!this.isEof() && !condition(this.current_char) && !g.isClosingBracket(this.peek())) {
			s += String.fromCharCode(this.current_char);
			this.advance();
		}
		this.current_char != null ? (s += String.fromCharCode(this.current_char)) : null;
		return s;
	}

	readWhile(condition) {
		let s = '';
		while (!this.isEof() && !condition(this.current_char)) {
			s += String.fromCharCode(this.current_char);
			this.advance();
		}
		return s;
	}

	isMatch(val) {
		if (val == '' && val == null) return null;
		const matched = Spec.find((x) => x[0].exec(val));
		if (matched != null || undefined) {
			this.token.type = matched[1];
			return matched[1];
		}
		return null;
	}

	readArray() {
		let tokens = [];
		while (!this.isEof() && !g.isArrayClose(this.current_char)) {
			const val = this.readValue((x) => g.isArrayClose(x));
			val != null ? tokens.push(val) : null;
			this.advance();
		}
		return tokens;
	}

	readObject() {
		let tokens = [];

		while (!this.isEof() && !g.isObjectClose(this.current_char)) {
			const c = this.current_char;
			if (g.isWhitespace(c)) {
				this.advance();
				continue;
			}
			const key = this.readValue((x) => g.isKeyValSep(x));

			if (key == null) this.SyntaxError('Values must have keypair');
			if (g.isUnquotedKey(key[0])) this.SyntaxError(`${key} Key value must be a value of key`);

			const value = this.readValue((x) => g.isNewline(x));
			if(value == null) this.SyntaxError('Key must have a value');
			tokens.push({ key, value });
			this.advance();
		}
		return tokens;
	}

	readValue(condition) {
		while (!this.isEof() && !condition(this.current_char)) {
			const c = this.current_char;
			if (g.isCommentStart(c)) {
				this.SyntaxError('Comments are not allowed inside of values');
			} else if (g.isUnquotedKey(c)) {
				const val = this.readKey((x) => g.isAnyWhitespace(x) || g.isCommaSep(x));
				return val;
			} else if (g.isQuotationMark(c)) {
				this.advance();
				const val = this.readWhile(
					(x) => g.isCarriageReturn(x) || g.isNewline(x) || g.isQuotationMark(x)
				);
				return `"${val}"`;
			} else if (g.isSingleQuotation(c)) {
				this.advance();
				const val = this.readWhile(
					(x) => g.isCarriageReturn(x) || g.isNewline(x) || g.isSingleQuotation(x)
				);
				return `'${val}'`;
			} else if (g.isArrayOpen(c)) {
				this.advance();
				const val = this.readArray();
				this.advance();
				return val;
			} else if (g.isObjectOpen(c)) {
				this.advance();
				const val = this.readObject();
				return val;
			} else if (g.isEol(c)) {
				return;
			} else {
				this.advance();
			}
		}
		return null;
	}

	tokenize() {
		let tokens = [];
		let comments = [];
		let str = '';
		let tid = '';
		while (!this.isEof() && this.current_char != null) {
			let c = this.current_char;
			if (this.isEof()) {
				console.log('EOF');
				return;
			} else if (g.isKeyValSep(c)) {
				this.advance();
				const val = this.readValue((x) => g.isNewline(x));
				if (val == null) this.SyntaxError(`${str}: requires a value`);
				this.token.key = str;
				this.token.value = val;
				tokens.push(this.token.copy());
				this.advance();
			} else if (g.isCommentStart(c)) {
				const val = this.readComment();
				comments.push(val);
			} else if (g.isNonAscii(c)) {
				this.SyntaxError(
					`Unable to read next token: "${String.fromCharCode(c)}" not supported.`
				);
			} else {
				const val = this.readWhile((x) => g.isAnyWhitespace(x));
				if (this.isMatch(val) && !g.isAnyWhitespace(c)) {
					if (val == '[package]' && tid != '') break;
					tid = val;
				} else str = val;

				this.advance();
			}
		}

		return {
			tokens,
			comments,
		};
	}

}

module.exports = {
	Tokenizer,
};
