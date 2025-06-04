const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller')
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/', auth(), awaitHandlerFactory(groupController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(groupController.getById));
router.post('/', auth(), awaitHandlerFactory(groupController.create));
router.patch('/id/:id', auth(), awaitHandlerFactory(groupController.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(groupController.delete));

module.exports = router;
