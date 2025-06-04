const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const StaffModel = require('./staff.model');

class KassaModel extends Model { }

KassaModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    kassa_type: {
        type: DataTypes.ENUM('kirim', 'chiqim'),
        allowNull: false,
    },
    som_summa: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
    },
    dollar_summa: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
    },
    dollar_kurs: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
    },
    total_dollar_summa: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
    },
    total_som_summa: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
    },
    staff_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: StaffModel,
            key: 'id',
        },
    },
    reason: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'KassaModel',
    tableName: 'kassa',
    timestamps: true,
    paranoid: true,      // enables deletedAt for soft delete
    underscored: true,   // snake_case in DB columns
    indexes: [
        { fields: ['staff_id'] },
        { fields: ['kassa_type'] }
    ],
});

// Associations
KassaModel.belongsTo(StaffModel, { foreignKey: 'staff_id', as: 'staff' });
StaffModel.hasMany(KassaModel, { foreignKey: 'staff_id', as: 'kassaRecords' });

module.exports = KassaModel;
