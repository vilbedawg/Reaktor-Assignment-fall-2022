const express = require('express');
const routes = require('../api/routes'); 
const cors = require('cors');
const credentials = require('../api/middleware/credentials');

const app = express();
app.use(credentials);
app.use(cors());



app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/v1', routes);

module.exports = app;