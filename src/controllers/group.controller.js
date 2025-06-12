const GroupModel = require('../models/group.model');
const HttpException = require('../utils/HttpException.utils');
const WeekdayModel = require('../models/weekday.model')
const BaseController = require('./BaseController');
const ScheduleWeekdayModel = require('../models/scheduleweekday.model')
const UserModel = require('../models/user.model')

const ScheduleModel = require('../models/schedule.model')
const LessonModel = require('../models/lesson.model')
ScheduleModel.belongsToMany(WeekdayModel, {
    through: ScheduleWeekdayModel,
    foreignKey: 'schedule_id',
    otherKey: 'weekday_id',
    as: 'weekdays'
});
class GroupController extends BaseController {
    getAll = async (req, res, next) => {
        const groups = await GroupModel.findAll({
            include: [
                {
                    model: ScheduleModel,
                    as: 'schedule'
                },
                {
                    model: UserModel,
                    as: 'teacher',
                    attributes: ['id', 'fullname']
                },
                {
                    model: UserModel,
                    as: 'admin',
                    attributes: ['id', 'fullname']
                }
            ]
        });
        res.send(groups);
    };

    getById = async (req, res, next) => {
        const group = await GroupModel.findByPk(req.params.id, {
            include: [
                {
                    model: ScheduleModel,
                    as: 'schedule',
                    include: [{
                        model: WeekdayModel,
                        as: 'weekdays',
                        through: ScheduleWeekdayModel
                    }]
                },
                {
                    model: LessonModel,
                    as: 'lessons'
                },
                {
                    model: UserModel,
                    as: 'teacher',
                    attributes: ['id', 'first_name', 'last_name']
                },
                {
                    model: UserModel,
                    as: 'admin',
                    attributes: ['id', 'first_name', 'last_name']
                }
            ]
        });

        if (!group) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(group);
    };
    getByTeacherId = async (req, res, next) => {
        const { id } = req.params;

        if (!id) {
            throw new HttpException(400, req.mf('id is required'));
        }

        const groups = await GroupModel.findAll({
            where: { teacherId: id },
            include: [
                {
                    model: ScheduleModel,
                    as: 'schedule'
                },
                {
                    model: UserModel,
                    as: 'teacher',
                    attributes: ['id', 'fullname']
                },
                {
                    model: UserModel,
                    as: 'admin',
                    attributes: ['id', 'fullname']
                }
            ]
        });

        res.send(groups);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        const { name, schedule_id, teacher_id, admin_id, start_time, group_type } = req.body;

        const schedule = await ScheduleModel.findByPk(schedule_id, {
            include: [{
                model: WeekdayModel,
                as: 'weekdays', // ✅ important
                through: { attributes: [] }
            }]
        });

        if (!schedule) {
            throw new HttpException(404, req.mf('schedule not found'));
        }

        const group = await GroupModel.create({
            name,
            scheduleId: schedule_id,
            teacherId: teacher_id,
            adminId: admin_id,
            startTime: start_time,
            groupType: group_type
        });

        const weekdays = schedule.weekdays.map(w => w.id);
        const startDate = new Date(start_time);
        let currentDate = new Date(startDate);
        const lessons = [];

        for (let i = 0; i < schedule.number_of_lessons; i++) {
            while (true) {
                const currentDay = currentDate.getDay();
                const isoDay = currentDay === 0 ? 7 : currentDay;

                if (weekdays.includes(isoDay)) {
                    lessons.push({
                        groupId: group.id,
                        date: new Date(currentDate),
                        sequenceNumber: i + 1
                    });
                    currentDate.setDate(currentDate.getDate() + 1);
                    break;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        await LessonModel.bulkCreate(lessons);
        res.status(201).send(group);
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        const group = await GroupModel.findByPk(req.params.id);
        if (!group) {
            throw new HttpException(404, req.mf('data not found'));
        }

        const { name, schedule_id, teacher_id, admin_id, start_time, group_type } = req.body;

        if (schedule_id) {
            const schedule = await ScheduleModel.findByPk(schedule_id);
            if (!schedule) {
                throw new HttpException(404, req.mf('schedule not found'));
            }
            group.scheduleId = schedule_id;
        }

        group.name = name || group.name;
        group.teacherId = teacher_id || group.teacherId;
        group.adminId = admin_id || group.adminId;
        group.startTime = start_time || group.startTime;
        group.groupType = group_type || group.groupType;

        await group.save();
        res.send(group);
    };

    delete = async (req, res, next) => {
        const group = await GroupModel.findByPk(req.params.id);
        if (!group) {
            throw new HttpException(404, req.mf('data not found'));
        }

        await group.destroy();
        res.send(req.mf('data has been deleted'));
    };
}

module.exports = new GroupController();