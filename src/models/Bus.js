const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { v4: uuidv4 } = require('uuid');

const Bus = sequelize.define("Bus", {
  id: { 
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: uuidv4,
    allowNull: false,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  departure: { type: DataTypes.STRING, allowNull: false },
  arrival: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.TIME, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  availableSeats: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Bus;
