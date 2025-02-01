'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChordProgressionChords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      chord_progression_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ChordProgressions', 
          key: 'id' 
        }
      },
      chord_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Chords', 
          key: 'id' 
        }
      },
      order_position: {
        type: Sequelize.INTEGER
      },
      duration_ms: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('ChordProgressionChords');
  }
};