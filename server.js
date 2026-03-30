const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const session = require('express-session');

const app = express();

// 🔥 Middleware (ORDEN IMPORTANTE)
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'mi_secreto_super_seguro',
  resave: false,
  saveUninitialized: true
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Conexión a la base de datos
const connection = mysql.createConnection(process.env.MYSQL_URL);

// =======================
// RUTAS
// =======================

// Login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Procesar login
app.post('/login', (req, res) => {
  const { usuario, password } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND password = ?';

  connection.query(sql, [usuario, password], (err, results) => {
    if (err) {
      console.error("Error en DB:", err);
      return res.status(500).send('Error en la base de datos');
    }

    if (results.length > 0) {
      // ✅ Guardar sesión
      req.session.user = usuario;

      // ✅ REDIRECCIÓN (esto arregla tu error)
      return res.redirect('/dashboard');

    } else {
      return res.redirect('/error.html');
    }
  });
});

// Dashboard protegido
app.get('/dashboard', (req, res) => {

  // 🔒 Protección
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.redirect('/login');
});

// =======================
// PUERTO
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor online en puerto ${PORT}`);
});
