import mysql from 'mysql2/promise'
import { getDatabaseConfig } from './lib/config.mjs'
import { applyMigrations } from './lib/migrations.mjs'

let connection
try {
  connection = await mysql.createConnection({ ...getDatabaseConfig(), multipleStatements: true })
  await applyMigrations(connection, new URL('./database/migrations/', import.meta.url))
  console.log('Portfolio migrations complete.')
} catch (error) {
  console.error(error.code
    ? 'Migration failed. Check database connectivity and schema permissions. No credentials were logged.'
    : error.message)
  process.exitCode = 1
} finally {
  await connection?.end()
}
