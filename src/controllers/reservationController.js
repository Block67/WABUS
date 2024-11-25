const { Bus, Reservation } = require('../models');

// Obtention des horaires des bus
exports.getSchedules = async (req, res) => {
    try {
        const buses = await Bus.findAll();
        res.json(buses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch schedules' });
    }
};

// Crée une réservation
exports.createReservation = async (req, res) => {
    try {
        const { user, busId, seats } = req.body;

        const bus = await Bus.findByPk(busId);
        if (!bus || bus.availableSeats < seats) {
            return res.status(400).json({ error: 'Not enough seats available or bus not found' });
        }

        const reservation = await Reservation.create({ user, busId, seats });
        bus.availableSeats -= seats;
        await bus.save();

        res.json({ message: 'Reservation created!', reservation });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create reservation' });
    }
};
