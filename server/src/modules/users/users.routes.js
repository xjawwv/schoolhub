const express = require('express')
const router = express.Router()
const usersController = require('./users.controller')
const { authenticate, authorize } = require('../../middleware/auth.middleware')

router.use(authenticate)
router.use(authorize('ADMIN'))

router.get('/', usersController.getAll)
router.get('/:id', usersController.getById)
router.post('/', usersController.create)
router.put('/:id', usersController.update)
router.delete('/:id', usersController.remove)

module.exports = router
