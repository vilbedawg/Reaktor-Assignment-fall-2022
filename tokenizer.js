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
        this.advance();
        this.isKeySet = false;
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

    readNext() {
        while(!this.isEOF() && !g.isCarriageReturn(this.current_char)) {
            
        }
    }
    

    readWhile(closingTag) {
        let string = '';
        
            while (!this.isEOF() && this.current_char !== closingTag) {
                let c = String.fromCharCode(this.current_char);
                if(this.current_char === closingTag) {
                    return string;
                }
    
                if(g.isUnquotedKey(this.current_char) 
                    || g.isDotSep(this.current_char)) {
                    string += c;
                }
    
                this.advance();
            }
            return string;
        }
    // }

    readString() {
        let s = '';        
        while(!this.isEOF() && !g.isQuotationMark(this.current_char)) {
            let c = String.fromCharCode(this.current_char);
            s += c;
            this.advance();
        }
        return s;
    }

    tokenize() {
        let tokens = [];
        let s = '';

        while (this.current_char !== null && !this.isEOF()) {
            const next = this.peek(1);
            let c = String.fromCharCode(this.current_char);
           
            if(g.isWhitespace(this.current_char)) {
                this.advance();
            }

            else if(g.isUnquotedKey(this.current_char)) {
                s += c;
                this.advance();
            }  

            else if(next === undefined) {
                tokens.push(this.token.copy())
                this.advance();
            }
  
            else if(g.isOpeningSquareBracket(this.current_char)){
                const value = this.readWhile(93); // closing square bracket
                this.token.key = value;
                s = '';
                // if(value.match(/package/i) !== null) {
                //     this.token.key = value;
                //     tokens.push(this.token.copy())
                // } 
                this.advance();
            }  

            // prevent from copying the previous line
            else if(g.isNewline(this.current_char) && !g.isCarriageReturn(next)) {
                const token = this.token.copy();
                tokens.push(token);
                this.advance();
            }

            else if(g.isKeyValSep(this.current_char)){
                this.token.key = s;
                s = '';
                this.advance();
            }

            else if(g.isQuotationMark(this.current_char)) {
                this.advance();
                const value = this.readString(); // "
                this.token.value = value;
            }

            else {
                this.advance();
            }          
        }

        return tokens;
    }

    // const x = this.match(/\[[a-zA-Z]+\]/, value);
    // match(regexp, string) {
    //     const matched = regexp.exec(string);
    //     if(matched == null) {
    //         return null;
    //     } 
    //     console.log(matched)
    //     return matched[0];
    // }


    peek(offset = 0) {
        return this.string[this.cursor + offset];
    }



}

module.exports = {
    Tokenizer,
}