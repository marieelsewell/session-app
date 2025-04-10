'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config); // creates a new Sequelize instance using the environment variable
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config); // creates a new Sequelize instance using the config file
}

// reads the current directory and filters out the files that are not needed
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes); // requires the model file
    db[model.name] = model; // adds the model to the db object
  });

// iterates over the keys of the db object and calls the associate method on each model
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) { // checks if the model has an associate method
    db[modelName].associate(db); // calls the associate method
  }
});

db.sequelize = sequelize; 
db.Sequelize = Sequelize; 

module.exports = db; 
