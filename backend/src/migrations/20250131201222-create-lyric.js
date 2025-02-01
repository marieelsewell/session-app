'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Lyrics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        defaultValue: 444,
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
      title: {
        defaultValue: "Untitled",
        type: Sequelize.STRING
      },
      content: {
        allowNull: false,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Lyrics');
  }
};