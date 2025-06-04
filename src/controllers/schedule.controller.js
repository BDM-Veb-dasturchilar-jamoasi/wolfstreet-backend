const ScheduleModel = require('../models/schedule.model');
const ScheduleWeekdayModel = require('../models/scheduleweekday.model')
const WeekdayModel = require('../models/weekday.model')
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');

class ScheduleController extends BaseController {
    getAll = async (req, res, next) => {
        const schedules = await ScheduleModel.findAll({
            include: [{
                model: WeekdayModel,
                as: 'weekdays', // <-- important!
                through: ScheduleWeekdayModel
            }]
        });
        res.send(schedules);
    };

    getById = async (req, res, next) => {
        const schedule = await ScheduleModel.findByPk(req.params.id, {
            include: [{
                model: WeekdayModel,
                as: 'weekdays',
                through: ScheduleWeekdayModel
            }]
        });

        if (!schedule) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(schedule);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        const { name, number_of_lessons, weekdays } = req.body;

        const schedule = await ScheduleModel.create({
            name,
            number_of_lessons: number_of_lessons
        });

        await Promise.all(weekdays.map(weekdayId =>
            ScheduleWeekdayModel.create({
                scheduleId: schedule.id,
                weekdayId: weekdayId
            })
        ));

        res.status(201).send(schedule);
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        const schedule = await ScheduleModel.findByPk(req.params.id);
        if (!schedule) {
            throw new HttpException(404, req.mf('data not found'));
        }

        const { name, number_of_lessons, weekdays } = req.body;

        schedule.name = name || schedule.name;
        schedule.number_of_lessons = number_of_lessons || schedule.number_of_lessons;
        await schedule.save();

        if (weekdays) {
            await ScheduleWeekdayModel.destroy({ where: { scheduleId: schedule.id } });
            await Promise.all(weekdays.map(weekdayId =>
                ScheduleWeekdayModel.create({
                    scheduleId: schedule.id,
                    weekdayId: weekdayId
                })
            ));
        }

        res.send(schedule);
    };

    delete = async (req, res, next) => {
        const schedule = await ScheduleModel.findByPk(req.params.id);
        if (!schedule) {
            throw new HttpException(404, req.mf('data not found'));
        }

        await schedule.destroy();
        res.send(req.mf('data has been deleted'));
    };
}

module.exports = new ScheduleController();