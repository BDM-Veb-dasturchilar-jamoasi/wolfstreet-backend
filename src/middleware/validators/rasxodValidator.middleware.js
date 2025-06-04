const Joi = require('joi');

exports.rasxodSchemas = {
    create: Joi.object({
        investor_id: Joi.number().integer().allow(null).optional().label('Investor ID'),
        foyda_summa: Joi.number().precision(2).min(0).allow(null).optional().label('Foyda Summa'),
        zarar_summa: Joi.number().precision(2).min(0).allow(null).optional().label('Zarar Summa'),

        datetime: Joi.number().integer().required().label('Datetime (timestamp)'),
    }),

    update: Joi.object({
        investor_id: Joi.number().integer().allow(null).optional().label('Investor ID'),
        foyda_summa: Joi.number().precision(2).min(0).allow(null).optional().label('Foyda Summa'),
        zarar_summa: Joi.number().precision(2).min(0).allow(null).optional().label('Zarar Summa'),

        datetime: Joi.number().integer().optional().label('Datetime (timestamp)'),
    }),
};
