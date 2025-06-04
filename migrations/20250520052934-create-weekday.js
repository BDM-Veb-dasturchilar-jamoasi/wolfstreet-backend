
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('weekdays', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });


    const weekdays = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    const now = new Date();
    await queryInterface.bulkInsert('weekdays', weekdays.map(name => ({
      name,
      createdAt: now,
      updatedAt: now,
    })));
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('weekdays');
  }
};