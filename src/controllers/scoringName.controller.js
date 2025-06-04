const ScoringNameModel = require('../models/scoringnames.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');

class ScoringNameController extends BaseController {
    // Get all scoring names
    getAll = async (req, res, next) => {
        const list = await ScoringNameModel.findAll({
            order: [['name', 'ASC']]
        });

        res.send(list);
    };

    // Get one scoring name by ID
    getById = async (req, res, next) => {
        const nameItem = await ScoringNameModel.findOne({
            where: { id: req.params.id }
        });

        if (!nameItem) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(nameItem);
    };

    // Create new scoring name
    create = async (req, res, next) => {
        this.checkValidation(req);

        const { name } = req.body;

        const newItem = await ScoringNameModel.create({ name });

        res.status(201).send(newItem);
    };

    // Update scoring name
    update = async (req, res, next) => {
        this.checkValidation(req);

        const nameItem = await ScoringNameModel.findOne({
            where: { id: req.params.id }
        });

        if (!nameItem) {
            throw new HttpException(404, req.mf('data not found'));
        }

        const { name } = req.body;
        if (name) nameItem.name = name;

        await nameItem.save();
        res.send(nameItem);
    };

    // Delete scoring name
    delete = async (req, res, next) => {
        const nameItem = await ScoringNameModel.findOne({
            where: { id: req.params.id }
        });

        if (!nameItem) {
            throw new HttpException(404, req.mf('data not found'));
        }

        await nameItem.destroy();
        res.send(req.mf('data has been deleted'));
    };
}

module.exports = new ScoringNameController();
