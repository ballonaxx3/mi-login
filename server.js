const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Para poder leer los datos que envías desde el HTML
app.use(express.urlencoded({ extended: true }));

// Conexión a tu base de datos de Railway
// Usamos la variable de entorno que Railway te da automáticamente
const connection = mysql.createConnection(process.env.MYSQL_URL);

// Mostrar el login al entrar a la página
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Lógica para procesar el inicio de sesión
app.post('/login', (req, res) => {
  const { usuario, password } = req.body;

  // Buscamos en la tabla 'usuarios' que vimos en tu base de datos
  const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND password = ?';

  connection.query(sql, [usuario, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.send('Error en la base de datos');
    }

    if (results.length > 0) {
      res.sendFile(path.join(__dirname, 'dashboard.html'));
    } else {
      res.sendFile(path.join(__dirname, 'erro.html'));
    }
  });
});
// 1. Servir archivos estáticos (por si tu HTML usa CSS o imágenes)
app.use(express.static(path.join(__dirname)));

// 2. Ruta raíz (opcional: para que no de error al entrar a la URL principal)
app.get('/', (req, res) => {
  res.redirect('/login');
});

// 3. ¡EL PASO MÁS IMPORTANTE PARA RAILWAY!
// Usamos process.env.PORT para que Railway le asigne el puerto correcto
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor funcionando en el puerto ${PORT}`);
});
