const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const InvestorModel = require('./investor.model');

class PrixodModel extends Model { }

PrixodModel.init({
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
    summa: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    datetime: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'PrixodModel',
    tableName: 'prixods',
    timestamps: true // includes createdAt and updatedAt
});

// Associations
PrixodModel.belongsTo(InvestorModel, {
    foreignKey: 'investor_id',
    as: 'investor'
});

InvestorModel.hasMany(PrixodModel, {
    foreignKey: 'investor_id',
    as: 'prixods'
});

module.exports = PrixodModel;
