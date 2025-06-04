const AttendanceModel = require('../models/attendance.model');
const StudentModel = require('../models/student.model');
const LessonModel = require('../models/lesson.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');

class AttendanceController extends BaseController {
    getAll = async (req, res, next) => {
        const list = await AttendanceModel.findAll({
            include: [
                {
                    model: StudentModel,
                    as: 'student',
                    attributes: ['id', 'fullname']
                },
                {
                    model: LessonModel,
                    as: 'lesson',
                    attributes: ['id', 'date']
                }
            ]
        });
        res.send(list);
    };
    getGroupLessonAttendanceStatus = async (req, res, next) => {
        try {
            const { group_id, lesson_id } = req.query;

            if (!group_id || !lesson_id) {
                throw new HttpException(400, req.mf('group_id and lesson_id are required'));
            }

            // 1. Get all students in the group
            const students = await StudentModel.findAll({
                where: { group_id },
                attributes: ['id', 'fullname'],
                raw: true
            });

            if (!students.length) {
                throw new HttpException(404, req.mf('no students found for this group'));
            }

            const studentIds = students.map(s => s.id);

            // 2. Fetch attendance records for these students in the given lesson
            const attendances = await AttendanceModel.findAll({
                where: {
                    student_id: studentIds,
                    lesson_id: Number(lesson_id)
                },
                raw: true
            });

            // 3. Create a map for fast lookup
            const attendanceMap = {};
            attendances.forEach(a => {
                attendanceMap[a.student_id] = a.attended;
            });

            // 4. Combine student data with attendance info
            const result = students.map(student => ({
                id: student.id,
                fullname: student.fullname,
                attended: attendanceMap[student.id] || false
            }));

            res.send(result);
        } catch (err) {
            next(err);
        }
    };

    markGroupAttendance = async (req, res, next) => {
        this.checkValidation(req);

        const { lesson_id, group_id, students } = req.body;

        if (!lesson_id || !group_id || !Array.isArray(students)) {
            throw new HttpException(400, req.mf('lesson_id, group_id and students array are required'));
        }

        // Validate students belong to group
        const studentIds = students.map(s => s.student_id);

        const groupStudents = await StudentModel.findAll({
            where: {
                id: studentIds,
                groupId: group_id
            },
            raw: true
        });

        const groupStudentIds = groupStudents.map(s => s.id);

        const filteredStudents = students.filter(s => groupStudentIds.includes(s.student_id));

        const results = await Promise.all(filteredStudents.map(async ({ student_id, attended }) => {
            const [record] = await AttendanceModel.upsert({
                studentId: student_id,
                lessonId: lesson_id,
                attended
            }, {
                conflictFields: ['student_id', 'lesson_id']
            });
            return record;
        }));

        res.status(201).send(results);
    };



    getById = async (req, res, next) => {
        const attendance = await AttendanceModel.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: StudentModel,
                    as: 'student',
                    attributes: ['id', 'fullname']
                },
                {
                    model: LessonModel,
                    as: 'lesson',
                    attributes: ['id', 'date']
                }
            ]
        });

        if (!attendance) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(attendance);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        const { student_id, lesson_id, attended } = req.body;

        const [attendance] = await AttendanceModel.upsert({
            studentId: student_id,
            lessonId: lesson_id,
            attended
        }, {
            conflictFields: ['student_id', 'lesson_id']
        });

        res.status(201).send(attendance);
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        const attendance = await AttendanceModel.findByPk(req.params.id);
        if (!attendance) {
            throw new HttpException(404, req.mf('data not found'));
        }

        const { attended } = req.body;
        attendance.attended = attended;
        await attendance.save();

        res.send(attendance);
    };

    delete = async (req, res, next) => {
        const attendance = await AttendanceModel.findByPk(req.params.id);
        if (!attendance) {
            throw new HttpException(404, req.mf('data not found'));
        }

        await attendance.destroy();
        res.send(req.mf('data has been deleted'));
    };

    markBulkAttendance = async (req, res, next) => {
        this.checkValidation(req);

        const { lesson_id, attendances } = req.body;

        const lesson = await LessonModel.findByPk(lesson_id);
        if (!lesson) {
            throw new HttpException(404, req.mf('lesson not found'));
        }

        const results = await Promise.all(attendances.map(async ({ student_id, attended }) => {
            const [record] = await AttendanceModel.upsert({
                studentId: student_id,
                lessonId: lesson_id,
                attended
            }, {
                conflictFields: ['student_id', 'lesson_id']
            });
            return record;
        }));

        res.status(200).send(results);
    };
}

module.exports = new AttendanceController();