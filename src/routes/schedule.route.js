const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller')
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/', auth(), awaitHandlerFactory(scheduleController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(scheduleController.getById));

router.post('/', auth(), awaitHandlerFactory(scheduleController.create));
router.patch('/id/:id', auth(), awaitHandlerFactory(scheduleController.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(scheduleController.delete));

module.exports = router;
