const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');

class WeekdayModel extends Model { }

WeekdayModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'WeekdayModel',
    tableName: 'weekdays',
    timestamps: true
});



module.exports = WeekdayModel;