'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChordProgression extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChordProgression.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  ChordProgression.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chords: {
      type: DataTypes.TEXT, 
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tempo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rhythm: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scaleType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ChordProgression',
  });
  return ChordProgression;
};