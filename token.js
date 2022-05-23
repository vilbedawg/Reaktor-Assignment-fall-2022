module.exports = Token = class Token {
    
    constructor(key, value, type) {
        this.type = type;
        this.key = key;
        this.value = value;
    }

    copy() {
        return { key: this.key, value: this.value };
    }
}

