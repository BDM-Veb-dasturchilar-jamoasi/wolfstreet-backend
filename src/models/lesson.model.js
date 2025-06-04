const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const GroupModel = require('./group.model');

class LessonModel extends Model { }

LessonModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'group_id',
        references: {
            model: 'groups',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    sequenceNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'sequence_number'
    }
}, {
    sequelize,
    modelName: 'LessonModel',
    tableName: 'lessons',
    timestamps: true
});

// Association
LessonModel.belongsTo(GroupModel, {
    foreignKey: 'group_id',
    as: 'group'
});

GroupModel.hasMany(LessonModel, {
    foreignKey: 'group_id',
    as: 'lessons'
});

module.exports = LessonModel;
