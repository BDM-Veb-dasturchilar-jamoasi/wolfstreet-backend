const KassaModel = require('../models/kassa.model');
const StaffModel = require('../models/staff.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const { Op, Sequelize } = require('sequelize');

class KassaController extends BaseController {
    getAll = async (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 30;
        const offset = (page - 1) * limit;

        const { count, rows } = await KassaModel.findAndCountAll({
            offset,
            limit,
            order: [['id', 'ASC']]
        });

        res.send({
            total: count,
            page,
            pageSize: limit,
            totalPages: Math.ceil(count / limit),
            data: rows
        });
    };

    getById = async (req, res, next) => {
        const kassa = await KassaModel.findOne({
            where: { id: req.params.id },
            include: [{ model: StaffModel, as: 'staff', include: ['user'] }]
        });

        if (!kassa) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(kassa);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        const {
            kassa_type,
            som_summa,
            dollar_summa,
            dollar_kurs,
            total_dollar_summa,
            total_som_summa,
            staff_id,
            reason,
            comment
        } = req.body;

        if (staff_id) {
            const staff = await StaffModel.findByPk(staff_id);
            if (!staff) throw new HttpException(404, req.mf('Staff not found'));
        }

        const model = await KassaModel.create({
            kassa_type,
            som_summa,
            dollar_summa,
            dollar_kurs,
            total_dollar_summa,
            total_som_summa,
            staff_id,
            reason,
            comment
        });

        res.status(201).send(model);
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        const {
            kassa_type,
            som_summa,
            dollar_summa,
            dollar_kurs,
            total_dollar_summa,
            total_som_summa,
            staff_id,
            reason,
            comment
        } = req.body;

        const model = await KassaModel.findByPk(req.params.id);
        if (!model) throw new HttpException(404, req.mf('data not found'));

        if (staff_id && staff_id !== model.staff_id) {
            const staff = await StaffModel.findByPk(staff_id);
            if (!staff) throw new HttpException(404, req.mf('Staff not found'));
            model.staff_id = staff_id;
        }

        model.kassa_type = kassa_type;
        model.som_summa = som_summa;
        model.dollar_summa = dollar_summa;
        model.dollar_kurs = dollar_kurs;
        model.total_dollar_summa = total_dollar_summa;
        model.total_som_summa = total_som_summa;
        model.reason = reason;
        model.comment = comment;

        await model.save();

        res.send(model);
    };

    delete = async (req, res, next) => {
        const model = await KassaModel.findByPk(req.params.id);
        if (!model) throw new HttpException(404, req.mf('data not found'));
        await model.destroy();
        res.send(req.mf('data deleted'));
    };

    getReport = async (req, res, next) => {
        try {
            const { datetime1, datetime2, kassa_type, staff_id } = req.body;

            if (!datetime1 || !datetime2) {
                throw new HttpException(400, req.mf('datetime1 and datetime2 are required'));
            }

            const where = {
                created_at: {
                    [Op.between]: [new Date(datetime1), new Date(datetime2)]
                }
            };

            if (kassa_type) where.kassa_type = kassa_type;
            if (staff_id) where.staff_id = staff_id;

            const data = await KassaModel.findAll({
                where,
                order: [['created_at', 'ASC']],
                attributes: {
                    include: [
                        // Include staff.user.fullname as user_fullname field
                        [Sequelize.col('staff.user.fullname'), 'user_fullname']
                    ]
                },
                include: [{
                    model: StaffModel,
                    as: 'staff',
                    attributes: [], // exclude all staff attributes
                    include: [{
                        association: 'user', // or model: UserModel, alias should be 'user'
                        attributes: ['fullname'], // only fullname
                    }]
                }],
                raw: true, // flatten results so we can get user_fullname directly
            });

            res.send({
                count: data.length,
                data
            });
        } catch (error) {
            next(error);
        }
    };

    createValidationRules = () => ({
        kassa_type: 'required|in:kirim,chiqim',
        som_summa: 'required|decimal',
        dollar_summa: 'required|decimal',
        dollar_kurs: 'required|decimal',
        total_dollar_summa: 'required|decimal',
        total_som_summa: 'required|decimal',
        staff_id: 'integer',
        reason: 'required|string',
        comment: 'string'
    });

    updateValidationRules = () => ({
        kassa_type: 'in:kirim,chiqim',
        som_summa: 'decimal',
        dollar_summa: 'decimal',
        dollar_kurs: 'decimal',
        total_dollar_summa: 'decimal',
        total_som_summa: 'decimal',
        staff_id: 'integer',
        reason: 'string',
        comment: 'string'
    });
}

module.exports = new KassaController();
