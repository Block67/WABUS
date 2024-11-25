const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Routes pour les réservations
router.post('/reserve', reservationController.createReservation);
router.get('/schedule', reservationController.getSchedules);

module.exports = router;
