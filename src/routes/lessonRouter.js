const express = require('express');
const router = express.Router();
const lessoncontroller = require('../controllers/lessonController')

const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(lessoncontroller.getAll));
router.get('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(lessoncontroller.getById));
router.post('/', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(lessoncontroller.create));
router.patch('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(lessoncontroller.update));
router.delete('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(lessoncontroller.delete));
router.get('/by-group/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(lessoncontroller.getByGroup));

module.exports = router;
