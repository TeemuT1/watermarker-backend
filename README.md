# Watermarker
A node backend that receives a jpg image, watermarks it, and returns the watermarked image.

## Set up
1. Clone the repository
2. run `'npm install'` in the root directory
3. run `'npm run serve'`

By default the server will listen to port 5000
The image that will be used as the watermark is in the assets folder.

## Usage
Send a jpg image with a POST request to the endpoint `/images/watermark`.
The image should be sent as multipart form-data with the key 'upload'.

## Demo
The app is deployed on Heroku at https://pure-dusk-36422.herokuapp.com/