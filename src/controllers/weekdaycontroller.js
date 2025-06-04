const WeekdayModel = require('../models/weekday.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');

class WeekdayController extends BaseController {
    getAll = async (req, res, next) => {
        const weekdays = await WeekdayModel.findAll();
        res.send(weekdays);
    };

    getById = async (req, res, next) => {
        const weekday = await WeekdayModel.findByPk(req.params.id);
        if (!weekday) {
            throw new HttpException(404, req.mf('data not found'));
        }
        res.send(weekday);
    };

    initializeWeekdays = async (req, res, next) => {
        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        await Promise.all(weekdays.map(async (day, index) => {
            await WeekdayModel.findOrCreate({
                where: { id: index + 1 },
                defaults: { name: day }
            });
        }));

        res.send(req.mf('Weekdays initialized successfully'));
    };
}

module.exports = new WeekdayController();