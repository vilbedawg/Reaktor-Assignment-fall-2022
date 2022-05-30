const express = require('express');
const routes = require('./src/api/routes'); 
const cors = require('cors');
const credentials = require('./src/api/middleware/credentials');
const path = require('path');
const app = express();

const port = process.env.PORT || 5000;
app.use(credentials);
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/v1', routes);

if(process.env.NODE_ENV === "production") {
    const root = require('path').join(__dirname, '../', 'frontend', 'build')
    app.use(express.static(root));
    app.get("*", (req, res) => {
        res.sendFile('index.html', { root });
    })
        
} else {

    app.get('/', (req, res) => res.send('Please set to production'));
}

app.listen(port, () => console.log(`server started on port ${port}`));