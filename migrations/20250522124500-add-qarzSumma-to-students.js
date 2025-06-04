'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('students', 'qarzSumma', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'qarz_summa', // Optional: Use this if you're following snake_case in DB
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('students', 'qarzSumma');
  }
};
