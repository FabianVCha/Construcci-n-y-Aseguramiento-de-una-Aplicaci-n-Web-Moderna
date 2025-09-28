const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "database.db";
const db = new sqlite3.Database(DBSOURCE, (err) => {
 if (err) {
 // No se puede abrir la base de datos
 console.error(err.message);
 throw err;
 } else {
 console.log('Conectado a la base de datos SQLite.');
 db.serialize(() => {
 // Activar claves foráneas
 db.run('PRAGMA foreign_keys = ON;');
 // Crear tabla de usuarios si no existe
 db.run(`CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 username TEXT NOT NULL UNIQUE,
 password_hash TEXT NOT NULL,
 role TEXT NOT NULL CHECK(role IN ('user', 'admin')) DEFAULT 'user'
 )`, (err) => {
 if (err) {console.error("Error al crear la tabla de usuarios:", err.message);
 }
 });
 // Crear tabla de productos si no existe
 db.run(`CREATE TABLE IF NOT EXISTS products (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 description TEXT,
 owner_id INTEGER NOT NULL,
 FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
 )`, (err) => {
 if (err) {
 console.error("Error al crear la tabla de productos:", err.message);
 }
 });
 });

 const bcrypt = require('bcryptjs');
const saltRounds = 10;
const adminPassword = 'admin_password_123';
const userPassword = 'user_password_123';
bcrypt.hash(adminPassword, saltRounds, (err, adminHash) => {
 if (err) {
 console.error("Error al hashear la contraseña del admin:", err);
 return;
 }
 const adminInsert = 'INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?,?,?)';
 db.run(adminInsert, ['admin', adminHash, 'admin']);
});
bcrypt.hash(userPassword, saltRounds, (err, userHash) => {
 if (err) {
 console.error("Error al hashear la contraseña del usuario:", err);
 return;
 }
 const userInsert = 'INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?,?,?)';
 db.run(userInsert, ['user', userHash, 'user'], function(err) { if (err) {
 console.error(err.message);
 return;
 }
 // Sembrar productos para el usuario normal
 const productInsert = 'INSERT OR IGNORE INTO products (name, description, owner_id) VALUES (?,?,?)';
 db.run(productInsert,);
 db.run(productInsert,);
 });
});



 }
});
module.exports = db;