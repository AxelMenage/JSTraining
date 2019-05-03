'use strict';

var fs        = require('fs');
var path      = require('path');
const Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var db        = {};
var bcrypt = require('bcrypt');

//Creation del'objet sequelize
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Verifie l'authentification au pret de la base
sequelize
  .authenticate()
  .then(() => {
    console.log('INFO : connection has been established successfully !');
  })
  .catch(err => {
    console.error('ERROR : unable to connect to the database', err);
  });

// Met à jour la base et Ecrase la base si besoin est !
sequelize.sync().then(() => { // {force:true}
    console.log('INFO : connection has been sync successfully !!');
  })
  .catch(err => {
    console.error('ERROR : unable to sync to the database', err);
  });

// Gere le mapping des models avec sequelize + gestion des associations
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;