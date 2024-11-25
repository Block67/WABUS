const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// Initialisation du client WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(), // Sauvegarde des sessions localement
});

// Affichage du QR code pour scanner avec WhatsApp
client.on('qr', (qr) => {
    console.log('Scan the QR code below to connect:');
    qrcode.generate(qr, { small: true });
});

// Événement lors de la connexion réussie
client.on('ready', () => {
    console.log('✅ WhatsApp bot is ready!');
});

// Événement lors de la réception d’un message
client.on('message', async (message) => {
    console.log(`Message received: ${message.body}`);

    if (message.body.toLowerCase() === 'bus') {
        // Appel API pour récupérer les horaires de bus
        try {
            const response = await axios.get('http://localhost:3000/api/schedule');
            const buses = response.data;

            if (buses.length > 0) {
                let reply = '🚌 Bus disponible:\n\n';
                buses.forEach((bus) => {
                    reply += `🚍 *${bus.name}*\nDépart: ${bus.departure}\nArrivé: ${bus.arrival}\nDate: ${bus.date}\nHeure: ${bus.time}\nPrix: ${bus.price} FCFA\n\n`;
                });
                message.reply(reply);
            } else {
                message.reply('Aucun horaire disponible pour le moment.');
            }
        } catch (error) {
            console.error('Error fetching Bus:', error);
            message.reply('❌ Impossible de récupérer les horaires. Réessayez plus tard.');
        }
    } else {
        // Réponse générique
        message.reply('Je n’ai pas compris votre message. Envoyez "bus" pour voir les horaires de bus.');
    }
});

// Lancement du client WhatsApp
client.initialize();

module.exports = client;
