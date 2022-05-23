/**
 * Main test runner
 */ 
const fs = require('fs');
const { Parser } = require('../parser');

const parser = new Parser(); 
try {
    const content = fs.readFileSync('./poetry.lock', 'utf-8');
    const x = parser.parse(content);
    const p = JSON.stringify(x);
    console.log('RESULT:', JSON.parse(p));
} catch (error) {
    console.error(error)
}
