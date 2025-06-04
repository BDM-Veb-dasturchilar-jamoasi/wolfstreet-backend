
const Joi = require('joi');

const Role = require('../../utils/userRoles.utils');


if (!Role.Admin || !Role.Manager || !Role.Programmer || !Role.Investor || !Role.Student || !Role.Teacher || !Role.Bugalter || !Role.Hodim) {
  throw new Error('Invalid Role values in userRoles.utils.js');
}

exports.userSchemas = {
  create: Joi.object({
    username: Joi.string().required().min(3).max(25).alphanum().label('Username'),
    fullname: Joi.string().required().min(3).max(50).label('Fullname'),
    role: Joi.string().valid(Role.Admin, Role.Manager, Role.Teacher, Role.Programmer, Role.Student, Role.Investor, Role.Bugalter, Role.Hodim).required().label('Role'),
    password: Joi.string()
      .min(6)
      .required()
      .label('Password'),
  }),

  update: Joi.object({
    username: Joi.string().required().min(3).max(25).alphanum().label('Username'),
    fullname: Joi.string().required().min(3).max(50).label('Fullname'),
    role: Joi.string().valid(Role.Admin, Role.Manager, Role.Teacher, Role.Programmer, Role.Student, Role.Investor, Role.Bugalter, Role.Hodim).required().label('Role'),
    password: Joi.string()
      .min(6)
      .empty('')
      .label('Password'),
  }),

  login: Joi.object({
    username: Joi.string().required().min(3).max(25).alphanum().label('Username'),
    password: Joi.string().required().min(6).label('Password'),
  }),
};