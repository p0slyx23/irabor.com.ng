import { readdir } from 'node:fs/promises'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const projectImageDirectory = join(process.cwd(), 'src/assets/images/projects')
const coverFiles = (await readdir(projectImageDirectory)).filter((fileName) =>
  /-cover\.png$/i.test(fileName),
)

for (const fileName of coverFiles) {
  const inputPath = join(projectImageDirectory, fileName)
  const outputPath = join(projectImageDirectory, `${parse(fileName).name}.webp`)

  await sharp(inputPath)
    .webp({ quality: 82, smartSubsample: true })
    .toFile(outputPath)

  console.log(`Optimized ${fileName}`)
}
