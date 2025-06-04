const express = require('express');
const router = express.Router();
const prixodController = require('../controllers/prixodController');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { prixodSchemas } = require('../middleware/validators/prixodValidator.middleware');

// 🔓 All authenticated users can view prixods
router.get('/', auth(), awaitHandlerFactory(prixodController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(prixodController.getById));

// 🔒 Only Admins can create/update/delete prixods
router.post('/', auth(Role.Admin), joiMiddleware(prixodSchemas.create), awaitHandlerFactory(prixodController.create));
router.patch('/id/:id', auth(Role.Admin), joiMiddleware(prixodSchemas.update), awaitHandlerFactory(prixodController.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(prixodController.delete));

// 🔎 Reports (POST for payload-based filtering)
router.post('/report', auth(), awaitHandlerFactory(prixodController.getReport));
router.post('/investor-report', auth(), awaitHandlerFactory(prixodController.getInvestorReport));

module.exports = router;
