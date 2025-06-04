
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentId: {
        type: Sequelize.INTEGER,
        references: { model: 'students', key: 'id' },
        field: 'student_id',
        allowNull: false,
      },
      paySumma: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'pay_summa',
        allowNull: false,
      },
      dollarKurs: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'dollar_kurs',
        allowNull: false,
      },
      dollarSumma: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'dollar_summa',
        allowNull: false,
      },
      somSumma: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'som_summa',
        allowNull: false,
      },
      qarzSumma: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'qarz_summa',
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('payments');
  }
};