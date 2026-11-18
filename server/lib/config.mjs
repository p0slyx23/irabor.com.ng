import { readFileSync } from 'node:fs'

export function getDatabaseConfig(env = process.env) {
  const value = env.MYSQL_URL || env.DATABASE_URL
  if (!value) throw new Error('Set MYSQL_URL in server/.env or Railway Variables.')

  let url
  try {
    url = new URL(value)
    if (url.protocol !== 'mysql:' || !url.hostname || !url.username || url.search || url.hash) {
      throw new Error('invalid')
    }
    const database = decodeURIComponent(url.pathname.slice(1))
    const port = Number(url.port || 3306)
    if (!database || database.includes('/') || !Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error('invalid')
    }
    const config = {
      host: url.hostname.replace(/^\[|\]$/g, ''),
      port,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database,
      charset: 'utf8mb4',
      timezone: 'Z',
      connectTimeout: 10000,
      multipleStatements: false,
      enableKeepAlive: true,
    }
    if (env.MYSQL_SSL && !['true', 'false'].includes(env.MYSQL_SSL)) {
      throw new Error('invalid')
    }
    if (env.MYSQL_SSL_CA_FILE && env.MYSQL_SSL !== 'true') {
      throw new Error('invalid')
    }
    if (env.MYSQL_SSL === 'true') {
      config.ssl = { rejectUnauthorized: true }
      if (env.MYSQL_SSL_CA_FILE) config.ssl.ca = readFileSync(env.MYSQL_SSL_CA_FILE, 'utf8')
    }
    return config
  } catch {
    // Never include a connection URL or driver error in a message that could be logged.
    throw new Error('Invalid MySQL configuration. Check the URL, SSL settings, and CA file.')
  }
}

export function getApiConfig(env = process.env) {
  const port = Number(env.PORT || 3001)
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid API PORT.')
  const origins = (env.CORS_ORIGINS || 'http://localhost:5173').split(',').map((value) => value.trim()).filter(Boolean)
  for (const origin of origins) {
    let parsed
    try { parsed = new URL(origin) } catch { throw new Error('Invalid CORS_ORIGINS.') }
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== origin) {
      throw new Error('CORS_ORIGINS must contain exact HTTP(S) origins, without paths or wildcards.')
    }
  }
  return { port, host: env.HOST || '0.0.0.0', origins }
}
