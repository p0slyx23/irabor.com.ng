import { createHash } from 'node:crypto'
import { readPortfolioContent } from './content.mjs'

export function createApiHandler({ pool, origins, logError = console.error }) {
  return async (request, response) => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('Vary', 'Origin')
    const send = (status, body) => {
      response.statusCode = status
      response.end(request.method === 'HEAD' ? undefined : JSON.stringify(body))
    }
    const origin = request.headers.origin
    if (origin && !origins.includes(origin)) return send(403, { error: 'Origin not allowed.' })
    if (origin) response.setHeader('Access-Control-Allow-Origin', origin)

    if (request.method === 'OPTIONS') {
      response.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
      response.setHeader('Access-Control-Max-Age', '600')
      response.statusCode = 204
      return response.end()
    }
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.setHeader('Allow', 'GET, HEAD, OPTIONS')
      return send(405, { error: 'This API is read-only.' })
    }

    const path = (request.url || '/').split('?')[0]
    if (path === '/healthz') return send(200, { status: 'ok' })
    if (!['/api/content', '/readyz'].includes(path)) return send(404, { error: 'Not found.' })
    try {
      const content = await readPortfolioContent(pool)
      if (path === '/readyz') return send(200, { status: 'ready' })
      const body = JSON.stringify({ schemaVersion: 1, content })
      const etag = `"${createHash('sha256').update(body).digest('hex')}"`
      response.setHeader('ETag', etag)
      response.setHeader('Cache-Control', 'public, max-age=60')
      if (request.headers['if-none-match'] === etag) {
        response.statusCode = 304
        return response.end()
      }
      response.statusCode = 200
      return response.end(request.method === 'HEAD' ? undefined : body)
    } catch {
      logError('Portfolio database read failed. Check connectivity and run db:migrate.')
      return send(503, { error: 'Content is temporarily unavailable.' })
    }
  }
}
