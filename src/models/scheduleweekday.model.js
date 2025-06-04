const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');

class ScheduleWeekdayModel extends Model { }

ScheduleWeekdayModel.init({
    scheduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'schedule_id',
        references: {
            model: 'schedules',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    weekdayId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'weekday_id',
        references: {
            model: 'weekdays',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    sequelize,
    modelName: 'ScheduleWeekdayModel',
    tableName: 'schedule_weekdays',
    timestamps: true
});

module.exports = ScheduleWeekdayModel;
