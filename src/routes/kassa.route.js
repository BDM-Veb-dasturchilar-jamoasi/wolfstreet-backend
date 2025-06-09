const express = require('express');
const router = express.Router();
const KassaController = require('../controllers/kassController'); // Make sure the filename is correct here
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(KassaController.getAll));
router.get('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(KassaController.getById));

router.post('/', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(KassaController.create));
router.patch('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(KassaController.update));

// Optionally, restrict delete to Admin only
router.delete('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(KassaController.delete));

// New route for report POST
router.post('/report', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Bugalter), awaitHandlerFactory(KassaController.getReport));

module.exports = router;
