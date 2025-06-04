
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('release_requests', {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        investor_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'investors',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        amount: {
          type: Sequelize.DataTypes.DECIMAL(15, 2),
          allowNull: false
        },
        status: {
          type: Sequelize.DataTypes.ENUM('pending', 'approved', 'rejected'),
          allowNull: false,
          defaultValue: 'pending'
        },
        paytype: {
          type: Sequelize.DataTypes.ENUM('naqd', 'click', 'plastik', 'dollar'),
          allowNull: false
        },
        comment: {
          type: Sequelize.DataTypes.STRING,
          allowNull: true
        },
        datetime: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('release_requests', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
