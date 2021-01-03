const express = require('express')
const router = express.Router()
const {createUpdateUser,currentUser} = require('../controllers/auth')
const {authCheck,adminCheck} = require('../middlewares/auth')

router.post('/create-update-user',authCheck,createUpdateUser)

router.post('/current-admin',authCheck,adminCheck,currentUser)

router.post('/current-user',authCheck,currentUser)

module.exports = router;