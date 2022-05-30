const allowedOrigins = [
    "http://localhost:5000",
    "http://localhost:3000",
    "https://vilbedawg-parser.herokuapp.com"
];

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if(allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials;