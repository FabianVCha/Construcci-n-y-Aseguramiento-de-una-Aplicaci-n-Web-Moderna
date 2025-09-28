const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
 const token = req.cookies.token;
 if (!token) {
 return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
 }
 try {
 const decoded = jwt.verify(token, process.env.JWT_SECRET);
 req.user = decoded; // Añade el payload del token a la solicitud
 next();
 } catch (error) {
 res.status(400).json({ error: 'Token inválido.' });
 }
};
module.exports = { verifyToken };