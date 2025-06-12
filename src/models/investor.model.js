const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const UserModel = require('./user.model');

class InvestorModel extends Model { }

InvestorModel.init({
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
            model: 'user',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    fullname: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    isWhite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'InvestorModel',
    tableName: 'investors',
    timestamps: true
});

// Associations
InvestorModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user'
});

UserModel.hasOne(InvestorModel, {
    foreignKey: 'user_id',
    as: 'investor'
});

module.exports = InvestorModel;
