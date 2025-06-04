const TaskModel = require('../models/task.model');
const StaffModel = require('../models/staff.model');
const UserModel = require('../models/user.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');

class TaskController extends BaseController {
    getAll = async (req, res, next) => {
        const taskList = await TaskModel.findAll({
            include: [
                {
                    model: UserModel,
                    as: 'user',
                    attributes: ['id', 'fullname', 'role', 'username']
                }
            ],
            order: [['id', 'ASC']]
        });

        res.send(taskList);
    };

    getById = async (req, res, next) => {
        const task = await TaskModel.findOne({
            where: { id: req.params.id },
            include: [
                { model: StaffModel, as: 'staff' },
                { model: UserModel, as: 'user' }
            ]
        });

        if (!task) throw new HttpException(404, req.mf('data not found'));
        res.send(task);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        const { task, deadline, comment, staff_id, staff_user_id } = req.body;

        const staff = await StaffModel.findByPk(staff_id);
        if (!staff) throw new HttpException(404, req.mf('Staff not found'));

        const user = await UserModel.findByPk(staff_user_id);
        if (!user) throw new HttpException(404, req.mf('User not found'));

        const datetime = Math.floor(Date.now() / 1000);

        const model = await TaskModel.create({
            task,
            deadline,
            comment,
            staff_id,
            staff_user_id,
            datetime
        });

        res.status(201).send(model);
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        const model = await TaskModel.findByPk(req.params.id);
        if (!model) throw new HttpException(404, req.mf('data not found'));

        const { task, deadline, comment, staff_id, staff_user_id } = req.body;

        if (staff_id) {
            const staff = await StaffModel.findByPk(staff_id);
            if (!staff) throw new HttpException(404, req.mf('Staff not found'));
            model.staff_id = staff_id;
        }

        if (staff_user_id) {
            const user = await UserModel.findByPk(staff_user_id);
            if (!user) throw new HttpException(404, req.mf('User not found'));
            model.staff_user_id = staff_user_id;
        }

        if (task !== undefined) model.task = task;
        if (deadline !== undefined) model.deadline = deadline;
        if (comment !== undefined) model.comment = comment;

        await model.save();
        res.send(model);
    };

    delete = async (req, res, next) => {
        const model = await TaskModel.findByPk(req.params.id);
        if (!model) throw new HttpException(404, req.mf('data not found'));
        await model.destroy();
        res.send(req.mf('data deleted'));
    };

    createValidationRules = () => ({
        task: 'required|string',
        deadline: 'required|date',
        comment: 'string',
        staff_id: 'required|integer',
        staff_user_id: 'required|integer'
    });

    updateValidationRules = () => ({
        task: 'string',
        deadline: 'date',
        comment: 'string',
        staff_id: 'integer',
        staff_user_id: 'integer'
    });
}

module.exports = new TaskController();
