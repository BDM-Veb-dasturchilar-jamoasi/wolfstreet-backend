const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const InvestorModel = require('./investor.model');

class RasxodModel extends Model { }

RasxodModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    investor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'investors',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    foyda_summa: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        defaultValue: null
    },
    zarar_summa: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        defaultValue: null
    },

    datetime: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'RasxodModel',
    tableName: 'chiqims',
    timestamps: true
});

// Associations
RasxodModel.belongsTo(InvestorModel, {
    foreignKey: 'investor_id',
    as: 'investor'
});

InvestorModel.hasMany(RasxodModel, {
    foreignKey: 'investor_id',
    as: 'chiqims'
});

module.exports = RasxodModel;
