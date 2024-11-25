const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');
const { initModels } = require('./models');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Connecter MySQL
connectDB();
initModels();

// Routes API
app.use('/api', require('./routes/api'));

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
