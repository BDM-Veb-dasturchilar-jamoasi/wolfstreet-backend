const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const UserModel = require('./user.model');

class StaffModel extends Model { }

StaffModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserModel,
            key: 'id'
        }
    },
    fixed_salary: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
    },
    kpi_summa: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'StaffModel',
    tableName: 'staff',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['user_id']
        }
    ]
});

// Associations
StaffModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });
UserModel.hasOne(StaffModel, { foreignKey: 'user_id', as: 'staff' });

module.exports = StaffModel;