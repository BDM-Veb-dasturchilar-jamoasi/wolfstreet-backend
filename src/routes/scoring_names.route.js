const express = require('express');
const router = express.Router();
const scoringNameController = require('../controllers/scoringName.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');


// 📄 Public or authenticated access for reading
router.get('/', auth(), awaitHandlerFactory(scoringNameController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(scoringNameController.getById));

// 🔒 Only Admins can modify
router.post('/', auth(Role.Admin), awaitHandlerFactory(scoringNameController.create));
router.patch('/id/:id', auth(Role.Admin), awaitHandlerFactory(scoringNameController.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(scoringNameController.delete));

module.exports = router;
