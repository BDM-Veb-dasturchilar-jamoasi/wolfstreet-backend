const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/task.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

// Routes
router.get('/', auth(), awaitHandlerFactory(TaskController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(TaskController.getById));

router.post('/', auth(), awaitHandlerFactory(TaskController.create));
router.patch('/id/:id', auth(), awaitHandlerFactory(TaskController.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(TaskController.delete));

module.exports = router;
