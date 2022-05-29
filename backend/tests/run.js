/**
 * Main test runner
 */ 
const fs = require('fs');
const { Parser } = require('../utils/parser');


try {
    const content = fs.readFileSync('./backend/uploads/poetry.lock', 'utf-8');
    const parser = new Parser();
    const x = parser.Program(content);
} catch (error) {
    console.error(error)
}
    