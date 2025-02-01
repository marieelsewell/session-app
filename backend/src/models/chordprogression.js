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
      ChordProgression.hasMany(models.ChordProgressionChord, { foreignKey: 'chord_progression_id', onDelete: 'CASCADE' });
    }
  }
  ChordProgression.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    key: DataTypes.STRING,
    tempo: DataTypes.INTEGER,
    instrument: DataTypes.STRING,
    loop_enabled: DataTypes.BOOLEAN,
    loop_count: DataTypes.INTEGER,
    audio_file: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ChordProgression',
  });
  return ChordProgression;
};