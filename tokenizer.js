const grammar = require ('./grammar');
const Token = require('./token');
const g = new grammar();
const decoder = new TextDecoder();

const Spec = [
    // package title
    [/package/i, 'PACKAGE'],

];

class Tokenizer {
    init(string) {
        this.string = string;
        this.cursor = -1;
        this.current_char = null;
        this.token = new Token();
        this.tokens = [];
        this.advance();
    }

    advance() {
        this.cursor++;
        if(!this.hasMoreTokens()) {
            this.current_char = null;
        } 
        else {
            this.current_char = this.string[this.cursor];
        }
    }

    hasMoreTokens() {
        return this.cursor < this.string.length;
    }
    
    isEOF() {
        return this.cursor === this.string.length;
    }

    peek(offset = 1) {
        return this.string[this.cursor + offset];
    }

    readNumber() {
        // check if number
        if(!Number.isNaN(this.current_char)) {
            let number = '';

            while(!Number.isNaN(Number(this.current_char))) {
                number += this.current_char;
                this.advance();
            }
            return number;
        }
    }

    readString() {
        let s = '';        
        while(!this.isEOF() && !g.isQuotationMark(this.current_char)) {
            let c = String.fromCharCode(this.current_char);
            s += c;
            this.advance();
        }
        return s;
    }

    readKey() {
        const val = this.readWhile(g.isUnquotedKey());
        return val;
    }

    readPunc() {
        const val = String.fromCodePoint(this.next());
        console.log(val)
        return val;
    }

    readNext() {
        const x = this.readWhile((c) => g.isCarriageReturn(c) || g.isNewline(c) || g.isWhitespace(c));
        if (this.isEOF()) {
            return null;
        }
        let c = this.current_char;
        // if (g.isCommentStart(c)) {
        //     readComment();
        //     return null;
        // }
        // if (g.isDigit(c)) {
        //     return readNumber();
        // }
        if (g.isUnquotedKey(c)) {
            return this.readKey();
        }
        if (g.isKeyValSep(c)) {
            return this.readPunc();
        }
        if (g.isQuotationMark(c)) {
            return this.readString();
        }
        throw new SyntaxError(`Unable to read next token: ${c} not supported.`);
    }
    

    readWhile(condition) {
        let s = '';
        while (!this.isEOF() && !condition(this.current_char)) {
            let char = String.fromCharCode(this.current_char);
            s += char;
            this.advance();
        }
        return s;
    }

    next() {
        return this.current_char || this.readNext();
    }

    tokenize() {
        let tokens = [];
        while(this.hasMoreTokens) {
            const x = this.readNext();
            tokens.push(x);
            this.advance();
        }
        return tokens;
    }
}

module.exports = {
    Tokenizer,
}