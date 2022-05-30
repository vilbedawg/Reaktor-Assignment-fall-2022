const express = require('express');
const routes = require('../api/routes'); 
const cors = require('cors');
const credentials = require('../api/middleware/credentials');
const path = require('path');
const app = express();
app.use(credentials);
app.use(cors());



app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/v1', routes);

if(process.env.NODE_ENV !== "production") {
    app.use(express.static('../../../frontend/build'));
    
    app.get('*', (req, res) => 
    res.sendFile(
        path.resolve(__dirname, '../../../', 'frontend', 'build', 'index.html')
        ))
        
} else {
    app.get('/', (req, res) => res.send('Please set to production'));
}


module.exports = app;