const express = require('express')
const router = express.Router()
const {create} = require('../controllers/product')
const {authCheck,adminCheck} = require('../middlewares/auth')

router.post('/product',authCheck,adminCheck,create)


module.exports = router;