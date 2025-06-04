const Joi = require('joi');

exports.investorSchemas = {
    create: Joi.object({
        user_id: Joi.number().integer().required().label('User ID'),
        fullname: Joi.string().min(3).max(50).required().label('Fullname')
    }),

    update: Joi.object({
        fullname: Joi.string().min(3).max(50).required().label('Fullname')
    })
};
