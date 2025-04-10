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
      Lyric.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' }); 
    }
  }
  Lyric.init({
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', 
        key: 'id' 
      }
    },
    title: {
      defaultValue: "Untitled",
      type: DataTypes.STRING,
    },
    content: {
      allowNull: false,
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Lyric',
  });
  return Lyric;
};