const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");
require("dotenv").config();

// Initialisation du client WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(), // Sauvegarde des sessions localement
});

// Fonction pour interroger l'API Gemini
async function sendToGemini(userMessage) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const prompt = `Tu es un service client spécialisé dans les bus et les voyages. Pour répondre aux questions des utilisateurs, tu dois toujours consulter les données de l'API disponible à l'adresse suivante : http://localhost:3000/api/schedule. 
        L'utilisateur a dit : "${userMessage}". Analyse la question et utilise uniquement les informations disponibles dans l'API pour fournir une réponse claire, concise et professionnelle. 
        Si une information demandée n'est pas disponible dans l'API, excuse-toi poliment et informe l'utilisateur que les données ne sont pas disponibles. N'invente jamais de réponse.`;

    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts
    ) {
      const generatedText = response.data.candidates[0].content.parts[0].text;
      return generatedText;
    } else {
      return "Réponse inattendue de l'API.";
    }
  } catch (error) {
    console.error(
      "Erreur lors de l'appel à l'API Gemini :",
      error.response?.data || error.message
    );
    return "Il y a eu un problème avec la génération du contenu.";
  }
}

// Affichage du QR code pour scanner avec WhatsApp
client.on("qr", (qr) => {
  console.log("Scan the QR code below to connect:");
  qrcode.generate(qr, { small: true });
});

// Événement lors de la connexion réussie
client.on("ready", () => {
  console.log("✅ WhatsApp bot is ready!");
});

// Événement lors de la réception d’un message
client.on("message", async (message) => {
  console.log(`Message reçu: ${message.body}`);

  // Récupération du nom de l'utilisateur directement via son numéro
  const contact = await client.getContactById(message.from);
  const userName = contact.pushname || contact.name || "Utilisateur";

  if (message.body.toLowerCase() === "bus") {
    // Appel d'API pour récupérer les horaires de bus
    try {
      const response = await axios.get("http://localhost:3000/api/schedule");
      const buses = response.data;

      if (buses.length > 0) {
        let reply = `${userName}, voici les bus et les horaires disponibles :\n\n`;
        buses.forEach((bus) => {
          reply += `🚍 *${bus.name}*\nDépart: ${bus.departure}\nArrivée: ${bus.arrival}\nDate: ${bus.date}\nHeure: ${bus.time}\nPrix: ${bus.price} FCFA\n\n`;
        });
        message.reply(reply);
      } else {
        message.reply("Aucun horaire disponible pour le moment.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des horaires :", error);
      message.reply(
        "❌ Impossible de récupérer les horaires. Réessayez plus tard."
      );
    }
  } else {
    // Si ce n'est pas une demande "Bus", utiliser l'API Gemini pour répondre
    try {
      const geminiResponse = await sendToGemini(message.body);
      message.reply(`${geminiResponse}`);
    } catch (error) {
      console.error("Erreur lors de l'appel à Gemini :", error);
      message.reply(
        "❌ Je n'ai pas pu traiter votre demande. Veuillez réessayer plus tard."
      );
    }
  }
});

// Lancement du client WhatsApp
client.initialize();

module.exports = client;
