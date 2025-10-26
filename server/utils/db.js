import mysql from 'mysql2/promise';

// Creamos un "pool" de conexiones.
// Esto es más eficiente que crear una conexión nueva cada vez.
const pool = mysql.createPool({
    host: '127.0.0.1',   // 'localhost' a veces da problemas, '127.0.0.1' es más seguro.
    user: 'root',        // Usuario por defecto en XAMPP
    password: '',        // Contraseña por defecto en XAMPP (vacía)
    database: 'medexplora_db', // La base de datos que creamos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exportamos la conexión para poder usarla en otros archivos
export default pool;