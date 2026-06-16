const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorito = sequelize.define('Favorito', { //crea tabla favoritos
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pokemonId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  weight: {
    type: DataTypes.INTEGER
  },
  height: {
    type: DataTypes.INTEGER
  },
  baseExperience: {
    type: DataTypes.INTEGER
  },
  types: { //almacena un array de tipos en formato JSON
    type: DataTypes.JSON
  },
  spriteUrl: {
    type: DataTypes.STRING
  }
});

module.exports = Favorito;