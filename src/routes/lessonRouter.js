const express = require('express');
const router = express.Router();
const lessoncontroller = require('../controllers/lessonController')

const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/', auth(), awaitHandlerFactory(lessoncontroller.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(lessoncontroller.getById));
router.post('/', auth(), awaitHandlerFactory(lessoncontroller.create));
router.patch('/id/:id', auth(), awaitHandlerFactory(lessoncontroller.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(lessoncontroller.delete));
router.get('/by-group/:id', auth(), awaitHandlerFactory(lessoncontroller.getByGroup));

module.exports = router;
