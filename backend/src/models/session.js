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
      Session.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      Session.hasMany(models.Recording, { foreignKey: 'session_id', onDelete: 'CASCADE' });
      Session.hasMany(models.SessionComponent, { foreignKey: 'session_id', onDelete: 'CASCADE' });
    }
  }
  Session.init({
    user_id: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Untitled'
    }
  }, {
    sequelize,
    modelName: 'Session',
  });
  return Session;
};