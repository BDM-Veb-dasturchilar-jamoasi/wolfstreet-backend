const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');

class ScheduleModel extends Model { }

ScheduleModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    number_of_lessons: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'number_of_lessons'
    }
}, {
    sequelize,
    modelName: 'ScheduleModel',
    tableName: 'schedules',
    timestamps: true
});





module.exports = ScheduleModel;