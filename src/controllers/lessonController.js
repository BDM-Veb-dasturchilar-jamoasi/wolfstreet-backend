const LessonModel = require('../models/lesson.model');
const GroupModel = require('../models/group.model')
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');

class LessonController extends BaseController {
    getAll = async (req, res, next) => {
        const lessons = await LessonModel.findAll({
            include: [{
                model: GroupModel,
                as: 'group'
            }]
        });
        res.send(lessons);
    };

    getById = async (req, res, next) => {
        const lesson = await LessonModel.findByPk(req.params.id, {
            include: [{
                model: GroupModel,
                as: 'group'
            }]
        });

        if (!lesson) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(lesson);
    };

    getByGroup = async (req, res, next) => {
        const lessons = await LessonModel.findAll({
            where: { groupId: req.params.id },
            order: [['date', 'ASC']],

        });
        res.send(lessons);
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        const lesson = await LessonModel.findByPk(req.params.id);
        if (!lesson) {
            throw new HttpException(404, req.mf('data not found'));
        }

        const { date, sequence_number } = req.body;
        lesson.date = date || lesson.date;
        lesson.sequenceNumber = sequence_number || lesson.sequenceNumber;

        await lesson.save();
        res.send(lesson);
    };

    delete = async (req, res, next) => {
        const lesson = await LessonModel.findByPk(req.params.id);
        if (!lesson) {
            throw new HttpException(404, req.mf('data not found'));
        }

        await lesson.destroy();
        res.send(req.mf('data has been deleted'));
    };
}

module.exports = new LessonController();