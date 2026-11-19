import { execFileSync } from 'node:child_process'
import { readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
// Resolve the API's runtime dependencies without reading credentials, binding
// a port, contacting MySQL, or requiring Vite/devDependencies in the API image.
import './lib/api.mjs'
import './lib/database.mjs'
import './lib/migrations.mjs'
import './lib/startup.mjs'

for (const entry of ['index.mjs', 'migrate.mjs']) {
  execFileSync(process.execPath, ['--check', fileURLToPath(new URL(entry, import.meta.url))], { stdio: 'inherit' })
}
const files = await readdir(new URL('./database/migrations/', import.meta.url))
if (!files.some((file) => /^\d+_[a-z0-9_]+\.sql$/.test(file))) {
  throw new Error('API build is missing SQL migrations.')
}
console.log('API build verified: runtime dependencies, entrypoints, and SQL migrations. No database connection required.')
