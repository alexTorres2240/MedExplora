import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

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

export default defineEventHandler((event) => {
  const q = getQuery(event)
  const email = (q.email || '').toLowerCase()
  if (!email) return { exists: false }
  const users = loadUsers()
  return { exists: !!users[email] }
})