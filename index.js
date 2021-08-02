
const router = require('./routes/images.js')
const path = require('path')
const express = require('express')
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 5000

app.use('/images', router)

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})