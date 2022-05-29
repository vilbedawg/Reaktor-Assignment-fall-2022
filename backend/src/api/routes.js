const express = require('express');
const router = express.Router();
const parserController = require('./controllers/parser_controller');
const ps = require('../api/controllers/parsecontroller');
const upload = require('./middleware/multer');
const imageUpload = require('./middleware/image_upload');

router.route('/upload')
        .post(upload.array("file"), imageUpload)
        .post(parserController);

router.route('/get').get(ps)



module.exports = router;