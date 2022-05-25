/**
 * Main test runner
 */ 
const fs = require('fs');
const { Parser } = require('../parser');

const parser = new Parser(); 
try {
    const content = fs.readFileSync('./poetry.lock', 'utf-8');
    const x = parser.Program(content);
    console.log(x)
} catch (error) {
    console.error(error)
}
    