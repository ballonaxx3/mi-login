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
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Lógica para procesar el inicio de sesión
app.post('/login', (req, res) => {
    const { usuario, password } = req.body;

    // Buscamos en la tabla 'usuarios' que vimos en tu captura
    const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND password = ?';
    
    connection.query(sql, [usuario, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.send('Error en la base de datos');
        }

        if (results.length > 0) {
            res.send(`<h1>¡Bienvenido, ${usuario}! Has iniciado sesión correctamente.</h1>`);
        } else {
            res.send('<h1>Usuario o contraseña incorrectos.</h1><a href="/">Volver</a>');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});