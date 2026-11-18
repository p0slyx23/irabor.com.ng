import resumeUrl from '../assets/files/resume.pdf'

const covers = import.meta.glob([
  '../assets/images/projects/*.{webp,jpg,jpeg,avif}',
  '../assets/images/projects/{portfolio-v1-cover,portfolio-v2-cover,icypop-store-cover}.png',
], {
  eager: true, query: '?url', import: 'default',
})

// Local originals are a deployment-safe fallback, not a content data source.
export const bundledAssets = {
  ...Object.fromEntries(Object.entries(covers).map(([path, url]) => [`asset:src/${path.slice(3)}`, url])),
  'asset:src/assets/files/resume.pdf': resumeUrl,
}
