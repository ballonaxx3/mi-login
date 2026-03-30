const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Para poder leer los datos que envías desde el HTML (formulario)
app.use(express.urlencoded({ extended: true }));

// Conexión a tu base de datos de Railway
// Nota: Asegúrate de tener configuradas tus variables de entorno en Railway
const connection = mysql.createConnection(process.env.DATABASE_URL || {
    host: 'tu_host',
    user: 'tu_usuario',
    password: 'tu_password',
    database: 'tu_base_de_datos'
});

// 1. Mostrar el login al entrar a la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// 2. Ruta para mostrar el Dashboard (el archivo que quieres que vean al entrar)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// 3. Lógica para procesar el inicio de sesión
app.post('/login', (req, res) => {
    const { usuario, password } = req.body;

    // Buscamos en la tabla 'usuarios'
    const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND password = ?';

    connection.query(sql, [usuario, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.send('<h1>Error en la base de datos</h1>');
        }

        if (results.length > 0) {
            // SI EL LOGIN ES EXITOSO: Redirige a /dashboard
            res.redirect('/dashboard');
        } else {
            // SI FALLA: Muestra error
            res.send('<h1>Usuario o contraseña incorrectos</h1>');
        }
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
