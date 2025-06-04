const express = require('express');
const router = express.Router();
const releaseRequestController = require('../controllers/request.controller');
const auth = require('../middleware/auth.middleware');
// const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');


router.post('/', auth(), awaitHandlerFactory(releaseRequestController.create));
router.get('/', auth(), awaitHandlerFactory(releaseRequestController.getAll));
router.get('/by-investor/:id', auth(), awaitHandlerFactory(releaseRequestController.getByInvestor));
router.patch('/approve/:id', auth(), awaitHandlerFactory(releaseRequestController.approve));
router.patch('/reject/:id', auth(), awaitHandlerFactory(releaseRequestController.reject));
router.patch('/delay/:id', auth(), awaitHandlerFactory(releaseRequestController.delay));
router.get('/counts', auth(), awaitHandlerFactory(releaseRequestController.getPendingRequestCounts));
module.exports = router;
