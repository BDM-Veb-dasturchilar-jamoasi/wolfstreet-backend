const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const upload = require('../middleware/upload'); // <-- Multer middleware for image upload

// Get all students
router.get('/', auth(), awaitHandlerFactory(studentController.getAll));

// Get student by ID
router.get('/id/:id', auth(), awaitHandlerFactory(studentController.getOne));

// Get students by group ID
router.get('/by-group/:group_id', auth(), awaitHandlerFactory(studentController.getByGroupId));

// Create student (with image upload)
router.post(
    '/',
    auth(),
    upload.single('img'), // <-- Add this
    awaitHandlerFactory(studentController.create)
);

// Update student (with image upload)
router.patch(
    '/id/:id',
    auth(),
    upload.single('img'), // <-- Add this
    awaitHandlerFactory(studentController.update)
);

// Delete student (admin only)
router.delete(
    '/id/:id',
    auth(Role.Admin),
    awaitHandlerFactory(studentController.delete)
);

module.exports = router;
