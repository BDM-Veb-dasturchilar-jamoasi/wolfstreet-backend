const fs = require('fs');
const path = require('path');
const StudentModel = require('../models/student.model');
const GroupModel = require('../models/group.model');
const PaymentModel = require('../models/payment.model');
const AttendanceModel = require('../models/attendance.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const UserModel = require('../models/user.model');

class StudentController extends BaseController {
    getAll = async (req, res, next) => {
        const students = await StudentModel.findAll({
            include: [{
                model: GroupModel,
                as: 'group',
                include: [
                    { model: UserModel, as: 'teacher', attributes: ['id', 'fullname'] },
                    { model: UserModel, as: 'admin', attributes: ['id', 'fullname'] }
                ]
            }],
            order: [['createdAt', 'DESC']]
        });
        res.send(students);
    };

    getById = async (req, res, next) => {
        const student = await StudentModel.findByPk(req.params.id, {
            include: [
                {
                    model: GroupModel,
                    as: 'group',
                    include: [
                        { model: UserModel, as: 'teacher', attributes: ['id', 'fullname'] },
                        { model: UserModel, as: 'admin', attributes: ['id', 'fullname'] }
                    ]
                },
                { model: AttendanceModel, as: 'attendances' }
            ]
        });

        if (!student) throw new HttpException(404, req.mf('data not found'));

        res.send(student);
    };

    getByGroupId = async (req, res, next) => {
        const groupId = req.params.group_id;
        const students = await StudentModel.findAll({ where: { groupId } });
        res.send(students);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        const {
            fullname,
            phone_number,
            group_id,
            qarzSumma,
            birthdate,
            passport_info,
            viloyat,
            above_18,
            parent_fullname,
            parent_phone_number,
            parent_agreement
        } = req.body;

        const group = await GroupModel.findByPk(group_id);
        if (!group) throw new HttpException(404, req.mf('group not found'));

        const imgPath = req.file ? req.file.filename : null;

        const student = await StudentModel.create({
            fullname,
            phoneNumber: phone_number,
            groupId: group_id,
            qarzSumma: parseInt(qarzSumma) || 0,
            birthdate: birthdate || null,
            passport_info: passport_info || null,
            viloyat: viloyat || null,
            above_18: above_18 === 'true' ? true : false,
            parent_fullname: parent_fullname || null,
            parent_phone_number: parent_phone_number || null,
            parent_agreement: parent_agreement === 'true' ? true : false,
            img: imgPath
        });

        res.status(201).send(student);
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        const student = await StudentModel.findByPk(req.params.id);
        if (!student) throw new HttpException(404, req.mf('data not found'));

        const {
            fullname,
            phone_number,
            group_id,
            qarzSumma,
            birthdate,
            passport_info,
            viloyat,
            above_18,
            parent_fullname,
            parent_phone_number,
            parent_agreement
        } = req.body;

        if (group_id) {
            const group = await GroupModel.findByPk(group_id);
            if (!group) throw new HttpException(404, req.mf('group not found'));
            student.groupId = group_id;
        }

        // Delete old image if new one uploaded
        if (req.file) {
            if (student.img && fs.existsSync(path.join(__dirname, '..', student.img))) {
                fs.unlinkSync(path.join(__dirname, '..', student.img));
            }
            student.img = req.file ? req.file.filename : student.img;
        }

        student.fullname = fullname || student.fullname;
        student.phoneNumber = phone_number || student.phoneNumber;
        student.qarzSumma = qarzSumma !== undefined ? parseInt(qarzSumma) : student.qarzSumma;
        student.birthdate = birthdate || student.birthdate;
        student.passport_info = passport_info || student.passport_info;
        student.viloyat = viloyat || student.viloyat;
        student.above_18 = above_18 === 'true' ? true : false;
        student.parent_fullname = parent_fullname || student.parent_fullname;
        student.parent_phone_number = parent_phone_number || student.parent_phone_number;
        student.parent_agreement = parent_agreement === 'true' ? true : false;

        await student.save();
        res.send(student);
    };

    delete = async (req, res, next) => {
        const student = await StudentModel.findByPk(req.params.id);
        if (!student) throw new HttpException(404, req.mf('data not found'));

        if (student.img && fs.existsSync(path.join(__dirname, '..', student.img))) {
            fs.unlinkSync(path.join(__dirname, '..', student.img));
        }

        await student.destroy();
        res.send(req.mf('data has been deleted'));
    };
}

module.exports = new StudentController();
