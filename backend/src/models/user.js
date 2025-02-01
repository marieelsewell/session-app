'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Session, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      User.hasMany(models.Lyric, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      User.hasMany(models.Recording, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      User.hasMany(models.ChordProgression, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};