const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller')
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(groupController.getAll));
router.get('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(groupController.getById));
router.post('/', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(groupController.create));
router.patch('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(groupController.update));
router.delete('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(groupController.delete));
router.get('/by-teacher/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(groupController.getByTeacherId));

module.exports = router;
