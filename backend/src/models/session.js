'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Session.belongsTo(models.User, { foreignKey: 'user_id' });
      Session.hasMany(models.Lyric, { foreignKey: 'session_id', onDelete: 'SET NULL' });
      Session.hasMany(models.Recording, { foreignKey: 'session_id', onDelete: 'SET NULL' });
      Session.hasMany(models.SessionComponent, { foreignKey: 'session_id', onDelete: 'CASCADE' });
    }
  }
  Session.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Session',
  });
  return Session;
};