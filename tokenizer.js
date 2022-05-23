const grammar = require('./grammar');
const Token = require('./token');
const g = new grammar();

const Spec = [
    // package title
    [/\[\[package\]]/i, 'PACKAGE'],
    [/\[\[package\.dependencies\]/i, 'PACKAGE.DEPENDENCIES'],
    [/\[\[package\.extras\]/i, 'PACKAGE.EXTRAS']
];


class Tokenizer {
    init(string) {
        this.string = string;
        this.cursor = -1;
        this.current_char = null;
        this.token = new Token();
        this.advance();
    }

    advance() {
        this.cursor++;
        if (!this.hasMoreTokens()) {
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
        if (!Number.isNaN(this.current_char)) {
            let number = '';

            while (!Number.isNaN(Number(this.current_char))) {
                number += this.current_char;
                this.advance();
            }
            return number;
        }

        return;
    }

    readKey() {
        // const val = this.readWhile(g.isUnquotedKey());
        console.log('Inside a key reader')
        return;
    }

    readPunc() {
        const val = String.fromCodePoint(this.current_char);
        console.log('inside a punc reader')
        return val;
    }

    readWhile(condition) {
        let s = '';
        while (!this.isEOF() && !condition(this.current_char)) {
            s += String.fromCharCode(this.current_char);
            this.advance();
        }
        return s;
    }

    isMatch(val) {
        if (val == "") return false;
        const matched = Spec.find((x) => x[0].exec(val));
        if (matched != null) {
            this.token.type = matched[1];
            return true;
        } 
        return false;
    }

    tokenize() {
        let tokens = [];
        let id = '';     // ++++
        let str = '';

        /**
         * TODO; 
         *      - Use ID to identify different states
         *      - Need to tokenize arrays and objects properly
         *      - Check whether a new package has come up and push the tokenized one to parser
         *      - Parse non-string tokens (boolean values)
         *      - 
         *      - After these changes all that is left is
         *      - to parse the tokens in the parser class
         */
        while (!this.isEOF() && this.current_char != null) {

            let c = this.current_char;
            if (this.isEOF()) {
                console.log('EOF');
                return tokens;
            }
            else if (g.isKeyValSep(c)) {
                this.token.key = str;
                this.advance();
            }
            else if (g.isCommentStart(c)) {
                console.log('COMMENT');
                this.readComment();
                this.advance();
            }
            // else if (g.isOpeningSquareBracket(c)) {
            //     console.log('ARRAY');
            //     const val = this.readWhile((x) => g.isCarriageReturn(x) || g.isNewline(x));
            // }
            else if (g.isQuotationMark(c) || g.isSingleQuotation(c) || g.isUnquotedKey(c)) {
                console.log('STRING');
                const val = this.readWhile((x) => g.isCarriageReturn(x) || g.isNewline(x));
                this.token.value = val;
                tokens.push(this.token.copy());
                this.advance();
            }
            else if (g.isNonAscii(c)) {
                throw new SyntaxError(`Unable to read next token: "${String.fromCharCode(c)}" not supported.`)
            }
            else {
                const val = this.readWhile((x) => g.isCarriageReturn(x) || g.isNewline(x) || g.isWhitespace(x));
                if(!this.isMatch(val)) {
                    str = val;
                }
                this.advance();
            }
        }

        return {
            type: this.token.type,
            content: tokens
        };
    }
}

module.exports = {
    Tokenizer,
}