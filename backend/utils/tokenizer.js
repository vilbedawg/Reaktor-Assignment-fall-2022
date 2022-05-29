const grammar = require("./grammar");
const Reader = require("./reader");
const g = new grammar();

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

  isMatch(val) {
    if (val == "" && val == null) return null;
    const matched = Spec.find((x) => x[0].exec(val));
    if (matched != null || matched != undefined) {
      this.type = matched[1];
      return matched[1];
    }
    return null;
  }

  readComment() {
    let str = "";
    while (!g.isEol(this.current_char) && !this.isEof()) {
      this.advance();
      str += String.fromCharCode(this.current_char);
    }
    return str;
  }

  readWhile(condition) {
    let s = "";
    while (!this.isEof() && condition(this.current_char)) {
      s += String.fromCharCode(this.current_char);
      this.advance();
    }
    return s;
  }

  readArray() {
    let tokens = [];
    while (!this.isEof() && !g.isArrayClose(this.current_char)) {
      if (g.isAnyWhitespace(this.current_char)) {
        this.advance();
        continue;
      }

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
      if (key == null) this.SyntaxError(`Values must have keypair`);
      if (!g.isUnquotedKey(key.charCodeAt(0))) {
        this.SyntaxError(`Key: ${key} must be a key value`);
      }
      this.advance();
      const value = this.readValue((x) => g.isNewline(x));
      if (value == null) this.SyntaxError("Key must have a value");
      tokens.push([key, value]);
      this.advance();
    }
    const obj = Object.fromEntries(tokens);
    return obj;
  }

  readString() {
    let escaped = false;
    const val = this.readWhile((c) => {
      if (g.isQuotationMark(c) && !escaped) return false;

      if (g.isEscape(c)) {
        escaped = true;
      } else if (escaped) {
        if (!g.isEscapeChar(c)) {
          this.SyntaxError(
            `Invalid escape character: ${String.fromCodePoint(c)}`
          );
        }
        escaped = false;
      } else if (!g.isBasicUnescaped(c)) {
        this.SyntaxError(
          `Invalid character in string: ${String.fromCodePoint(c)}`
        );
      }
      return true;
    });
    return val;
  }

  readKey(condition) {
    let s = "";
    while (
      !this.isEof() &&
      !condition(this.current_char) &&
      !g.isClosingBracket(this.peek())
    ) {
      s += String.fromCharCode(this.current_char);
      this.advance();
    }
    g.isUnquotedKey(this.current_char)
      ? (s += String.fromCharCode(this.current_char))
      : null;

    return s.replace(",", "");
  }

  readValue(condition) {
    while (!this.isEof() && !condition(this.current_char)) {
      const c = this.current_char;
      if (g.isCommentStart(c)) {
        this.SyntaxError("Comments are not allowed inside of values");
      } else if (g.isUnquotedKey(c)) {
        const val = this.readKey(
          (x) => g.isAnyWhitespace(x) || g.isCommaSep(x)
        );
        return val;
      } else if (g.isQuotationMark(c)) {
        this.advance();
        const val = this.readString();
        return val;
      } else if (g.isSingleQuotation(c)) {
        this.advance();
        const val = this.readWhile(
          (x) =>
            !g.isCarriageReturn(x) || !g.isNewline(x) || !g.isSingleQuotation(x)
        );
        return val;
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

  pushTokens(key, value) {
    // checks the type of current tokens
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

  tokenize() {
    let key = "";

    while (!this.isEof() && this.current_char != null) {
      let c = this.current_char;
      if (this.isEof()) break;

      if (g.isKeyValSep(c)) {
        this.advance();
        const val = this.readValue((x) => g.isNewline(x));
        if (val == null) this.SyntaxError(`${key}: requires a value`);
        this.pushTokens(key, val);
        this.advance();
      } else if (g.isCommentStart(c)) {
        this.readComment();
        this.advance();
      } else if (g.isNonAscii(c)) {
        this.SyntaxError(
          `Unable to read next token: "${String.fromCodePoint(
            c
          )}" not supported.`
        );
      } else {
        const val = this.readWhile((x) => !g.isAnyWhitespace(x));
        const matched = this.isMatch(val);
        if (matched == "PACKAGE" || matched == "METADATA") break;
        else key = val;

        this.advance();
      }
    }

    return this.createPackage();
  }

  createPackage() {
    try {
		if(this.tokens.length <= 0) return null;
			
		const PKG = Object.fromEntries(this.tokens)
		const DEPENDENCIES = Object.fromEntries(this.deps);
		this.deps = [];
		this.tokens = [];
		if (this.type == "METADATA.FILES") {
			const METADATA_FILES = Object.fromEntries(this.metadata);
			return { ...PKG, METADATA_FILES };
		}
	  	return { ...PKG, DEPENDENCIES };

    } catch (error) {
      console.error("Error at package creation:", error);
    }

    return null;
  }
}

module.exports = {
  Tokenizer,
};
