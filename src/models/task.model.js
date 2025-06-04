const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const StaffModel = require('./staff.model');
const UserModel = require('./user.model');

class TaskModel extends Model { }

TaskModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    task: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    datetime: {
        type: DataTypes.BIGINT, // Unix timestamp (in seconds)
        allowNull: false,
        defaultValue: () => Math.floor(Date.now() / 1000)
    },
    staff_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: StaffModel,
            key: 'id'
        }
    },
    staff_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserModel,
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'TaskModel',
    tableName: 'tasks',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        { fields: ['staff_id'] },
        { fields: ['staff_user_id'] }
    ]
});

// Associations
TaskModel.belongsTo(StaffModel, { foreignKey: 'staff_id', as: 'staff' });
TaskModel.belongsTo(UserModel, { foreignKey: 'staff_user_id', as: 'user' });

module.exports = TaskModel;
