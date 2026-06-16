require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const sequelize = require('./config/database'); // Importa la configuración de Sequelize
const Favorito = require('./models/favorito.model'); // Importa el modelo Favorito
const favoritosRouter = require('./routes/favoritos.routes'); // Importa las rutas de favoritos

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:4200/',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
};

//identifica por ip
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                  // máximo 100 peticiones
  message: { error: 'Demasiadas peticiones, intenta más tarde' }
});

app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));

app.use('/favoritos', favoritosRouter);

// Sincronizar BD y arrancar servidor
sequelize.sync({ alter: true }) // Sincroniza modelos con la base de datos (crea tablas si no existen)
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error sincronizando BD:', err);
  });

 
