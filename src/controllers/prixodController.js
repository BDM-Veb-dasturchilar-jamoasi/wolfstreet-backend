const PrixodModel = require('../models/prixod.model');
const InvestorModel = require('../models/investor.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const { Op } = require('sequelize');
const moment = require('moment');

class PrixodController extends BaseController {
    // Get all prixods with associated investor
    getAll = async (req, res, next) => {
        const list = await PrixodModel.findAll({
            include: [
                {
                    model: InvestorModel,
                    as: 'investor',
                    attributes: ['id', 'fullname']
                }
            ],
        });

        res.send(list);
    };

    // Get prixod by ID
    getById = async (req, res, next) => {
        const prixod = await PrixodModel.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: InvestorModel,
                    as: 'investor',
                    attributes: ['id', 'fullname']
                }
            ]
        });

        if (!prixod) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(prixod);
    };

    // Create new prixod
    create = async (req, res, next) => {
        this.checkValidation(req);

        const { investor_id, summa, datetime } = req.body;

        const investor = await InvestorModel.findOne({ where: { id: investor_id } });
        if (!investor) {
            throw new HttpException(404, req.mf('investor not found'));
        }

        const prixod = await PrixodModel.create({
            investor_id,
            summa,
            datetime
        });

        res.status(201).send(prixod);
    };

    // Update prixod
    update = async (req, res, next) => {
        this.checkValidation(req);

        const prixod = await PrixodModel.findOne({
            where: { id: req.params.id }
        });

        if (!prixod) {
            throw new HttpException(404, req.mf('data not found'));
        }

        const { summa, datetime } = req.body;

        if (summa !== undefined) prixod.summa = summa;
        if (datetime !== undefined) prixod.datetime = datetime;

        await prixod.save();
        res.send(prixod);
    };

    // Delete prixod
    delete = async (req, res, next) => {
        const prixod = await PrixodModel.findOne({
            where: { id: req.params.id }
        });

        if (!prixod) {
            throw new HttpException(404, req.mf('data not found'));
        }

        await prixod.destroy();
        res.send(req.mf('data has been deleted'));
    };

    // Report 1: All records between two datetime (UNIX) - Accept POST body
    getReport = async (req, res, next) => {
        const { from, to } = req.body;

        if (!from || !to || isNaN(from) || isNaN(to)) {
            throw new HttpException(400, req.mf('from and to timestamps are required and must be valid numbers'));
        }

        const prixods = await PrixodModel.findAll({
            where: {
                datetime: {
                    [Op.between]: [from, to]
                }
            },
            include: [
                {
                    model: InvestorModel,
                    as: 'investor',
                    attributes: ['fullname']
                }
            ],
            order: [['datetime', 'ASC']]
        });

        const result = prixods.map((item, index) => {
            const formattedTime = moment.unix(item.datetime).format('YYYY-MM-DD HH:mm:ss');
            return `prixod${index + 1}: ${item.investor.fullname}, summa: ${item.summa}, ${formattedTime}`;
        });

        res.send(result);
    };

    // Report 2: Records of one investor between datetime - Accept POST body
    getInvestorReport = async (req, res, next) => {
        const { investor_id, from, to } = req.body;

        if (!investor_id || !from || !to || isNaN(investor_id) || isNaN(from) || isNaN(to)) {
            throw new HttpException(400, req.mf('investor_id, from and to timestamps are required and must be valid numbers'));
        }

        const investor = await InvestorModel.findOne({ where: { id: investor_id } });
        if (!investor) {
            throw new HttpException(404, req.mf('investor not found'));
        }

        const prixods = await PrixodModel.findAll({
            where: {
                investor_id,
                datetime: {
                    [Op.between]: [from, to]
                }
            },
            order: [['datetime', 'ASC']]
        });

        const report = prixods.map((item, index) => {
            const formattedTime = moment.unix(item.datetime).format('YYYY-MM-DD HH:mm:ss');
            return `record${index + 1}: ${formattedTime}, summa: ${item.summa}`;
        });

        res.send(report);
    };
}

module.exports = new PrixodController();
