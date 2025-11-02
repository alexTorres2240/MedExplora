import pool from '../../utils/db.js';
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
    let connection;

    try {
        // 1. Leer los datos (ahora coinciden con el formulario corregido)
        const body = await readBody(event);
        const { name, apellido, email, password } = body; // <-- ¡Actualizado!

        // 2. Validar que tengamos todo
        if (!name || !apellido || !email || !password) { // <-- ¡Actualizado!
            throw createError({
                statusCode: 400,
                message: 'Faltan campos obligatorios (nombre, apellido, email o contraseña).',
            });
        }

        // 3. Encriptar la contraseña (el servidor lo hace)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Obtener una conexión del 'pool'
        connection = await pool.getConnection();

        // 5. Preparar la consulta SQL (con la nueva columna 'apellido')
        const sql = "INSERT INTO users (name, apellido, email, password) VALUES (?, ?, ?, ?)"; // <-- ¡Actualizado!

        // 6. Ejecutar la consulta
        const [result] = await connection.execute(sql, [name, apellido, email, hashedPassword]); // <-- ¡Actualizado!

        // 7. Si todo sale bien, devolvemos un éxito
        return {
            statusCode: 201, // 201 Created
            message: '¡Usuario registrado con éxito!', // <-- Este es el mensaje que debes ver
            userId: result.insertId
        };

    } catch (error) {
        // Manejo de errores
        console.error('Error al registrar usuario:', error);
        console.error('Error al registrar usuario:');
        console.error('Mensaje:', error.message);
        console.error('Código:', error.code);
        console.error('Stack:', error.stack);

        // Error común: email duplicado
        if (error.code === 'ER_DUP_ENTRY') {
            throw createError({
                statusCode: 409, // 409 Conflict
                message: 'El correo electrónico ya está registrado.',
            });
        }

        // Otro error
        throw createError({
            statusCode: 500, // 500 Internal Server Error
            message: 'Error interno del servidor al registrar el usuario.',
        });

    } finally {
        // 8. ¡MUY IMPORTANTE! Liberar la conexión
        if (connection) {
            connection.release();
        }
    }
});