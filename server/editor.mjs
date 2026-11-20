import { createServer } from 'node:http'
import { createDatabasePool } from './lib/database.mjs'
import { createEditorHandler, assertLocalEditorEnvironment } from './lib/editor-api.mjs'
import { createEditorStore } from './lib/editor-content.mjs'

let pool
try {
  assertLocalEditorEnvironment()
  const port = 3002
  pool = createDatabasePool()
  const server = createServer(createEditorHandler({ store: createEditorStore(pool), port }))
  server.requestTimeout = 30000
  server.headersTimeout = 10000
  server.on('error', async () => { console.error('Editor could not start. Check that local port 3002 is free.'); await pool.end(); process.exitCode = 1 })
  server.listen(port, '127.0.0.1', () => console.log('Local editor ready on 127.0.0.1:3002. Open localhost:5173 and choose Edit page. Saves change the LIVE MySQL content.'))
  const shutdown = () => { server.close(async () => { await pool.end() }); setTimeout(() => process.exit(1), 10000).unref() }
  process.once('SIGINT', shutdown)
  process.once('SIGTERM', shutdown)
} catch (error) {
  console.error(error.message)
  await pool?.end()
  process.exitCode = 1
}
