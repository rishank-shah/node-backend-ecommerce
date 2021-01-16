const express = require('express')
const router = express.Router()
const {create,read} = require('../controllers/product')
const {authCheck,adminCheck} = require('../middlewares/auth')

router.get('/products',read)

router.post('/product',authCheck,adminCheck,create)


module.exports = router;