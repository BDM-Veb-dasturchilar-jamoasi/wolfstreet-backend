
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('schedule_weekdays', {
      scheduleId: {
        type: Sequelize.INTEGER,
        references: { model: 'schedules', key: 'id' },
        field: 'schedule_id',
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      weekdayId: {
        type: Sequelize.INTEGER,
        references: { model: 'weekdays', key: 'id' },
        field: 'weekday_id',
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('schedule_weekdays');
  }
};