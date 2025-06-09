const express = require('express');
const router = express.Router();
const paymentcontroller = require('../controllers/paymentController');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

// Existing routes
router.get('/', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(paymentcontroller.getAll));
router.get('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(paymentcontroller.getById));
router.post('/', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(paymentcontroller.create));
router.patch('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(paymentcontroller.update));
router.delete('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(paymentcontroller.delete));

// ✅ New report routes
router.post('/report/by-date', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(paymentcontroller.reportByDateRange));
router.post('/report/by-student', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(paymentcontroller.reportByStudentId));

module.exports = router;
