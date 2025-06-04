
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('attendances', {
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
      lessonId: {
        type: Sequelize.INTEGER,
        references: { model: 'lessons', key: 'id' },
        field: 'lesson_id',
        allowNull: false,
      },
      attended: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });


    await queryInterface.addConstraint('attendances', {
      fields: ['student_id', 'lesson_id'],
      type: 'unique',
      name: 'unique_attendance'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint('attendances', 'unique_attendance');
    await queryInterface.dropTable('attendances');
  }
};