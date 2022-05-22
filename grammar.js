class grammar {

    // Define some basic starting points
    isAlpha = (c) => (c >= 65 && c <= 90) || (c >= 97 && c <= 122); // A-Z / a-z
    isDigit = (c) => c >= 48 && c <= 57; // 0-9

    
    // Whitespace
    isWhitespace = (c) => c === 32 // space

    // Newline
    isNewline = (c) => c === 10; // \n
    isCarriageReturn = (c) => c === 13; // \r

    // Comments
    isCommentStart = (c) => c === 35; // #
    isNonAscii = (c) => (c >= 128 && c < 0);

    // Key-Value pairs
    isUnquotedKey = (c) => this.isAlpha(c) || this.isDigit(c) || [45, 95].indexOf(c) >= 0; // A-Z / a-z / 0-9 / - / _
    isDotSep = (c) => c === 46	; // .
    isKeyValSep = (c) => c === 61; // =

    // Basic String
    isQuotationMark = (c) => c === 34; // "
    isOpeningSquareBracket = (c) => c === 91; 
    isClosingSquareBracket = (c) => c === 93; 
    isBasicUnescaped = (c) =>
        this.isWhitespace(c) || c === 33 || (c >= 35 && c <= 91) || (c >= 93 && c <= 126) || this.isNonAscii(c);
    isEscape = (c) => c === 92; // \
    isEscapeChar = (c) =>
        [
            34, // "
            92, // \
            98, // b
            102, // f
            110, // n
            114, // r
            116, // t
            117, // u
            85 // U
        ].indexOf(c) >= 0;
    isLittleU = (c) => c === 117; // u
    isBigU = (c) => c === 85; // U

    // Integer
    isMinus = (c) => c === 45; // -
    isPlus = (c) => c === 43; // +
    isUnderscore = (c) => c === 95; // _
    isDigit1to9 = (c) => c >= 49 && c <= 57; // 1-9
    isDigit0to7 = (c) => c >= 48 && c <= 55; // 0-7
    isDigit0to1 = (c) => c === 48 || c === 49; // 0-1
    isLeadingZero = (c) => c === 48; // 0
}

module.exports = grammar;