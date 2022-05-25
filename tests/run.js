/**
 * Main test runner
 */ 
const fs = require('fs');
const { Parser } = require('../parser');


try {
    const content = fs.readFileSync('./poetry.lock', 'utf-8');
    const parser = new Parser();
    const x = parser.Program(content); 
} catch (error) {
    console.error(error)
}
    