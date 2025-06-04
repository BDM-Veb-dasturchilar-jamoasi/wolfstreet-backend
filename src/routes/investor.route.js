const express = require('express');
const router = express.Router();
const investorController = require('../controllers/investor.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { investorSchemas } = require('../middleware/validators/investorValidator.middleware');

// 🔒 Only Admins can create/update/delete investors, but you can modify this
router.get('/', auth(), awaitHandlerFactory(investorController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(investorController.getById));
router.get('/by-user/:user_id', auth(), awaitHandlerFactory(investorController.getByUserId));
router.post('/', auth(Role.Admin), joiMiddleware(investorSchemas.create), awaitHandlerFactory(investorController.create));
router.patch('/id/:id', auth(Role.Admin), joiMiddleware(investorSchemas.update), awaitHandlerFactory(investorController.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(investorController.delete));

module.exports = router;
