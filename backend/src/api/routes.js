const express = require('express');
const router = express.Router();
const parserController = require('./controllers/parser_controller');
const upload = require('./middleware/multer');
const imageUpload = require('./middleware/image_upload');

router.route('/upload')
        .post(upload.array("file"), imageUpload)
        .post(parserController);




module.exports = router;