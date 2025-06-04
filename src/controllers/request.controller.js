const ReleaseRequestModel = require('../models/request.model');
const InvestorModel = require('../models/investor.model');
const ChiqimModel = require('../models/rasxod.model');
const PrixodModel = require('../models/prixod.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');

class ReleaseRequestController extends BaseController {
    // Investor creates a withdrawal request
    create = async (req, res, next) => {
        this.checkValidation(req);

        // Extract fields from request body, including investor_id
        const { investor_id, amount, paytype, comment, datetime } = req.body;

        // Check if the investor exists
        const investor = await InvestorModel.findByPk(investor_id);
        if (!investor) {
            throw new HttpException(404, 'Investor not found');
        }

        // Optionally, check if the authenticated user has rights to create a request for this investor
        // e.g. if req.user.role !== 'admin' throw an error or check ownership

        // Create withdrawal request
        const request = await ReleaseRequestModel.create({
            investor_id,
            amount,
            status: 'pending',
            paytype,
            comment,
            datetime
        });

        res.status(201).send(request);
    };

    getByInvestor = async (req, res, next) => {
        const investor_id = req.params.id;

        const investor = await InvestorModel.findByPk(investor_id);
        if (!investor) {
            throw new HttpException(404, 'Investor not found');
        }
        const requests = await ReleaseRequestModel.findAll({
            where: { investor_id },
            include: [{
                model: InvestorModel,
                as: 'investor',
                attributes: ['id', 'fullname']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.send(requests);
    };
    getPendingRequestCounts = async (req, res, next) => {
        try {
            const pendingCounts = await ReleaseRequestModel.findAll({
                where: { status: 'pending' },
                attributes: [
                    'investor_id',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'pending_count']
                ],
                group: ['investor_id'],
                raw: true
            });

            res.send(pendingCounts);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req, res, next) => {
        const { status } = req.query;
        const where = {};
        if (status) where.status = status;

        const requests = await ReleaseRequestModel.findAll({
            where,
            include: [{
                model: InvestorModel,
                as: 'investor',
                attributes: ['id', 'fullname']
            }]
        });
        res.send(requests);
    };

    approve = async (req, res, next) => {
        const transaction = await sequelize.transaction();
        try {
            const request = await ReleaseRequestModel.findByPk(req.params.id, { transaction });
            if (!request || request.status !== 'pending') {
                throw new HttpException(404, 'Request not found or not pending');
            }
            const [prixodResult] = await PrixodModel.findAll({
                attributes: [[sequelize.fn('SUM', sequelize.col('summa')), 'total_invested']],
                where: { investor_id: request.investor_id },
                raw: true,
                transaction
            });

            const [chiqimResult] = await ChiqimModel.findAll({
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('foyda_summa')), 'total_profit'],
                    [sequelize.fn('SUM', sequelize.col('zarar_summa')), 'total_loss']
                ],
                where: { investor_id: request.investor_id },
                raw: true,
                transaction
            });

            const invested = Number(prixodResult.total_invested) || 0;
            const profit = Number(chiqimResult.total_profit) || 0;
            const loss = Number(chiqimResult.total_loss) || 0;
            const balance = invested + profit - loss;

            if (balance < request.amount) {
                throw new HttpException(400, 'Insufficient balance');
            }

            await ChiqimModel.create({
                investor_id: request.investor_id,
                zarar_summa: request.amount,
                datetime: request.datetime
            }, { transaction });


            request.status = 'approved';
            await request.save({ transaction });

            await transaction.commit();
            res.send({ message: 'Withdrawal approved successfully' });
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    };

    // Admin rejects a request
    reject = async (req, res, next) => {
        const request = await ReleaseRequestModel.findByPk(req.params.id);
        if (!request || request.status !== 'pending') {
            throw new HttpException(404, 'Request not found or not pending');
        }

        request.status = 'rejected';
        await request.save();
        res.send({ message: 'Withdrawal rejected' });
    };
    delay = async (req, res, next) => {
        const { id } = req.params;
        const { admin_comment, scheduled_approval_date } = req.body;

        const request = await ReleaseRequestModel.findByPk(id);
        if (!request || !['pending', 'delayed'].includes(request.status)) {
            throw new HttpException(404, 'Request not found or not delayable');
        }

        request.status = 'delayed';
        request.admin_comment = admin_comment;
        request.scheduled_approval_date = scheduled_approval_date;
        await request.save();

        res.send({ message: 'Request delayed' });
    };
}

module.exports = new ReleaseRequestController();