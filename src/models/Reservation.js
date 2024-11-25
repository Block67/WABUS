const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: uuidv4,
        allowNull: false,
    },
    user: { type: DataTypes.STRING, allowNull: false  },
    seats: {   type: DataTypes.INTEGER,  allowNull: false }, 
    status: {   type: DataTypes.STRING,  defaultValue: 'pending' },
});

module.exports = Reservation;
