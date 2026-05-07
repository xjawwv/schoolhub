const express = require('express')
const router = express.Router()
const announcementsController = require('./announcements.controller')
const { authenticate, authorize } = require('../../middleware/auth.middleware')

router.use(authenticate)

router.get('/', announcementsController.getAll)
router.get('/:id', announcementsController.getById)
router.post('/', authorize('ADMIN'), announcementsController.create)
router.put('/:id', authorize('ADMIN'), announcementsController.update)
router.delete('/:id', authorize('ADMIN'), announcementsController.remove)

module.exports = router
