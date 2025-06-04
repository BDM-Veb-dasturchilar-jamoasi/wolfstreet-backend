const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController')
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/', auth(), awaitHandlerFactory(attendanceController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(attendanceController.getById));
router.post('/', auth(), awaitHandlerFactory(attendanceController.create));
router.patch('/id/:id', auth(), awaitHandlerFactory(attendanceController.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(attendanceController.delete));
router.get('/by-group-attendance', auth(), awaitHandlerFactory(attendanceController.getGroupLessonAttendanceStatus))
router.post('/mark-attendance', auth(), awaitHandlerFactory(attendanceController.markGroupAttendance))
module.exports = router;
