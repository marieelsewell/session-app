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
      // define association here
      Recording.belongsTo(models.User, { foreignKey: 'user_id' });
      Recording.belongsTo(models.Session, { foreignKey: 'session_id' });
    }
  }
  Recording.init({
    user_id: DataTypes.INTEGER,
    session_id: DataTypes.INTEGER,
    file_path: DataTypes.STRING,
    duration: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Recording',
  });
  return Recording;
};