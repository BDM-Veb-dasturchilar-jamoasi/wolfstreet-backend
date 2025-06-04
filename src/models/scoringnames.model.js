const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');

class ScoringNameModel extends Model { }

ScoringNameModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'ScoringNameModel',
    tableName: 'scoring_names',
    timestamps: true // to match createdAt and updatedAt in your migration
});

module.exports = ScoringNameModel;
