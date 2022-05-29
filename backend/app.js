const port = process.env.PORT || 5000;

const app = require('./src/config/express');


app.listen(port, () => console.log(`server started on port ${port}`));