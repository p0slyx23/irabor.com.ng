import { createServer } from 'node:http'
import { createApiHandler } from './lib/api.mjs'
import { getApiConfig } from './lib/config.mjs'
import { createDatabasePool } from './lib/database.mjs'

try {
  const config = getApiConfig()
  const pool = createDatabasePool()
  const server = createServer(createApiHandler({ pool, origins: config.origins }))
  server.requestTimeout = 15000
  server.headersTimeout = 10000
  server.listen(config.port, config.host, () => console.log(`Portfolio API listening on port ${config.port}.`))
  server.on('error', async () => {
    console.error('Unable to start the API. Check HOST and PORT.')
    await pool.end()
    process.exitCode = 1
  })
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
