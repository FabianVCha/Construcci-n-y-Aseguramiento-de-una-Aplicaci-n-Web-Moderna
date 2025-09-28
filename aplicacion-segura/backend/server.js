
// 1. Importar dependencias
require('dotenv').config(); // Carga las variables de entorno desde.env
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cookieParser = require('cookie-parser');
const db = require('./database/database'); // Se creará en el siguiente capítulo
// 2. Inicializar la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;
// 3. Configurar middleware

app.use(cors({
  origin: "http://localhost:5000", // origen del frontend
  credentials: true
})); // Habilita CORS para todas las rutas
app.use(helmet()); // Establece cabeceras de seguridad HTTP
app.use(express.json()); // Middleware para parsear cuerpos de solicitud JSON
app.use(cookieParser()); // Middleware para parsear cookies
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// 4. Definir rutas (se añadirán más adelante)
app.get('/', (req, res) => {
 res.json({ message: 'API de la aplicación segura funcionando correctamente.' });
});
// 5. Iniciar el servidor
app.listen(PORT, () => {
 console.log(`Servidor escuchando en el puerto ${PORT}`);
})