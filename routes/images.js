const express = require('express')

const imagesRouter = express.Router()
const imagesController = require('../controllers/images')

imagesRouter.post('/watermark', 
    (req, res) => imagesController.uploadImage(req, res)
)
module.exports = imagesRouter