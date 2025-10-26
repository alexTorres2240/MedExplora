import pool from '../../utils/db.js'; // Importamos nuestra conexión a la BD
import bcrypt from 'bcrypt';         // Importamos bcrypt para comparar

export default defineEventHandler(async (event) => {
    let connection;

    try {
        // 1. Leer los datos que vienen del formulario
        const body = await readBody(event);
        const { email, password } = body;

        // 2. Validar que tengamos todo
        if (!email || !password) {
            throw createError({
                statusCode: 400, // 400 Bad Request
                statusMessage: 'Email y contraseña son requeridos.',
            });
        }

        // 3. Obtener una conexión del 'pool'
        connection = await pool.getConnection();

        // 4. Buscar al usuario por su email
        const sql = "SELECT * FROM users WHERE email = ?";
        const [rows] = await connection.execute(sql, [email]);

        // 5. Verificar si el usuario existe
        if (rows.length === 0) {
            // Por seguridad, damos un mensaje genérico.
            throw createError({
                statusCode: 401, // 401 Unauthorized
                statusMessage: 'Email o contraseña incorrectos.'
            });
        }

        const user = rows[0];

        // 6. Comparar la contraseña ingresada con la guardada en la BD
        const match = await bcrypt.compare(password, user.password);

        // 7. Verificar si la contraseña coincide
        if (!match) {
            throw createError({
                statusCode: 401, // 401 Unauthorized
                statusMessage: 'Email o contraseña incorrectos.'
            });
        }

        // 8. ¡Inicio de sesión exitoso!
        // ¡IMPORTANTE! Nunca devuelvas la contraseña al frontend.
        delete user.password;

        return {
            statusCode: 200,
            message: 'Inicio de sesión exitoso',
            user: user // Devolvemos los datos del usuario (id, name, email)
        };

    } catch (error) {
        // Manejo de errores
        console.error('Error en login:', error);

        // Si el error ya tiene un statusCode (como los que creamos), relánzalo
        if (error.statusCode) {
            throw error;
        }

        // Si es un error inesperado del servidor
        throw createError({
            statusCode: 500,
            statusMessage: 'Error interno del servidor.',
        });

    } finally {
        // 9. ¡MUY IMPORTANTE! Liberar la conexión
        if (connection) {
            connection.release();
        }
    }
});