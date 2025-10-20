import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import bcrypt from 'bcryptjs'
import { createError, sendError } from 'h3'

const DATA_FILE = join(process.cwd(), 'data', 'users.json')

function loadUsers() {
  if (!existsSync(DATA_FILE)) return {}
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8') || '{}')
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const email = (body.email || '').toLowerCase()
    const password = body.password
    if (!email || !password) return sendError(event, createError({ statusCode: 400, statusMessage: 'Faltan credenciales' }))

    const users = loadUsers()
    const user = users[email]
    if (!user) return sendError(event, createError({ statusCode: 401, statusMessage: 'Usuario no registrado' }))

    const ok = bcrypt.compareSync(password, user.passwordHash)
    if (!ok) return sendError(event, createError({ statusCode: 401, statusMessage: 'Credenciales inválidas' }))

    // En producción devolver token/session; aquí devolvemos objeto simple
    return { ok: true, message: 'Ingreso exitoso' }
  } catch (err) {
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Error interno' }))
  }
})