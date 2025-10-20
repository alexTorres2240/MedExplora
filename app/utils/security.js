import bcrypt from 'bcryptjs';

let _cachedDomains = null;
let _lastFetched = 0;
const CACHE_TTL_MS = 30 * 1000; // ajustar según necesidad

export async function loadAllowedDomains() {
  const now = Date.now();
  if (_cachedDomains && (now - _lastFetched) < CACHE_TTL_MS) return _cachedDomains;

  try {
    const res = await fetch('/allowed-domains.json', { cache: 'no-store' });
    if (!res.ok) {
      console.warn('[security] no se pudo cargar /allowed-domains.json:', res.status);
      _cachedDomains = [];
      _lastFetched = now;
      return _cachedDomains;
    }
    const json = await res.json();
    if (Array.isArray(json.domains)) {
      _cachedDomains = json.domains.map(d => d.toLowerCase());
      _lastFetched = now;
      return _cachedDomains;
    }
  } catch (e) {
    console.warn('[security] error cargando allowed-domains.json', e);
  }

  // fallback seguro: lista vacía (bloquea hasta corregir)
  _cachedDomains = [];
  _lastFetched = now;
  return _cachedDomains;
}

export async function validateInstitutionalEmail(email) {
  if (!email || typeof email !== 'string') return { ok: false, reason: 'email inválido' };
  const emailLower = email.trim().toLowerCase();
  const m = emailLower.match(/^([^@]+)@([^@]+)$/);
  if (!m) return { ok: false, reason: 'formato de correo inválido' };
  const domain = m[2];

  // validación sintáctica básica del dominio
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) return { ok: false, reason: 'dominio sintácticamente inválido' };

  const domains = await loadAllowedDomains();
  // permitir coincidencia exacta o por subdominio: estudiante.uabc.edu.mx -> uabc.edu.mx
  const allowed = domains.includes(domain) || domains.some(d => domain === d || domain.endsWith('.' + d));
  return { ok: !!allowed, reason: allowed ? null : 'dominio no permitido' };
}

export function validatePasswordStrength(password) {
  const errors = [];
  if (!password || password.length < 8) errors.push('mínimo 8 caracteres');
  if (!/[a-z]/.test(password)) errors.push('debe contener letra minúscula');
  if (!/[A-Z]/.test(password)) errors.push('debe contener letra mayúscula');
  if (!/[0-9]/.test(password)) errors.push('debe contener un número');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('debe contener un carácter especial');
  return { ok: errors.length === 0, errors };
}

export async function hashPassword(plain) {
  if (typeof plain !== 'string') throw new Error('contraseña inválida');
  const saltRounds = 10; // ajustable; en servidor puede ser mayor
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(plain, salt);
}

export async function verifyPassword(plain, hash) {
  if (typeof plain !== 'string' || typeof hash !== 'string') return false;
  try {
    return bcrypt.compareSync(plain, hash);
  } catch {
    return false;
  }
}