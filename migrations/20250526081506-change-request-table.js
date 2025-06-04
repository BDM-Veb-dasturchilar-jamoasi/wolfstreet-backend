'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const table = await queryInterface.describeTable('release_requests');

      // Add admin_comment if it doesn't exist
      if (!table.admin_comment) {
        await queryInterface.addColumn(
          'release_requests',
          'admin_comment',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction }
        );
      }

      // Add scheduled_approval_date if it doesn't exist
      if (!table.scheduled_approval_date) {
        await queryInterface.addColumn(
          'release_requests',
          'scheduled_approval_date',
          {
            type: Sequelize.DATE,
            allowNull: true,
          },
          { transaction }
        );
      }

      // Change ENUM (safe to always run)
      await queryInterface.changeColumn(
        'release_requests',
        'status',
        {
          type: Sequelize.ENUM('pending', 'approved', 'rejected', 'delayed'),
          allowNull: false,
          defaultValue: 'pending',
        },
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const table = await queryInterface.describeTable('release_requests');

      if (table.admin_comment) {
        await queryInterface.removeColumn('release_requests', 'admin_comment', { transaction });
      }

      if (table.scheduled_approval_date) {
        await queryInterface.removeColumn('release_requests', 'scheduled_approval_date', { transaction });
      }

      await queryInterface.changeColumn(
        'release_requests',
        'status',
        {
          type: Sequelize.ENUM('pending', 'approved', 'rejected'),
          allowNull: false,
          defaultValue: 'pending',
        },
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
