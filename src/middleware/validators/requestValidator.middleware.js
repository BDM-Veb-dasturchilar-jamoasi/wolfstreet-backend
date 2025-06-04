const Joi = require('joi');

exports.releaseRequestSchemas = {
    create: Joi.object({
        investor_id: Joi.number().integer().required().label('Investor ID'),
        amount: Joi.number().precision(2).min(0).required().label('Amount'),
        status: Joi.string()
            .valid('pending', 'approved', 'rejected')
            .optional()
            .label('Status'),
        paytype: Joi.string()
            .valid('naqd', 'click', 'plastik', 'dollar')
            .required()
            .label('Pay Type'),
        comment: Joi.string().allow(null, '').optional().label('Comment'),
        datetime: Joi.number().integer().required().label('Datetime (timestamp)')
    })
};
