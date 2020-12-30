const express = require('express')
const router = express.Router()
const {createUpdateUser} = require('../controllers/auth')

router.get('/create-update-user',createUpdateUser)

module.exports = router;