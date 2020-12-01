'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('trails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      summary: {
        type: Sequelize.TEXT
      },
      difficulty: {
        type: Sequelize.TEXT
      },
      stars: {
        type: Sequelize.FLOAT
      },
      location: {
        type: Sequelize.TEXT
      },
      length: {
        type: Sequelize.FLOAT
      },
      high: {
        type: Sequelize.INTEGER
      },
      low: {
        type: Sequelize.INTEGER
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      longitude: {
        type: Sequelize.FLOAT
      },
      ascent: {
        type: Sequelize.INTEGER
      },
      descent: {
        type: Sequelize.INTEGER
      },
      conditionStatus: {
        type: Sequelize.TEXT
      },
      conditionDate: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('trails');
  }
};