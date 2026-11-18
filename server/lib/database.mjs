import mysql from 'mysql2/promise'
import { getDatabaseConfig } from './config.mjs'

export function createDatabasePool(env = process.env) {
  return mysql.createPool({
    ...getDatabaseConfig(env),
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 60000,
    waitForConnections: true,
    queueLimit: 20,
  })
}
