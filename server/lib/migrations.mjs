import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'

export async function applyMigrations(connection, directory, log = console.log) {
  const files = (await readdir(directory)).filter((name) => /^\d+_[a-z0-9_]+\.sql$/.test(name)).sort()
  if (!files.length) throw new Error('No SQL migrations found.')
  const [[database]] = await connection.query('SELECT DATABASE() AS name')
  const lockName = `portfolio-migrate-${createHash('sha256').update(database.name).digest('hex').slice(0, 32)}`
  const [[lock]] = await connection.execute('SELECT GET_LOCK(?, 10) AS acquired', [lockName])
  if (Number(lock.acquired) !== 1) throw new Error('Another migration is running. Try again later.')
  try {
    await connection.query(`CREATE TABLE IF NOT EXISTS portfolio_schema_migrations (
      version VARCHAR(160) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
      checksum CHAR(64) CHARACTER SET ascii NOT NULL,
      applied_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)
    const [applied] = await connection.execute('SELECT version, checksum FROM portfolio_schema_migrations')
    const checksums = new Map(applied.map((row) => [row.version, row.checksum]))
    const migrations = []
    // Validate every recorded file before applying any pending migration.
    for (const version of files) {
      const sql = await readFile(new URL(version, directory), 'utf8')
      const checksum = createHash('sha256').update(sql.replace(/\r\n/g, '\n')).digest('hex')
      if (checksums.has(version) && checksums.get(version) !== checksum) {
        throw new Error(`Applied migration changed: ${version}. Restore it and add a new migration.`)
      }
      migrations.push({ version, sql, checksum })
    }
    for (const { version, sql, checksum } of migrations) {
      if (checksums.has(version)) {
        log(`Already applied: ${version}`)
        continue
      }
      await connection.beginTransaction()
      try {
        // Only checked-in migration files run with multipleStatements enabled.
        // MySQL DDL implicitly commits. Schema files must remain safe to rerun.
        await connection.query(sql)
        await connection.execute('INSERT INTO portfolio_schema_migrations (version, checksum) VALUES (?, ?)', [version, checksum])
        await connection.commit()
        log(`Applied: ${version}`)
      } catch (error) {
        await connection.rollback().catch(() => {})
        throw error
      }
    }
  } finally {
    await connection.execute('SELECT RELEASE_LOCK(?)', [lockName])
  }
}
