const fs = require('fs');
const path = require('path');
const StudentModel = require('../models/student.model');
const GroupModel = require('../models/group.model');
const UserModel = require('../models/user.model');

// Helper to delete old image
function deleteOldImage(imagePath) {
    if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}

module.exports = {
    // GET ALL
    async getAll(req, res) {
        try {
            const students = await StudentModel.findAll({
                include: [
                    {
                        model: GroupModel,
                        as: 'group'
                    }
                ]
            });
            res.status(200).json({ error: false, data: students });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    },
    async getByGroupId(req, res) {
        try {
            const groupId = req.params.group_id;
            const students = await StudentModel.findAll({
                where: { groupId },
                include: {
                    model: GroupModel,
                    as: 'group'
                }
            });

            res.status(200).json({ error: false, data: students });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    },

    // GET ONE
    async getOne(req, res) {
        try {
            const student = await StudentModel.findByPk(req.params.id, {
                include: {
                    model: GroupModel,
                    as: 'group'
                }
            });
            if (!student) {
                return res.status(404).json({ error: true, message: 'Student not found' });
            }
            res.status(200).json({ error: false, data: student });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    },

    // CREATE
    async create(req, res) {
        try {
            const {
                fullname,
                phone_number,
                group_id,
                qarzSumma = 0,
                birthdate,
                passport_info,
                viloyat,
                above_18 = false,
                parent_fullname,
                parent_phone_number,
                parent_agreement = true,
                memberofvipchannel = false,
                has_indicator = false,
                isActive = true,
                isWhite = false
            } = req.body;

            const imgPath = req.file ? req.file.path : null;

            const student = await StudentModel.create({
                fullname,
                phoneNumber: phone_number,
                groupId: group_id,
                qarzSumma: parseInt(qarzSumma),
                birthdate: birthdate || null,
                passport_info: passport_info || null,
                viloyat: viloyat || null,
                above_18: above_18 === 'true' || above_18 === true,
                parent_fullname: parent_fullname || null,
                parent_phone_number: parent_phone_number || null,
                parent_agreement: parent_agreement === 'true' || parent_agreement === true,
                memberofvipchannel: memberofvipchannel === 'true' || memberofvipchannel === true,
                has_indicator: has_indicator === 'true' || has_indicator === true,
                isActive: isActive === 'true' || isActive === true,
                isWhite: isWhite === 'true' || isWhite === true,
                img: imgPath
            });

            res.status(201).json({ error: false, data: student });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    },

    // UPDATE
    async update(req, res) {
        try {
            const student = await StudentModel.findByPk(req.params.id);
            if (!student) {
                return res.status(404).json({ error: true, message: 'Student not found' });
            }

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
                parent_agreement,
                memberofvipchannel,
                has_indicator,
                isActive,
                isWhite
            } = req.body;

            if (req.file) {
                deleteOldImage(student.img);
                student.img = req.file.path;
            }

            student.fullname = fullname || student.fullname;
            student.phoneNumber = phone_number || student.phoneNumber;
            student.groupId = group_id || student.groupId;
            student.qarzSumma = qarzSumma !== undefined ? parseInt(qarzSumma) : student.qarzSumma;
            student.birthdate = birthdate || student.birthdate;
            student.passport_info = passport_info || student.passport_info;
            student.viloyat = viloyat || student.viloyat;
            student.above_18 = above_18 === 'true' || above_18 === true;
            student.parent_fullname = parent_fullname || student.parent_fullname;
            student.parent_phone_number = parent_phone_number || student.parent_phone_number;
            student.parent_agreement = parent_agreement === 'true' || parent_agreement === true;
            student.memberofvipchannel = memberofvipchannel === 'true' || memberofvipchannel === true;
            student.has_indicator = has_indicator === 'true' || has_indicator === true;
            student.isActive = isActive === 'true' || isActive === true;
            student.isWhite = isWhite === 'true' || isWhite === true;

            await student.save();

            res.status(200).json({ error: false, data: student });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    },

    // DELETE
    async delete(req, res) {
        try {
            const student = await StudentModel.findByPk(req.params.id);
            if (!student) {
                return res.status(404).json({ error: true, message: 'Student not found' });
            }

            deleteOldImage(student.img);

            await student.destroy();

            res.status(200).json({ error: false, message: 'Student deleted' });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }
};
