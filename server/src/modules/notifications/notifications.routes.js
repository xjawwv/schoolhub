const express = require('express')
const router = express.Router()
const notificationsController = require('./notifications.controller')
const { authenticate } = require('../../middleware/auth.middleware')

router.use(authenticate)

router.get('/', notificationsController.getMyNotifications)
router.get('/unread-count', notificationsController.getUnreadCount)
router.put('/read-all', notificationsController.markAllAsRead)
router.put('/:id/read', notificationsController.markAsRead)

module.exports = router
