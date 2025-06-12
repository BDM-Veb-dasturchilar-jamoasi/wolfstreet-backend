const ChiqimModel = require('../models/rasxod.model');
const InvestorModel = require('../models/investor.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const PrixodModel = require('../models/prixod.model');
const { Op } = require('sequelize');
class ChiqimController extends BaseController {
    // Get all chiqims with associated investor
    getAll = async (req, res, next) => {
        const list = await ChiqimModel.findAll({
            include: [
                {
                    model: InvestorModel,
                    as: 'investor',
                    attributes: ['id', 'fullname'],
                    required: false  // allow chiqims without investor
                }
            ],
        });

        res.send(list);
    };

    // Get chiqim by ID
    getById = async (req, res, next) => {
        const chiqim = await ChiqimModel.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: InvestorModel,
                    as: 'investor',
                    attributes: ['id', 'fullname'],
                    required: false
                }
            ]
        });

        if (!chiqim) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(chiqim);
    };

    // Create new chiqim
    create = async (req, res, next) => {
        this.checkValidation(req);

        const { investor_id, foyda_summa, zarar_summa, datetime } = req.body;

        if (investor_id) {
            // Check if investor exists if investor_id is provided
            const investor = await InvestorModel.findOne({ where: { id: investor_id } });
            if (!investor) {
                throw new HttpException(404, req.mf('investor not found'));
            }
        }

        const chiqim = await ChiqimModel.create({
            investor_id: investor_id || null,
            foyda_summa,
            zarar_summa,

            datetime
        });

        res.status(201).send(chiqim);
    };

    // Update chiqim
    update = async (req, res, next) => {
        this.checkValidation(req);

        const chiqim = await ChiqimModel.findOne({
            where: { id: req.params.id }
        });

        if (!chiqim) {
            throw new HttpException(404, req.mf('data not found'));
        }

        const { investor_id, foyda_summa, zarar_summa, datetime } = req.body;

        if (investor_id !== undefined) {
            if (investor_id !== null) {
                const investor = await InvestorModel.findOne({ where: { id: investor_id } });
                if (!investor) {
                    throw new HttpException(404, req.mf('investor not found'));
                }
            }
            chiqim.investor_id = investor_id;
        }

        if (foyda_summa !== undefined) chiqim.foyda_summa = foyda_summa;
        if (zarar_summa !== undefined) chiqim.zarar_summa = zarar_summa;

        if (datetime !== undefined) chiqim.datetime = datetime;

        await chiqim.save();
        res.send(chiqim);
    };

    // Delete chiqim
    delete = async (req, res, next) => {
        const chiqim = await ChiqimModel.findOne({
            where: { id: req.params.id }
        });

        if (!chiqim) {
            throw new HttpException(404, req.mf('data not found'));
        }

        await chiqim.destroy();
        res.send(req.mf('data has been deleted'));
    };

    getInvestorCurrentBalance = async (req, res, next) => {
        const { investor_id } = req.query;

        const investor = await InvestorModel.findOne({ where: { id: investor_id } });
        if (!investor) {
            throw new HttpException(404, req.mf('investor not found'));
        }

        const [prixodResult] = await PrixodModel.findAll({
            attributes: [
                [PrixodModel.sequelize.fn('SUM', PrixodModel.sequelize.col('summa')), 'total_invested']
            ],
            where: { investor_id },
            raw: true
        });

        const [chiqimResult] = await ChiqimModel.findAll({
            attributes: [
                [ChiqimModel.sequelize.fn('SUM', ChiqimModel.sequelize.col('foyda_summa')), 'total_profit'],
                [ChiqimModel.sequelize.fn('SUM', ChiqimModel.sequelize.col('zarar_summa')), 'total_loss']
            ],
            where: { investor_id },
            raw: true
        });

        const invested = Number(prixodResult.total_invested) || 0;
        const profit = Number(chiqimResult.total_profit) || 0;
        const loss = Number(chiqimResult.total_loss) || 0;

        const balance = invested + profit - loss;

        res.send({
            investor_id,
            fullname: investor.fullname,
            invested,
            profit,
            loss,
            current_balance: balance
        });
    };
    getAllInvestorsCurrentBalance = async (req, res, next) => {
        // Fetch all investors
        const investors = await InvestorModel.findAll({
            attributes: ['id', 'fullname']
        });

        // For each investor, calculate their balance
        const results = await Promise.all(investors.map(async (investor) => {
            const investor_id = investor.id;

            // Sum of all invested amounts (prixod)
            const [prixodResult] = await PrixodModel.findAll({
                attributes: [
                    [PrixodModel.sequelize.fn('SUM', PrixodModel.sequelize.col('summa')), 'total_invested']
                ],
                where: { investor_id },
                raw: true
            });

            // Sum of all profits and losses (chiqim)
            const [chiqimResult] = await ChiqimModel.findAll({
                attributes: [
                    [ChiqimModel.sequelize.fn('SUM', ChiqimModel.sequelize.col('foyda_summa')), 'total_profit'],
                    [ChiqimModel.sequelize.fn('SUM', ChiqimModel.sequelize.col('zarar_summa')), 'total_loss']
                ],
                where: { investor_id },
                raw: true
            });

            const invested = Number(prixodResult.total_invested) || 0;
            const profit = Number(chiqimResult.total_profit) || 0;
            const loss = Number(chiqimResult.total_loss) || 0;

            return {
                investor_id,
                fullname: investor.fullname,
                IsWhite: investor.isWhite,
                invested,
                profit,
                loss,
                current_balance: invested + profit - loss
            };
        }));

        res.send(results);
    }
    getAllByDateRange = async (req, res, next) => {
        const { start_date, end_date } = req.body;

        if (!start_date || !end_date) {
            throw new HttpException(400, req.mf('start_date and end_date are required'));
        }

        const records = await ChiqimModel.findAll({
            where: {
                createdAt: {
                    [Op.between]: [start_date, end_date]
                }
            },
            include: [
                {
                    model: InvestorModel,
                    as: 'investor',
                    attributes: ['id', 'fullname'],
                    required: false
                }
            ],
            order: [['createdAt', 'ASC']],
            attributes: ['foyda_summa', 'zarar_summa', 'createdAt']
        });

        const result = records.map(r => ({
            investor_name: r.investor ? r.investor.fullname : null,
            foyda_summa: r.foyda_summa,
            zarar_summa: r.zarar_summa,
            created_at: r.createdAt
        }));

        const total_foyda = records.reduce((sum, r) => sum + (r.foyda_summa || 0), 0);
        const total_zarar = records.reduce((sum, r) => sum + (r.zarar_summa || 0), 0);

        res.send({
            total_foyda,
            total_zarar,
            data: result
        });
    };

    getByInvestorAndDateRange = async (req, res, next) => {
        const { investor_id, start_date, end_date } = req.body;

        if (!investor_id || !start_date || !end_date) {
            throw new HttpException(400, req.mf('investor_id, start_date, and end_date are required'));
        }

        const investor = await InvestorModel.findOne({ where: { id: investor_id } });
        if (!investor) {
            throw new HttpException(404, req.mf('investor not found'));
        }

        const records = await ChiqimModel.findAll({
            where: {
                investor_id,
                createdAt: {
                    [Op.between]: [start_date, end_date]
                }
            },
            order: [['createdAt', 'ASC']],
            attributes: ['foyda_summa', 'zarar_summa', 'createdAt']
        });

        const result = records.map(r => ({
            investor_name: investor.fullname,
            foyda_summa: r.foyda_summa,
            zarar_summa: r.zarar_summa,
            created_at: r.createdAt
        }));

        const total_foyda = records.reduce((sum, r) => sum + (r.foyda_summa || 0), 0);
        const total_zarar = records.reduce((sum, r) => sum + (r.zarar_summa || 0), 0);

        res.send({
            total_foyda,
            total_zarar,
            data: result
        });
    };



}

module.exports = new ChiqimController();
