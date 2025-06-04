const express = require('express');
const router = express.Router();
const StaffController = require('../controllers/staff.controller')
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/', auth(), awaitHandlerFactory(StaffController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(StaffController.getById));

router.post('/', auth(), awaitHandlerFactory(StaffController.create));
router.patch('/id/:id', auth(), awaitHandlerFactory(StaffController.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(StaffController.delete));

module.exports = router;
