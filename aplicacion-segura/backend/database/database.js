const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const DBSOURCE = "database.db";
const saltRounds = 10;

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error("Error al abrir la base de datos:", err.message);
    throw err;
  } else {
    console.log('Conectado a la base de datos SQLite.');

    db.serialize(() => {
      // Activar claves foráneas
      db.run('PRAGMA foreign_keys = ON;');

      // Crear tabla de usuarios
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('user', 'admin')) DEFAULT 'user'
      )`);

      // Crear tabla de productos
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        owner_id INTEGER NOT NULL,
        FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
      )`);

      // Sembrar datos DESPUÉS de asegurar que las tablas existen
      db.run("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", async (err, row) => {
        if (row) {
          try {
            const adminHash = await bcrypt.hash('admin_password_123', saltRounds);
            const userHash = await bcrypt.hash('user_password_123', saltRounds);

            const insertUser = 'INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?,?,?)';
            db.run(insertUser, ['admin', adminHash, 'admin']);
            db.run(insertUser, ['user', userHash, 'user'], function (err) {
              if (!err) {
                const insertProduct = 'INSERT OR IGNORE INTO products (name, description, owner_id) VALUES (?,?,?)';
                db.run(insertProduct, ['Laptop del Usuario', 'Ejemplo de laptop', this.lastID]);
                db.run(insertProduct, ['Celular del Usuario', 'Ejemplo de celular', this.lastID]);
              }
            });

          } catch (e) {
            console.error("Error al hashear contraseñas:", e);
          }
        }
      });
    });
  }
});

module.exports = db;
