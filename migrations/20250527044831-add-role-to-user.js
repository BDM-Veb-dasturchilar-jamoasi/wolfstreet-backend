'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn('user', 'role', {
        type: Sequelize.DataTypes.ENUM(
          'Admin',
          'Manager',
          'Teacher',
          'Investor',
          'Programmer',
          'Student',
          'Bugalter',
          'Hodim'
        ),
        allowNull: true,
        defaultValue: 'Admin',
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Revert to previous enum list
      await queryInterface.changeColumn('user', 'role', {
        type: Sequelize.DataTypes.ENUM(
          'Admin',
          'Manager',
          'Teacher',
          'Investor',
          'Programmer',
          'Student'
        ),
        allowNull: true,
        defaultValue: 'Admin',
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
