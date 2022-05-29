
const imageUpload = async (req, res, next) => {
    
    if(!req.files[0]) {
        res.status(400).send('No file selected')
    }

    next();
};

module.exports = imageUpload