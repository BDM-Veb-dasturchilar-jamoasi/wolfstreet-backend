'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('students', 'birthdate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('students', 'passport_info', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('students', 'img', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('students', 'viloyat', {
      type: Sequelize.ENUM(
        "Andijon",
        "Buxoro",
        "Fargʻona",
        "Jizzax",
        "Xorazm",
        "Namangan",
        "Navoiy",
        "Qashqadaryo",
        "Qoraqalpogʻiston Respublikasi",
        "Samarqand",
        "Sirdaryo",
        "Surxondaryo",
        "Toshkent",
        "Toshkent shahri"
      ),
      allowNull: true,
    });

    await queryInterface.addColumn('students', 'above_18', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('students', 'parent_fullname', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('students', 'parent_phone_number', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('students', 'parent_agreement', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('students', 'birthdate');
    await queryInterface.removeColumn('students', 'passport_info');
    await queryInterface.removeColumn('students', 'img');
    await queryInterface.removeColumn('students', 'viloyat');
    await queryInterface.removeColumn('students', 'above_18');
    await queryInterface.removeColumn('students', 'parent_fullname');
    await queryInterface.removeColumn('students', 'parent_phone_number');
    await queryInterface.removeColumn('students', 'parent_agreement');

    // For Postgres: drop the ENUM type created for viloyat
    // await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_students_viloyat";');
  }
};
