const express = require('express');
const router = express.Router();
const studentScoreController = require('../controllers/studentScore.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

// 📄 Authenticated users can view
router.get('/', auth(), awaitHandlerFactory(studentScoreController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(studentScoreController.getById));
router.get('/by-student/:studentId', auth(), awaitHandlerFactory(studentScoreController.getByStudentId));

// 🔒 Only Admins or specific roles can modify
router.post('/', auth(Role.Admin), awaitHandlerFactory(studentScoreController.create));
router.patch('/id/:id', auth(Role.Admin), awaitHandlerFactory(studentScoreController.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(studentScoreController.delete));

module.exports = router;
