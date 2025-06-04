const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const ScoringNameModel = require('./scoringnames.model');
const StudentModel = require('./student.model'); // make sure this model exists

class StudentScoreModel extends Model { }

StudentScoreModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    scoringNameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'scoring_names',
            key: 'id'
        }
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'students',
            key: 'id'
        }
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'StudentScoreModel',
    tableName: 'student_scores',
    timestamps: true
});

// Associations
StudentScoreModel.belongsTo(ScoringNameModel, {
    foreignKey: 'scoringNameId',
    as: 'scoringName'
});

StudentScoreModel.belongsTo(StudentModel, {
    foreignKey: 'studentId',
    as: 'student'
});

module.exports = StudentScoreModel;
