'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'investors',
        'isActive',
        {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'investors',
        'isWhite',
        {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('investors', 'isActive', { transaction });
      await queryInterface.removeColumn('investors', 'isWhite', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
