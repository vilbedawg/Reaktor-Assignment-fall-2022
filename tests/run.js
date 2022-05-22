/**
 * Main test runner
 */
const fs = require('fs');
const { Parser } = require('../parser');
const parser = new Parser(); 
const decoder = new TextDecoder();
try {
    const content = fs.readFileSync('./poetry.lock', 'utf-8');
    const x = parser.parse(content);
    console.log('RESULT:', x);
} catch (error) {
    console.error(error)
}
