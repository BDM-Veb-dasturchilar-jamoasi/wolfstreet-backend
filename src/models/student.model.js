const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const GroupModel = require('./group.model');

class StudentModel extends Model { }

StudentModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'phone_number'
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
    qarzSumma: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'qarzSumma'
    },

    // Additional fields
    birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    passport_info: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'passport_info'
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    viloyat: {
        type: DataTypes.ENUM(
            "Andijon",
            "Buxoro",
            "Fargʻona",
            "Jizzax",
            "Xorazm",
            "Namangan",
            "Navoiy",
            "Qashqadaryo",
            "Qoraqalpogʻiston Respublikasi",
            "Samarqand",
            "Sirdaryo",
            "Surxondaryo",
            "Toshkent",
            "Toshkent shahri"
        ),
        allowNull: true,
    },
    above_18: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'above_18'
    },
    parent_fullname: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'parent_fullname'
    },
    parent_phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'parent_phone_number'
    },
    parent_agreement: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'parent_agreement'
    },
    memberofvipchannel: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'memberofvipchannel'
    },
    has_indicator: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'has_indicator'
    },

    // 🔹 New boolean columns
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'isActive'
    },
    isWhite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'isWhite'
    }

}, {
    sequelize,
    modelName: 'StudentModel',
    tableName: 'students',
    timestamps: true
});

// Associations
StudentModel.belongsTo(GroupModel, {
    foreignKey: 'group_id',
    as: 'group'
});

GroupModel.hasMany(StudentModel, {
    foreignKey: 'group_id',
    as: 'students'
});

module.exports = StudentModel;
