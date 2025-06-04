// models/attendance.model.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');

const StudentModel = require('./student.model');
const LessonModel = require('./lesson.model');

class AttendanceModel extends Model { }

AttendanceModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'student_id',
        references: {
            model: 'students',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    lessonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'lesson_id',
        references: {
            model: 'lessons',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    attended: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    sequelize,
    modelName: 'AttendanceModel',
    tableName: 'attendances',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['student_id', 'lesson_id'],
            name: 'unique_attendance'
        }
    ]
});

// Associations
AttendanceModel.belongsTo(StudentModel, {
    foreignKey: 'student_id',
    as: 'student'
});

AttendanceModel.belongsTo(LessonModel, {
    foreignKey: 'lesson_id',
    as: 'lesson'
});

StudentModel.hasMany(AttendanceModel, {
    foreignKey: 'student_id',
    as: 'attendances'
});

LessonModel.hasMany(AttendanceModel, {
    foreignKey: 'lesson_id',
    as: 'attendances'
});

module.exports = AttendanceModel;
