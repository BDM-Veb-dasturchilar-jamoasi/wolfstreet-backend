const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const ScheduleModel = require('./schedule.model');
const UserModel = require('./user.model');

class GroupModel extends Model { }

GroupModel.init({
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
    scheduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'schedule_id',
        references: {
            model: 'schedules',
            key: 'id'
        }
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'teacher_id',
        references: {
            model: 'user',
            key: 'id'
        }
    },
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'admin_id',
        references: {
            model: 'user',
            key: 'id'
        }
    },
    startTime: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'start_time'
    },
    groupType: {
        type: DataTypes.ENUM('online', 'offline'),
        allowNull: false,
        field: 'group_type'
    }
}, {
    sequelize,
    modelName: 'GroupModel',
    tableName: 'groups',
    timestamps: true
});

// Associations
GroupModel.belongsTo(ScheduleModel, {
    foreignKey: 'schedule_id',
    as: 'schedule'
});

GroupModel.belongsTo(UserModel, {
    foreignKey: 'teacher_id',
    as: 'teacher'
});

GroupModel.belongsTo(UserModel, {
    foreignKey: 'admin_id',
    as: 'admin'
});

module.exports = GroupModel;
