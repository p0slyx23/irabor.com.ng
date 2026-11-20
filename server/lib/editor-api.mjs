import { randomBytes, timingSafeEqual } from 'node:crypto'
import { EditorError } from './editor-content.mjs'

export function assertLocalEditorEnvironment(env = process.env) {
  if (env.NODE_ENV === 'production' || env.RAILWAY_ENVIRONMENT_ID || env.RAILWAY_PROJECT_ID || env.VERCEL) {
    throw new Error('The editor is localhost-only and cannot run in a deployed environment.')
  }
}

export function createEditorHandler({ store, port, token = randomBytes(32).toString('hex'), allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'] }) {
  const origins = new Set(allowedOrigins)
  return async (request, response) => {
    const send = (status, data) => { response.writeHead(status); response.end(JSON.stringify(data)) }
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    const address = request.socket.remoteAddress
    const origin = request.headers.origin
    const host = request.headers.host
    if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(address) ||
      ![`localhost:${port}`, `127.0.0.1:${port}`].includes(host) ||
      (origin && !origins.has(origin)) || request.headers['sec-fetch-site'] === 'cross-site') {
      return send(403, { error: 'Local editor access only.' })
    }
    const path = request.url?.split('?')[0]
    try {
      if (request.method === 'GET' && path === '/api/editor/session') return send(200, { token, ...await store.read() })
      if (!['PUT', 'POST'].includes(request.method) || !['/api/editor/content', '/api/editor/restore'].includes(path)) return send(404, { error: 'Not found.' })
      const supplied = request.headers['x-editor-token'] || ''
      if (!origin || !origins.has(origin) || !/^[a-f0-9]{64}$/.test(supplied) || supplied.length !== token.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(token))) return send(403, { error: 'Editor session expired. Reopen edit mode.' })
      if (!(request.headers['content-type'] || '').startsWith('application/json')) return send(415, { error: 'Use JSON content.' })
      let bytes = 0
      const chunks = []
      await new Promise((resolve, reject) => {
        request.on('data', chunk => {
          bytes += chunk.length
          if (bytes > 1024 * 1024) { reject(new EditorError(413, 'Content exceeds the 1 MB editor limit.')); return }
          chunks.push(chunk)
        })
        request.once('end', resolve)
        request.once('error', reject)
        request.once('aborted', () => reject(new EditorError(400, 'Request interrupted.')))
      })
      let body
      try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { throw new EditorError(400, 'Invalid JSON content.') }
      if (!/^[a-f0-9]{64}$/.test(body?.revision || '')) throw new EditorError(400, 'Missing content revision. Reopen edit mode.')
      if (request.method === 'PUT' && path === '/api/editor/content') return send(200, { token, ...await store.save(body.content, body.revision) })
      if (request.method === 'POST' && path === '/api/editor/restore') return send(200, { token, ...await store.restore(body.id, body.revision) })
      return send(405, { error: 'Method not allowed.' })
    } catch (error) {
      send(error instanceof EditorError ? error.status : 503, { error: error instanceof EditorError ? error.message : 'Editor unavailable. Check MySQL connectivity and run npm run db:migrate. No changes were confirmed.' })
    }
  }
}
