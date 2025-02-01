'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lyric extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lyric.belongsTo(models.User, { foreignKey: 'user_id' });
      Lyric.belongsTo(models.Session, { foreignKey: 'session_id' });
    }
  }
  Lyric.init({
    user_id: DataTypes.INTEGER,
    session_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Lyric',
  });
  return Lyric;
};