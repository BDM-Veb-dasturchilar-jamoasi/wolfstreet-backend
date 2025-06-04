const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const StudentModel = require('./student.model');

class PaymentModel extends Model { }

PaymentModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'student_id',
        references: {
            model: 'students',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    paySumma: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'pay_summa'
    },
    dollarKurs: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'dollar_kurs'
    },
    dollarSumma: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'dollar_summa'
    },
    somSumma: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'som_summa'
    },
    qarzSumma: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'qarz_summa'
    }
}, {
    sequelize,
    modelName: 'PaymentModel',
    tableName: 'payments',
    timestamps: true
});

// Associations
PaymentModel.belongsTo(StudentModel, {
    foreignKey: 'student_id',
    as: 'student'
});

StudentModel.hasMany(PaymentModel, {
    foreignKey: 'student_id',
    as: 'payments'
});

module.exports = PaymentModel;

