const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController')
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(attendanceController.getAll));
router.get('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(attendanceController.getById));
router.post('/', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(attendanceController.create));
router.patch('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(attendanceController.update));
router.delete('/id/:id', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(attendanceController.delete));
router.get('/by-group-attendance', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(attendanceController.getGroupLessonAttendanceStatus))
router.post('/mark-attendance', auth(Role.Admin, Role.Programmer, Role.Manager, Role.Teacher), awaitHandlerFactory(attendanceController.markGroupAttendance))
module.exports = router;
