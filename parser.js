const {Tokenizer} = require ('./tokenizer');
const encoder = new TextEncoder();

class Parser {

    constructor() {
        this.tokenizer = new Tokenizer();
        this.content = '';
    }

    parse(string) {
        // encode the buffer array into ASCII characters
        this.content = encoder.encode(string);
        this.tokenizer.init(this.content);

        /**
         * TODO;
         *  -- Parse the tokens received from the tokenizer
         *  -- Create interfaces for the package models
         *  -- Do some additional error handling, because there aint nun
         */
        return this.tokenizer.tokenize();
    }

    /*
    * Main entry point.
    * Program
    */
   Program() {

   }
}

module.exports = {
    Parser,
}