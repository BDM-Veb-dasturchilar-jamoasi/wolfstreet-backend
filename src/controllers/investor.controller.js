const InvestorModel = require('../models/investor.model');
const UserModel = require('../models/user.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');

class InvestorController extends BaseController {
    // Get all investors with associated user
    getAll = async (req, res, next) => {
        const list = await InvestorModel.findAll({
            // include: [
            //     {
            //         model: UserModel,
            //         as: 'user',
            //         attributes: ['id', 'username', 'fullname', 'role']
            //     }
            // ],
            order: [['fullname', 'ASC']]
        });

        res.send(list);
    };
    // Get investor by user_id
    getByUserId = async (req, res, next) => {
        const { user_id } = req.params;

        const investor = await InvestorModel.findOne({
            where: { user_id },
            attributes: ['id', 'user_id', 'fullname']
        });

        if (!investor) {
            throw new HttpException(404, req.mf('investor not found'));
        }

        res.send(investor);
    };


    // Get investor by ID
    getById = async (req, res, next) => {
        const investor = await InvestorModel.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: UserModel,
                    as: 'user',
                    attributes: ['id', 'username', 'fullname', 'role']
                }
            ]
        });

        if (!investor) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(investor);
    };

    // Create new investor
    create = async (req, res, next) => {
        this.checkValidation(req);

        const { user_id, fullname } = req.body;

        // Check if user exists
        const user = await UserModel.findOne({ where: { id: user_id } });
        if (!user) {
            throw new HttpException(404, req.mf('user not found'));
        }

        const investor = await InvestorModel.create({
            user_id,
            fullname
        });

        res.status(201).send(investor);
    };

    // Update investor
    update = async (req, res, next) => {
        this.checkValidation(req);

        const investor = await InvestorModel.findOne({
            where: { id: req.params.id }
        });

        if (!investor) {
            throw new HttpException(404, req.mf('data not found'));
        }

        const { fullname } = req.body;
        if (fullname) investor.fullname = fullname;

        await investor.save();
        res.send(investor);
    };

    // Delete investor
    delete = async (req, res, next) => {
        const investor = await InvestorModel.findOne({
            where: { id: req.params.id }
        });

        if (!investor) {
            throw new HttpException(404, req.mf('data not found'));
        }

        await investor.destroy();
        res.send(req.mf('data has been deleted'));
    };
}

module.exports = new InvestorController();
