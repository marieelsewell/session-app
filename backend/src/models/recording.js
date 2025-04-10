'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recording extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Recording.belongsTo(models.User, { foreignKey: 'user_id' });
      Recording.belongsTo(models.Session, { foreignKey: 'session_id' });
    }
  }
  Recording.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: DataTypes.INTEGER,
    title: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Recording',
  });
  return Recording;
};