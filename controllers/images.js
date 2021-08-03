const sharp = require('sharp')
const multer = require('multer')
const path = require('path')

const watermarkFileLocation = './assets/watermark.jpg'

// check that file is jpg
const multerFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg/
    const extname = fileTypes.test(path.extname(file.originalname.toLowerCase()))
    const mimetype = fileTypes.test(file.mimetype)

    if(mimetype && extname) {
        return cb(null, true)
    } else {
        cb(new Error('Wrong file format, only jpg files'))
    }
}

const upload = multer({
    fileFilter: multerFilter
}).single('upload')

//upload image with multer
const uploadImage = (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            res.status(400).send({error: err.message})
        }
        else if(!req.file) {
            res.status(422).send({error:'No file uploaded'})
        }
        else {
            watermarkImage(req, res)
        }
    })
}

// resize watermark to a portion of the shortest side of the image
const resizeWatermarkToFit = async (image, waterMarkSizeMultiplier) => {
        
    try {
        // get the dimensions of the received image
        const imageMetadata = await sharp(image).metadata()
        const watermarkSize = Math.round(Math.min(imageMetadata.width, 
                imageMetadata.height) * waterMarkSizeMultiplier)
        //resize watermark image
        const resizedWatermark = await sharp(watermarkFileLocation)
            .resize(watermarkSize, watermarkSize)
            .toBuffer()
        return resizedWatermark
    } catch(e) {
        return e
    }
}

const watermarkImage = async (req, res) => {
    //the side of the watermark compared to the shorter side of the received image
    const WATERMARK_SIZE_MULTIPLIER = 0.1
    const receivedImage = req.file.buffer

    try {
        //resize watermark
        const resizedWatermark = await resizeWatermarkToFit(
            receivedImage, WATERMARK_SIZE_MULTIPLIER)

        //stamp the received image with the watermark image
        const buffer = await sharp(receivedImage)
            .composite([{input: resizedWatermark, gravity: 'southeast', blend: 'overlay'}])
            .toBuffer()

        //send back the watermarked image
        res.send(buffer)
    } catch(e) {
        res.status(500).send({error:'error when trying to watermark'})
    }  
    
}

module.exports = { uploadImage }