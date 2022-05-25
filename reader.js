const grammar = require('./grammar');
const token = require('./token');
const g = new grammar();
const encoder = new TextEncoder();

class Reader {
  constructor(string) {
    this.string = string;
    this.current_char = null;
    this.cursor = -1;
    this.line = 1;
    this.col = 1;
    this.token = new token();
  }

  init() {
    // encode the buffer array into ASCII characters
    this.string = encoder.encode(this.string);
    this.advance();
  }

  advance() {
    this.cursor++;
    if (!this.hasMoreTokens()) {
      this.current_char = null;
    } else {
      if (g.isNewline(this.current_char)) {
        this.line++;
        this.col = 1;
      } else {
        this.col++;
      }
      this.current_char = this.string[this.cursor];
    }
  }

  hasMoreTokens() {
    return this.cursor <= this.string.length;
  }

  peek() {
    return this.string[this.cursor + 1];
  }

  isEof() {
    return this.peek() === undefined;
  }

  pos() {
    return { line: this.line, col: this.col };
  }

  SyntaxError(message) {
    throw new Error(`Error at line: ${this.line}, col: ${this.col}. ${message}`);
  }
}

module.exports = Reader;