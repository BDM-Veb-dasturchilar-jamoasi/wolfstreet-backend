// migrations/create-group.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('groups', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      scheduleId: {
        type: Sequelize.INTEGER,
        references: { model: 'schedules', key: 'id' },
        field: 'schedule_id',
        allowNull: false,
      },
      teacherId: {
        type: Sequelize.INTEGER,
        references: { model: 'user', key: 'id' },
        field: 'teacher_id',
        allowNull: false,
      },
      adminId: {
        type: Sequelize.INTEGER,
        references: { model: 'user', key: 'id' },
        field: 'admin_id',
        allowNull: false,
      },
      startTime: {
        type: Sequelize.DATEONLY,
        field: 'start_time',
        allowNull: false,
      },
      groupType: {
        type: Sequelize.ENUM('online', 'offline'),
        field: 'group_type',
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('groups');
  }
};