const path = require('path');
const fs = require('fs');
const { Parser } = require('../../../utils/parser');

const parserController  = (req, res) => {
  
    try {
        const content = fs.readFileSync(path.join('backend/uploads', 'poetry.lock'), 'utf-8');
        const parser = new Parser();
        const parsed = parser.Program(content); 
        res.status(200).send(parsed);
    } catch (error) {
        console.error(error)
        res.status(500).send(error.message);
    }
}

module.exports = parserController;