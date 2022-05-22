class Token {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

    copy() {
        return { key: this.key, value: this.value };
    }
}

module.exports = Token;