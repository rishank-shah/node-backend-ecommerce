const express = require('express')
const router = express.Router()
const {create,read,update,remove,list} = require('../controllers/category')
const {authCheck,adminCheck} = require('../middlewares/auth')

router.post('/category',authCheck,adminCheck,create)
router.put('/category/:slug',authCheck,adminCheck,update)
router.delete('/category/:slug',authCheck,adminCheck,remove)
router.get('/category/:slug',authCheck,adminCheck,read)

router.get('/category/list',list)

module.exports = router;