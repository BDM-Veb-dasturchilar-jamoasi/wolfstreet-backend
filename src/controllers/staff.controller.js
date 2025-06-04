const StaffModel = require('../models/staff.model');
const UserModel = require('../models/user.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');

class StaffController extends BaseController {
    getAll = async (req, res, next) => {
        const staffList = await StaffModel.findAll({
            include: [{ model: UserModel, as: 'user' }],
            order: [['id', 'ASC']]
        });
        res.send(staffList);
    };

    getById = async (req, res, next) => {
        const staff = await StaffModel.findOne({
            where: { id: req.params.id },
            include: [{ model: UserModel, as: 'user' }]
        });

        if (!staff) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(staff);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        const { user_id, fixed_salary, kpi_summa } = req.body;

        const user = await UserModel.findOne({ where: { id: user_id } });
        if (!user) throw new HttpException(404, req.mf('User not found'));

        const existingStaff = await StaffModel.findOne({ where: { user_id } });
        if (existingStaff) {
            throw new HttpException(400, req.mf('Staff entry exists for this user'));
        }

        const model = await StaffModel.create({ user_id, fixed_salary, kpi_summa });
        res.status(201).send(model);
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        const { user_id, fixed_salary, kpi_summa } = req.body;
        const model = await StaffModel.findByPk(req.params.id);
        if (!model) throw new HttpException(404, req.mf('data not found'));

        if (user_id && user_id !== model.user_id) {
            const user = await UserModel.findByPk(user_id);
            if (!user) throw new HttpException(404, req.mf('User not found'));

            const existingStaff = await StaffModel.findOne({ where: { user_id } });
            if (existingStaff) {
                throw new HttpException(400, req.mf('Staff entry exists for user'));
            }
            model.user_id = user_id;
        }

        model.fixed_salary = fixed_salary;
        model.kpi_summa = kpi_summa;
        await model.save();
        res.send(model);
    };

    delete = async (req, res, next) => {
        const model = await StaffModel.findByPk(req.params.id);
        if (!model) throw new HttpException(404, req.mf('data not found'));
        await model.destroy();
        res.send(req.mf('data deleted'));
    };

    createValidationRules = () => ({
        user_id: 'required|integer',
        fixed_salary: 'required|decimal',
        kpi_summa: 'required|decimal'
    });

    updateValidationRules = () => ({
        user_id: 'integer',
        fixed_salary: 'decimal',
        kpi_summa: 'decimal'
    });
}

module.exports = new StaffController();
