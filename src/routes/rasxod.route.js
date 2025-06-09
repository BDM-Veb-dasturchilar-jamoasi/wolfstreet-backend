const express = require('express');
const router = express.Router();
const rasxodController = require('../controllers/rasxod.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { rasxodSchemas } = require('../middleware/validators/rasxodValidator.middleware');

// 🔓 All authenticated users can view rasxods
router.get('/', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(rasxodController.getAll));
router.get('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(rasxodController.getById));

// 🔒 Only Admins can create/update/delete rasxods
router.post('/', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), joiMiddleware(rasxodSchemas.create), awaitHandlerFactory(rasxodController.create));
router.patch('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), joiMiddleware(rasxodSchemas.update), awaitHandlerFactory(rasxodController.update));
router.delete('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(rasxodController.delete));

router.get('/current-balance', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter, Role.Investor), awaitHandlerFactory(rasxodController.getInvestorCurrentBalance));
router.get('/current-balance-all', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter, Role.Investor), awaitHandlerFactory(rasxodController.getAllInvestorsCurrentBalance));

// 📆 Get all by date range (POST because it uses body)
router.post('/by-date-range', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(rasxodController.getAllByDateRange));

// 📆 Get by investor and date range
router.post('/by-investor-date-range', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(rasxodController.getByInvestorAndDateRange));

module.exports = router;
