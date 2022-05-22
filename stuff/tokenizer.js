
/**
 * Tokenizer class
 * 
 * pulls token from a stream
 */

class Tokenizer {
 /**
 * Init the string
 */
    init(string) {
        this._string = string;
        this._cursor = 0;
    }

    /**
     * Checks whether the tokenizer
     * has reached end of the file (EOF).
     */
    isEOF() {
        return this._cursor === this._string.length;
    }

    /** 
     * Whether we still have more tokens
     */
    hasMoreTokens() {
        return this._cursor < this._string.length;
    }

    /**
     * Obtains the next token
     */
    getNextToken() {
        
        if(!this.hasMoreTokens()) {
            return null;
        }

        const string = this._string.slice(this._cursor);
        if(!Number.isNaN(string[0])) {
            let number = '';

            while(!Number.isNaN(Number(string[this._cursor]))) {
                number += string[this._cursor++];
            }
            return {
                type: 'NUMBER',
                value: number,
            };
        }

        // String: 
        if(string[0] === '"') {
            let s = '';
            do {
                console.log(s);
                s += string[this._cursor++];
            } while (string[this._cursor] !== '"' && !this.isEof());
            s += this._cursor++;
            return {
                type: 'STRING',
                value: s,
            };
        }
        return null;
    }
}

module.exports = {
    Tokenizer,
};