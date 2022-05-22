const {Tokenizer} = require ('./tokenizer');
const grammar = require ('./grammar');
const {Package, Metadata} = require('./token');
const decoder = new TextDecoder();
const encoder = new TextEncoder();
const g = new grammar();

class Parser {

    constructor() {
        this.tokenizer = new Tokenizer();
    }


    parse(string) {
        // encode the buffer array into ASCII characters
        this.content = encoder.encode(string);
        this.tokenizer.init(this.content);
        console.log(JSON.stringify(string))
        // Prime the tokenizer to obtain the first
        // token which is our lookahead. The lookahead is
        // used for predictive parsing.

        // // // this.lookahead = this.tokenizer.getNextToken();
        // Parse recursively starting from the main
        // entry point, which is the Program
        return this.main();
    }

    /*
    * Main entry point.
    * Program
    */
    main() {
        return this.tokenizer.tokenize();
    }

    Literal() {
        switch(this.lookahead.type) {
            case 'PACKAGE':
                return this.packageLiteral();
            case 'CONTENT':
                return this.contentLiteral();
        }

        throw new SyntaxError(`Literal: unexpected literal production`);
    }

    packageLiteral() {
        const token = this.eat('PACKAGE');
        return token.value;
    }

    contentLiteral() {
        const token = this.eat('CONTENT');
        console.log('CONTENT LITERAL')
        return 2;
    }

    eat(tokenType) {
        const token = this.lookahead;

        if (token == null) {
            throw new SyntaxError(
              `Unexpected end of input, expected: ${tokenType}`  
            );
        }

        if(token.type !== tokenType) {
            throw new SyntaxError(
                `Unexpected token: ${token.value}, expected: ${tokenType}`  
            );
        }
        // Advance to next token.
        this.lookahead = this.tokenizer.getNextToken()
        return token;
    }
}

module.exports = {
    Parser,
}