'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Recordings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', 
          key: 'id' 
        }
      },
      session_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Sessions', 
          key: 'id' 
        }
      },
      file_path: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Recordings');
  }
};