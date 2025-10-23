import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import bcrypt from 'bcryptjs'
import { createError, sendError } from 'h3'

const DATA_FILE = join(process.cwd(), 'data', 'users.json')

function ensureDataFile() {
  const dir = join(process.cwd(), 'data')
  if (!existsSync(dir)) mkdirSync(dir)
  if (!existsSync(DATA_FILE)) writeFileSync(DATA_FILE, JSON.stringify({}), 'utf-8')
}

function loadUsers() {
  ensureDataFile()
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8') || '{}')
}
function saveUsers(u) {
  writeFileSync(DATA_FILE, JSON.stringify(u, null, 2), 'utf-8')
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const email = (body.email || '').toLowerCase()
    if (!email || (!body.password && !body.passwordHash)) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Faltan campos' }))
    }

    const users = loadUsers()
    if (users[email]) {
      return sendError(event, createError({ statusCode: 409, statusMessage: 'Usuario ya existe' }))
    }

    // generar hash si se envió password en texto (recomendado hacerlo en servidor)
    let hash = body.passwordHash
    if (!hash && body.password) {
      const salt = bcrypt.genSaltSync(10)
      hash = bcrypt.hashSync(body.password, salt)
    }
    if (!hash) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'No se proporcionó hash/contraseña' }))
    }

    users[email] = {
      passwordHash: hash,
      nombre: body.nombre || '',
      apellido: body.apellido || '',
      createdAt: Date.now()
    }
    saveUsers(users)
    return { statusCode: 201, ok: true, message: 'Registrado' }
  } catch (err) {
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Error interno' }))
  }
})