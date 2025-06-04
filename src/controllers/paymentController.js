const PaymentModel = require('../models/payment.model');
const StudentModel = require('../models/student.model')
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const { Op } = require('sequelize');
class PaymentController extends BaseController {
    getAll = async (req, res, next) => {
        try {
            const payments = await PaymentModel.findAll({
                include: [{
                    model: StudentModel,
                    as: 'student'
                }],
                order: [['createdAt', 'DESC']] // Sort from latest to oldest
            });
            res.send(payments);
        } catch (error) {
            next(error); // Optional: better error handling
        }
    };

    getById = async (req, res, next) => {
        const payment = await PaymentModel.findByPk(req.params.id, {
            include: [{
                model: StudentModel,
                as: 'student'
            }]
        });

        if (!payment) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(payment);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        const { student_id, dollar_kurs, dollar_summa, som_summa } = req.body;

        const student = await StudentModel.findByPk(student_id);
        if (!student) {
            throw new HttpException(404, req.mf('student not found'));
        }

        // 🧮 Calculate total paid in so'm
        const totalPaid = (dollar_summa * dollar_kurs) + som_summa;

        // Reduce student's debt by the actual paid amount
        student.qarzSumma = Math.max(0, student.qarzSumma - totalPaid);
        await student.save();

        // Create payment record with correct paySumma (total paid)
        const payment = await PaymentModel.create({
            studentId: student_id,
            paySumma: totalPaid, // Store actual paid amount
            dollarKurs: dollar_kurs,
            dollarSumma: dollar_summa,
            somSumma: som_summa,
            qarzSumma: student.qarzSumma // Snapshot of remaining debt
        });

        res.status(201).send(payment);
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        const payment = await PaymentModel.findByPk(req.params.id);
        if (!payment) {
            throw new HttpException(404, req.mf('data not found'));
        }

        const { student_id, dollar_kurs, dollar_summa, som_summa } = req.body;

        // Fetch student (existing or new if changed)
        let student = await StudentModel.findByPk(student_id || payment.studentId);
        if (!student) {
            throw new HttpException(404, req.mf('student not found'));
        }

        // Calculate new total paid
        const newDollar = dollar_summa ?? payment.dollarSumma;
        const newKurs = dollar_kurs ?? payment.dollarKurs;
        const newSom = som_summa ?? payment.somSumma;
        const newTotalPaid = (newDollar * newKurs) + newSom;

        // Previous total paid from existing payment
        const oldTotalPaid = (payment.dollarSumma * payment.dollarKurs) + payment.somSumma;

        // Adjust student debt
        if (student_id && student_id !== payment.studentId) {
            // Revert old student's debt
            const oldStudent = await StudentModel.findByPk(payment.studentId);
            oldStudent.qarzSumma += oldTotalPaid;
            await oldStudent.save();

            // Subtract new total from new student
            student.qarzSumma = Math.max(0, student.qarzSumma - newTotalPaid);
            await student.save();
        } else {
            // Adjust current student's debt by the difference
            const difference = newTotalPaid - oldTotalPaid;
            student.qarzSumma = Math.max(0, student.qarzSumma - difference);
            await student.save();
        }

        // Update payment fields
        payment.dollarKurs = newKurs;
        payment.dollarSumma = newDollar;
        payment.somSumma = newSom;
        payment.paySumma = newTotalPaid;
        payment.qarzSumma = student.qarzSumma;

        await payment.save();

        res.send(payment);
    };

    delete = async (req, res, next) => {
        const payment = await PaymentModel.findByPk(req.params.id);
        if (!payment) {
            throw new HttpException(404, req.mf('data not found'));
        }

        await payment.destroy();
        res.send(req.mf('data has been deleted'));
    };
    reportByDateRange = async (req, res, next) => {
        const { datetime1, datetime2 } = req.body;

        if (!datetime1 || !datetime2) {
            throw new HttpException(400, req.mf('datetime1 and datetime2 are required'));
        }

        const payments = await PaymentModel.findAll({
            where: {
                createdAt: {
                    [Op.between]: [new Date(datetime1), new Date(datetime2)]
                }
            },
            include: [{
                model: StudentModel,
                as: 'student',
                attributes: ['fullname'] // replace with actual student name field
            }],
            order: [['createdAt', 'ASC']]
        });

        const report = payments.map(payment => ({
            student_name: payment.student?.fullname,
            dollar_summa: payment.dollarSumma,
            som_summa: payment.somSumma,
            dollar_kurs: payment.dollarKurs
        }));

        res.send(report);
    };

    reportByStudentId = async (req, res, next) => {
        const { student_id, datetime1, datetime2 } = req.body;

        if (!student_id || !datetime1 || !datetime2) {
            throw new HttpException(400, req.mf('student_id, datetime1 and datetime2 are required'));
        }

        const student = await StudentModel.findByPk(student_id);
        if (!student) {
            throw new HttpException(404, req.mf('student not found'));
        }

        const payments = await PaymentModel.findAll({
            where: {
                studentId: student_id,
                createdAt: {
                    [Op.between]: [new Date(datetime1), new Date(datetime2)]
                }
            },
            order: [['createdAt', 'ASC']]
        });

        const report = payments.map(payment => ({

            dollar_summa: payment.dollarSumma,
            som_summa: payment.somSumma,
            dollar_kurs: payment.dollarKurs,
            datetime: payment.createdAt
        }));

        res.send({
            student_name: student.fullName,
            qarzSumma: student.qarzSumma,
            payments: report
        });
    };
}

module.exports = new PaymentController();