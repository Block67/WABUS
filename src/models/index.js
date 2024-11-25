const { sequelize } = require('../config/database');
const Bus = require('./Bus');
const Reservation = require('./Reservation');

// Les relations
Reservation.belongsTo(Bus, { foreignKey: 'busId' });
Bus.hasMany(Reservation, { foreignKey: 'busId' });

const initModels = async () => {
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
};

module.exports = { Bus, Reservation, initModels };
