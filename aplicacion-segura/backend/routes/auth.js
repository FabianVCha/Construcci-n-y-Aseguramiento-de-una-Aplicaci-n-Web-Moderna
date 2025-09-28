const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Endpoint de registro
router.post('/register', (req, res) => {
 const { username, password } = req.body;
 if (!username ||!password) {
 return res.status(400).json({ error: 'Se requieren nombre de usuario y contraseña.' });
 }
 const saltRounds = 10;
 bcrypt.hash(password, saltRounds, (err, hash) => {
 if (err) {
 return res.status(500).json({ error: 'Error al hashear la contraseña.' });
 }
 const sql = 'INSERT INTO users (username, password_hash) VALUES (?,?)';
 const params = [username, hash];
 db.run(sql, params, function(err) {
 if (err) {
 return res.status(400).json({ error: 'El nombre de usuario ya existe.' });
 }
 res.status(201).json({
 message: 'Usuario registrado con éxito.',
 userId: this.lastID
 });
 });
 });
});
module.exports = router;

// Endpoint de inicio de sesión
router.post('/login', (req, res) => {
 const { username, password } = req.body;
 if (!username ||!password) {
 return res.status(400).json({ error: 'Se requieren nombre de usuario y contraseña.' });
 }
 const sql = 'SELECT * FROM users WHERE username =?';
 db.get(sql, [username], (err, user) => {
 if (err ||!user) {
 return res.status(401).json({ error: 'Credenciales inválidas.' });
 }
 bcrypt.compare(password, user.password_hash, (err, result) => {
 if (err ||!result) {
 return res.status(401).json({ error: 'Credenciales inválidas.' });}
 // Credenciales válidas, generar JWT
 const payload = { id: user.id, role: user.role };
 const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
 res.cookie('token', token, {
 httpOnly: true, // La cookie no es accesible por JavaScript
 secure: process.env.NODE_ENV === 'production', // Solo enviar sobre HTTPS en producción
 sameSite: 'strict' // Mitigación de CSRF
 });
 res.status(200).json({ message: 'Inicio de sesión exitoso.' });
 });
 });
});

module.exports = router;