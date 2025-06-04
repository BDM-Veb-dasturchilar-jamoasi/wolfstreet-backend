const Joi = require('joi');

exports.prixodSchemas = {
    create: Joi.object({
        investor_id: Joi.number().integer().required().label('Investor ID'),
        summa: Joi.number().precision(2).min(0).required().label('Summa'),
        datetime: Joi.number().integer().required().label('Datetime (timestamp)')
    }),

    update: Joi.object({
        summa: Joi.number().precision(2).min(0).optional().label('Summa'),
        datetime: Joi.number().integer().optional().label('Datetime (timestamp)')
    })
};
