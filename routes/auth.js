const express = require('express')
const router = express.Router()
const {createUpdateUser} = require('../controllers/auth')
const {authCheck} = require('../middlewares/auth')


router.post('/create-update-user',authCheck,createUpdateUser)

module.exports = router;