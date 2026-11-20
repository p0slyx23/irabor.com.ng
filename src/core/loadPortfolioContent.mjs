import { mapAssetReferences, validatePortfolioContent } from '../../shared/content-data.mjs'

export class ContentLoadError extends Error {
  constructor(code) {
    super('Portfolio content could not be loaded.')
    this.name = 'ContentLoadError'
    this.code = code
  }
}

export function getContentEndpoint(value = '') {
  if (!value || value === '/api/content') return '/api/content'
  try {
    const url = new URL(value)
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error()
    if (url.pathname.replace(/\/+$/, '') === '') url.pathname = '/api/content'
    else if (url.pathname.replace(/\/+$/, '') !== '/api/content') throw new Error()
    return url.href.replace(/\/+$/, '')
  } catch { throw new ContentLoadError('configuration') }
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new ContentLoadError('aborted'))
    const abort = () => { clearTimeout(timer); reject(new ContentLoadError('aborted')) }
    const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve() }, ms)
    signal?.addEventListener('abort', abort, { once: true })
  })
}

export async function loadPortfolioContent({ endpoint = '', assets = {}, signal, fetchImpl = fetch, timeoutMs = 10000, attempts = 2, pause = delay } = {}) {
  const url = getContentEndpoint(endpoint)
  for (let attempt = 0; attempt < attempts; attempt++) {
    if (signal?.aborted) throw new ContentLoadError('aborted')
    const controller = new AbortController()
    let timedOut = false
    const abort = () => controller.abort()
    signal?.addEventListener('abort', abort, { once: true })
    const timer = setTimeout(() => { timedOut = true; controller.abort() }, timeoutMs)
    let retry = false
    try {
      const response = await fetchImpl(url, { signal: controller.signal, credentials: 'omit', cache: 'no-store' })
      if (!response.ok) {
        retry = response.status >= 500 || response.status === 429
        throw new ContentLoadError(response.status === 429 ? 'rate-limited' : response.status === 503 ? 'unavailable' : 'service-error')
      }
      if (!(response.headers.get('content-type') || '').includes('application/json')) throw new ContentLoadError('configuration')
      let payload
      try { payload = await response.json() } catch {
        if (controller.signal.aborted) throw new ContentLoadError(timedOut ? 'timeout' : 'aborted')
        throw new ContentLoadError('invalid-content')
      }
      if (payload.schemaVersion !== 1) throw new ContentLoadError('invalid-content')
      try {
        validatePortfolioContent(payload.content)
        const resolved = mapAssetReferences(payload.content, (reference) => {
          if (!assets[reference]) throw new Error('Unknown asset reference.')
          return assets[reference]
        })
        return validatePortfolioContent(resolved)
      } catch { throw new ContentLoadError('invalid-content') }
    } catch (error) {
      if (signal?.aborted) throw new ContentLoadError('aborted')
      const failure = error instanceof ContentLoadError ? error : new ContentLoadError(timedOut ? 'timeout' : 'network')
      if (['network', 'timeout'].includes(failure.code)) retry = true
      if (!retry || attempt === attempts - 1) throw failure
    } finally {
      clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
    }
    await pause(500 * (attempt + 1), signal)
  }
  throw new ContentLoadError('unavailable')
}
