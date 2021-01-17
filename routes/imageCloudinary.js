const express = require('express')
const router = express.Router()
const {authCheck,adminCheck} = require('../middlewares/auth')
const {upload,remove} = require('../controllers/imageCloudinary')

router.post('/upload-images',authCheck,adminCheck,upload)
router.post('/remove-image',authCheck,adminCheck,remove)

module.exports = router