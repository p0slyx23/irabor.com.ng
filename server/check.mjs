import { createDatabasePool } from './lib/database.mjs'
import { readPortfolioContent } from './lib/content.mjs'

let pool
try {
  pool = createDatabasePool()
  await pool.execute('SELECT 1')
  console.log('MySQL connection successful.')
  const content = await readPortfolioContent(pool)
  console.log(`Content ready: ${content.projectPosts.length} projects, ${content.experienceSection.entries.length} experience entries.`)
} catch (error) {
  console.error(error.code
    ? 'Database check failed. Check connection details, network access, and run npm run db:migrate.'
    : error.message)
  process.exitCode = 1
} finally {
  await pool?.end()
}
