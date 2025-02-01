'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SessionComponent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SessionComponent.belongsTo(models.Session, { foreignKey: 'session_id' });
    }
  }
  SessionComponent.init({
    session_id: DataTypes.INTEGER,
    component_type: DataTypes.ENUM('lyric', 'chord', 'recording'),
    component_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SessionComponent',
  });
  return SessionComponent;
};