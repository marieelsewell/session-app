'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChordProgressionChord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChordProgressionChord.belongsTo(models.ChordProgression, { foreignKey: 'chord_progression_id' });
      ChordProgressionChord.belongsTo(models.Chord, { foreignKey: 'chord_id' });
    }
  }
  ChordProgressionChord.init({
    chord_progression_id: DataTypes.INTEGER,
    chord_id: DataTypes.INTEGER,
    order_position: DataTypes.INTEGER,
    duration_ms: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ChordProgressionChord',
  });
  return ChordProgressionChord;
};