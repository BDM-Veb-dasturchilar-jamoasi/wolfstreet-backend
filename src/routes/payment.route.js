const express = require('express');
const router = express.Router();
const paymentcontroller = require('../controllers/paymentController');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

// Existing routes
router.get('/', auth(), awaitHandlerFactory(paymentcontroller.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(paymentcontroller.getById));
router.post('/', auth(), awaitHandlerFactory(paymentcontroller.create));
router.patch('/id/:id', auth(), awaitHandlerFactory(paymentcontroller.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(paymentcontroller.delete));

// ✅ New report routes
router.post('/report/by-date', auth(), awaitHandlerFactory(paymentcontroller.reportByDateRange));
router.post('/report/by-student', auth(), awaitHandlerFactory(paymentcontroller.reportByStudentId));

module.exports = router;
