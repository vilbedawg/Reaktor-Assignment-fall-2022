const path = require('path');
const fs = require('fs');
const { Parser } = require('../../../utils/parser');

const parserController  = (req, res) => {
  const file = req.files[0].filename;

  if(!file) return res.status(400).send("something went wrong with file upload") 
  
    try {
        const content = fs.readFileSync(path.join('backend/uploads', file), 'utf-8');
        const parser = new Parser();
        const parsed = parser.Program(content); 
        res.status(200).send(parsed);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = parserController;