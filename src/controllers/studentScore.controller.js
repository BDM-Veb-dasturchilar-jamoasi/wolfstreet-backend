const StudentScoreModel = require('../models/student_scores.model');
const StudentModel = require('../models/student.model');
const ScoringNameModel = require('../models/scoringnames.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');

class StudentScoreController extends BaseController {
    // Get all student scores with student and scoring name
    getAll = async (req, res, next) => {
        const list = await StudentScoreModel.findAll({
            include: [
                {
                    model: StudentModel,
                    as: 'student',
                    attributes: ['id', 'fullname']
                },
                {
                    model: ScoringNameModel,
                    as: 'scoringName',
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.send(list);
    };

    // Get student score by ID
    getById = async (req, res, next) => {
        const score = await StudentScoreModel.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: StudentModel,
                    as: 'student',
                    attributes: ['id', 'fullname']
                },
                {
                    model: ScoringNameModel,
                    as: 'scoringName',
                    attributes: ['id', 'name']
                }
            ]
        });

        if (!score) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(score);
    };

    // Create new student score
    create = async (req, res, next) => {
        this.checkValidation(req);

        const { studentId, scoringNameId, score } = req.body;

        // Check if student and scoring name exist
        const student = await StudentModel.findByPk(studentId);
        const scoringName = await ScoringNameModel.findByPk(scoringNameId);

        if (!student) throw new HttpException(404, req.mf('student not found'));
        if (!scoringName) throw new HttpException(404, req.mf('scoring name not found'));

        const newScore = await StudentScoreModel.create({
            studentId,
            scoringNameId,
            score
        });

        res.status(201).send(newScore);
    };
    getByStudentId = async (req, res, next) => {
        const { studentId } = req.params;

        // Find the student first
        const student = await StudentModel.findByPk(studentId, {
            attributes: ['id', 'fullname']
        });

        if (!student) {
            throw new HttpException(404, req.mf('student not found'));
        }

        // Find all scores for the student with their scoring names
        const scores = await StudentScoreModel.findAll({
            where: { studentId },
            include: [
                {
                    model: ScoringNameModel,
                    as: 'scoringName',
                    attributes: ['id', 'name']
                }
            ],
            order: [[{ model: ScoringNameModel, as: 'scoringName' }, 'name', 'ASC']]
        });

        // Format the response: student info + array of { id, scoringNameId, scoringName, score }
        const result = {
            student: {
                id: student.id,
                fullname: student.fullname
            },
            scores: scores.map(s => ({
                id: s.id,
                scoringNameId: s.scoringName.id,
                scoringName: s.scoringName.name,
                score: s.score
            }))
        };

        res.send(result);
    };

    // Update student score
    update = async (req, res, next) => {
        this.checkValidation(req);

        const scoreItem = await StudentScoreModel.findOne({ where: { id: req.params.id } });

        if (!scoreItem) {
            throw new HttpException(404, req.mf('data not found'));
        }

        const { studentId, scoringNameId, score } = req.body;

        if (studentId) {
            const student = await StudentModel.findByPk(studentId);
            if (!student) throw new HttpException(404, req.mf('student not found'));
            scoreItem.studentId = studentId;
        }

        if (scoringNameId) {
            const scoringName = await ScoringNameModel.findByPk(scoringNameId);
            if (!scoringName) throw new HttpException(404, req.mf('scoring name not found'));
            scoreItem.scoringNameId = scoringNameId;
        }

        if (score !== undefined) {
            scoreItem.score = score;
        }

        await scoreItem.save();
        res.send(scoreItem);
    };

    // Delete student score
    delete = async (req, res, next) => {
        const scoreItem = await StudentScoreModel.findOne({ where: { id: req.params.id } });

        if (!scoreItem) {
            throw new HttpException(404, req.mf('data not found'));
        }

        await scoreItem.destroy();
        res.send(req.mf('data has been deleted'));
    };
}

module.exports = new StudentScoreController();
