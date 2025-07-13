// require('dotenv').config();
const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
const usuarios = require('./src/routes/usuario.js');
const items = require('./src/routes/items.js');

const atletas = require('./src/routes/perfilAtleta.js');


// Middleware de rutas
app.use('/api/usuario', usuarios);
app.use('/api/item', items);
app.use('/api/atleta', atletas);



// Conexión y servidor
const PORT = process.env.PORT || 2436;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ Conectado a MongoDB Compas y Atlas ⛈️'))
        .catch(err => console.error('❌ Error al conectar a MongoDB Atlas:', err));
}); 
