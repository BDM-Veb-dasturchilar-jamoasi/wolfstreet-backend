const fs = require('fs');
const path = require('path');
const StudentModel = require('../models/student.model');
const GroupModel = require('../models/group.model');
const UserModel = require('../models/user.model');

// Helper to delete old image
function deleteOldImage(filename) {
    if (!filename) return;

    const imagePath = path.join(__dirname, '../uploads', filename);
    if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, err => {
            if (err) console.error('Error deleting image:', err);
        });
    }
}

module.exports = {
    // GET ALL
    async getAll(req, res) {
        try {
            const students = await StudentModel.findAll({
                include: [{ model: GroupModel, as: 'group' }]
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
                include: [{ model: GroupModel, as: 'group' }]
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
                include: [{ model: GroupModel, as: 'group' }]
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
            const imgPath = req.file ? path.basename(req.file.filename) : null;

            const student = await StudentModel.create({
                fullname: req.body.fullname,
                phoneNumber: req.body.phone_number,
                groupId: req.body.group_id,
                qarzSumma: parseInt(req.body.qarzSumma || 0),
                birthdate: req.body.birthdate || null,
                passport_info: req.body.passport_info || null,
                viloyat: req.body.viloyat || null,
                above_18: req.body.above_18 === 'true' || req.body.above_18 === true,
                parent_fullname: req.body.parent_fullname || null,
                parent_phone_number: req.body.parent_phone_number || null,
                parent_agreement: req.body.parent_agreement === 'true' || req.body.parent_agreement === true,
                memberofvipchannel: req.body.memberofvipchannel === 'true' || req.body.memberofvipchannel === true,
                has_indicator: req.body.has_indicator === 'true' || req.body.has_indicator === true,
                isActive: req.body.isActive === 'true' || req.body.isActive === true,
                isWhite: req.body.isWhite === 'true' || req.body.isWhite === true,
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

            if (req.file) {
                // Delete old image using only filename
                if (student.img) {
                    const oldImagePath = path.join(__dirname, '../../uploads', student.img);
                    deleteOldImage(oldImagePath);
                }
                student.img = path.basename(req.file.filename);
            }

            student.fullname = req.body.fullname || student.fullname;
            student.phoneNumber = req.body.phone_number || student.phoneNumber;
            student.groupId = req.body.group_id || student.groupId;
            student.qarzSumma = req.body.qarzSumma !== undefined ? parseInt(req.body.qarzSumma) : student.qarzSumma;
            student.birthdate = req.body.birthdate || student.birthdate;
            student.passport_info = req.body.passport_info || student.passport_info;
            student.viloyat = req.body.viloyat || student.viloyat;
            student.above_18 = req.body.above_18 === 'true' || req.body.above_18 === true;
            student.parent_fullname = req.body.parent_fullname || student.parent_fullname;
            student.parent_phone_number = req.body.parent_phone_number || student.parent_phone_number;
            student.parent_agreement = req.body.parent_agreement === 'true' || req.body.parent_agreement === true;
            student.memberofvipchannel = req.body.memberofvipchannel === 'true' || req.body.memberofvipchannel === true;
            student.has_indicator = req.body.has_indicator === 'true' || req.body.has_indicator === true;
            student.isActive = req.body.isActive === 'true' || req.body.isActive === true;
            student.isWhite = req.body.isWhite === 'true' || req.body.isWhite === true;

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