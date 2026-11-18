import { fileURLToPath } from 'node:url'
import { createDatabasePool } from './lib/database.mjs'
import { readPortfolioContent } from './lib/content.mjs'
import { checkStorage, createStorageClient, getStorageConfig, planAssets, recordAssets, uploadAndVerifyAsset } from './lib/storage.mjs'

let pool, client
try {
  const config = getStorageConfig()
  client = createStorageClient(config)
  if (process.argv.includes('--check')) {
    await checkStorage(client, config.bucket)
    console.log('R2 bucket connection successful. No files changed.')
  } else {
    pool = createDatabasePool()
    const content = await readPortfolioContent(pool)
    const assets = await planAssets(content, fileURLToPath(new URL('../', import.meta.url)), config)
    console.log(`Public asset plan: ${assets.length} files, ${assets.reduce((sum, asset) => sum + asset.byteSize, 0)} bytes. Local originals will remain unchanged.`)
    if (process.argv.includes('--apply')) {
      const verified = []
      for (const asset of assets) {
        const result = await uploadAndVerifyAsset(asset, { client, config })
        verified.push(result)
        console.log(`Verified ${verified.length}/${assets.length}: ${asset.reference}`)
      }
      // Publish references only after the whole upload set is publicly verified.
      await recordAssets(pool, verified)
      console.log(`Saved ${verified.length} verified R2 asset references to MySQL. No local files or R2 objects were deleted.`)
    } else {
      console.log('Dry run only. Use npm run assets:sync -- --apply to upload and publish verified references.')
    }
  }
} catch (error) {
  const code = typeof error.name === 'string' && /^[A-Za-z0-9_]+$/.test(error.name) ? error.name : 'StorageError'
  console.error(error.safeMessage || `Asset operation failed (${code}). Check R2 settings, bucket permissions, public access, and database migrations. No credentials were logged.`)
  process.exitCode = 1
} finally {
  client?.destroy()
  await pool?.end()
}
