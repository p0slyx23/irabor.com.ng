import { createServer } from 'node:http'
import { createApiHandler } from './lib/api.mjs'
import { getApiConfig } from './lib/config.mjs'
import { createDatabasePool } from './lib/database.mjs'
import { describeListenError } from './lib/startup.mjs'

try {
  const config = getApiConfig()
  const pool = createDatabasePool()
  const server = createServer(createApiHandler({ pool, origins: config.origins }))
  server.requestTimeout = 15000
  server.headersTimeout = 10000
  server.on('error', async (error) => {
    console.error(describeListenError(error, config))
    process.exitCode = 1
    await pool.end().catch(() => {})
  })
  server.listen(config.port, config.host, () => console.log(`Portfolio API listening on http://${config.host.includes(':') ? `[${config.host}]` : config.host}:${config.port}. Keep this terminal open; stop it with Ctrl+C.`))
  const shutdown = () => {
    server.close(async () => {
      await pool.end()
    })
    setTimeout(() => process.exit(1), 10000).unref()
  }
  process.once('SIGTERM', shutdown)
  process.once('SIGINT', shutdown)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
