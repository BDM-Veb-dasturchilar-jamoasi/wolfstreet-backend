const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const InvestorModel = require('./investor.model');

class ReleaseRequestModel extends Model { }

ReleaseRequestModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    investor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'investors',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'delayed'),
        defaultValue: 'pending',
        allowNull: false
    },
    paytype: {
        type: DataTypes.ENUM('naqd', 'click', 'plastik', 'dollar'),
        allowNull: false
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    admin_comment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    scheduled_approval_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    datetime: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'ReleaseRequestModel',
    tableName: 'release_requests',
    timestamps: true
});

// Associations
ReleaseRequestModel.belongsTo(InvestorModel, {
    foreignKey: 'investor_id',
    as: 'investor'
});

InvestorModel.hasMany(ReleaseRequestModel, {
    foreignKey: 'investor_id',
    as: 'release_requests'
});

module.exports = ReleaseRequestModel;
