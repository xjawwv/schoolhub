const express = require('express')
const router = express.Router()
const settingsController = require('./settings.controller')
const { authenticate, authorize } = require('../../middleware/auth.middleware')

router.get('/', authenticate, settingsController.get)
router.put('/', authenticate, authorize('ADMIN'), settingsController.upsert)

module.exports = router
