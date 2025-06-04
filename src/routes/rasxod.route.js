const express = require('express');
const router = express.Router();
const rasxodController = require('../controllers/rasxod.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { rasxodSchemas } = require('../middleware/validators/rasxodValidator.middleware');

// 🔓 All authenticated users can view rasxods
router.get('/', auth(), awaitHandlerFactory(rasxodController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(rasxodController.getById));

// 🔒 Only Admins can create/update/delete rasxods
router.post('/', auth(Role.Admin), joiMiddleware(rasxodSchemas.create), awaitHandlerFactory(rasxodController.create));
router.patch('/id/:id', auth(Role.Admin), joiMiddleware(rasxodSchemas.update), awaitHandlerFactory(rasxodController.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(rasxodController.delete));

router.get('/current-balance', auth(), awaitHandlerFactory(rasxodController.getInvestorCurrentBalance));
router.get('/current-balance-all', auth(Role.Admin), awaitHandlerFactory(rasxodController.getAllInvestorsCurrentBalance));

// 📆 Get all by date range (POST because it uses body)
router.post('/by-date-range', auth(), awaitHandlerFactory(rasxodController.getAllByDateRange));

// 📆 Get by investor and date range
router.post('/by-investor-date-range', auth(), awaitHandlerFactory(rasxodController.getByInvestorAndDateRange));

module.exports = router;
