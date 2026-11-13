import { copyFile, writeFile } from 'node:fs/promises'
import { build } from 'vite'

await build({ base: '/irabor.com.ng/', build: { outDir: 'docs', emptyOutDir: false } })
await copyFile('docs/index.html', 'docs/404.html')
await writeFile('docs/.nojekyll', '')
