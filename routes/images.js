const express = require('express')
const sharp = require('sharp')
const multer = require('multer')
const upload = multer()
const imagesRouter = express.Router()
const watermarkFileLocation = './assets/watermark.jpg'

imagesRouter.post('/watermark', upload.single('upload'), async (req, res) => {
    handleImage(req, res)
})

const handleImage = async (req, res) => {
    //the side of the watermark compared to the shorter side of the received image
    const WATERMARK_SIZE_MULTIPLIER = 0.1
    try {
        const receivedImage = req.file.buffer

        // get the dimensions of the received image
        const receivedImageMetadata = await sharp(receivedImage).metadata()
        const watermarkSize = Math.round(Math.min(receivedImageMetadata.width, 
                receivedImageMetadata.height) * WATERMARK_SIZE_MULTIPLIER)
        //resize watermark image
        const resizedWatermark = await sharp(watermarkFileLocation)
            .resize(watermarkSize, watermarkSize)
            .toBuffer()
        //stamp the received image with the watermark image
        const buffer = await sharp(receivedImage)
            .composite([{input: resizedWatermark, gravity: 'southeast', blend: 'overlay'}])
            .toBuffer()

        //send back the watermarked image
        res.send(buffer)
    } catch(e) {
        console.log("error: ", e)
        res.status(204).end()
    }
}

module.exports = imagesRouter