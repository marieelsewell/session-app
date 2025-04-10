'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChordProgressions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', 
          key: 'id' 
        },
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      chords: {
        type: Sequelize.TEXT, 
        allowNull: false,
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tempo: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rhythm: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      scaleType: {
        type: Sequelize.STRING,
        allowNull: false,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ChordProgressions');
  }
};