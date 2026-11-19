# Joseph Ehis Irabor Portfolio

This project is open source under the [MIT License](./LICENSE). You are welcome to fork it and use it as a starting point for your own portfolio.

## Fork it

Before publishing a fork, replace the name, biography, contact details, social links, resume, project content, images, and case studies with work you are allowed to share.

Do not present Joseph Ehis Irabor's work history, writing, or project outcomes as your own. Please keep a credit to this repository in your fork or project documentation where practical.

## Run locally

```bash
npm install
```

Create `server/.env` from `server/.env.example` if it does not already exist,
then configure MySQL using the [server setup guide](./server/README.md).
Keep existing credentials; do not replace a working env file. For the local
API use `HOST=127.0.0.1` and `PORT=3001`.

```bash
npm run db:migrate
npm run db:check
npm run api:dev
```

Keep that API terminal open. Do not also run `api:start` on the same port.
In a second terminal, start the frontend:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Customize content

Content now lives in MySQL and is loaded through a read-only API. The
[content module](./src/content/siteContent.js) contains page interfaces and lookup
helpers, not the portfolio text. Use the
[payload template](./src/content/portfolioPayload.template.json) when preparing
new content, then apply reviewed SQL migrations to the database.

[Server setup](./server/README.md) covers MySQL, migrations, Cloudflare R2, and
deployment. Keep all database and R2 credentials in the ignored `server/.env`.
For local development, leave `VITE_CONTENT_API_URL` empty in `.env.local` so Vite
proxies `/api` to the API on port 3001. On Vercel, the specific `/api/content`
rewrite forwards to Railway before the SPA fallback, so the variable can stay
empty. Forks must change that destination to their own API and data. A public
`VITE_CONTENT_API_URL` can optionally override the proxy; rebuild after changes.

Public covers and the resume are served from verified Cloudflare R2 objects.
Local originals remain under `src/assets/` and provide bundled image fallbacks.
After replacing a file, run `npm run assets:sync` to preview the plan, then
`npm run assets:sync -- --apply` to upload, verify, and record its new URL.

## Portfolio versions and hosting

- `main` is the production deployment branch. Railway deploys the API from it.
- `v2` is the working branch for the current portfolio. Push changes there, then
  merge a pull request into `main` to release them. Pushing to `v2` alone does
  not update a Railway service watching `main`.
- The current frontend is hosted on [Vercel](https://irabor.com.ng/).
- `v1` preserves the earlier portfolio as a [live GitHub Pages archive](https://p0slyx23.github.io/irabor.com.ng/).

V1 has its own `npm run build:github-pages` command. Commit its generated `docs` directory when updating that archive. GitHub Pages publishes `v1` from `/docs`, using `/irabor.com.ng/` as the base path and a `404.html` fallback for direct case-study links.

The homepage shows every project from the current calendar year. `/archive` shows projects from earlier years. Set `date` or `sortDate` to a parseable date or a four-digit year. Keep project version, branch, and hosting URLs in the content payload when documenting portfolio releases.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Create a production build. |
| `npm run lint` | Run ESLint. |
| `npm run api:dev` | Start the local read-only content API. |
| `npm run api:build` | Validate the API without Vite, credentials, or a database connection. |
| `npm run api:start` | Start the production content API. |
| `npm run db:migrate` | Apply the MySQL schema and initial portfolio seed. |
| `npm run db:check` | Verify MySQL connectivity and migrated content. |
| `npm run db:export-seed` | Export current content to an ignored local SQL preview. |
| `npm run assets:check` | Check R2 access without uploading files. |
| `npm run assets:sync` | Preview the public asset upload plan. |
| `npm run assets:sync -- --apply` | Upload and verify public files, then record R2 URLs in MySQL. |
| `npm run test:server` | Run backend and migration safety tests without a database. |
| `npm run optimize:project-covers` | Create optimized WebP project-cover files. |

## License

Released under the [MIT License](./LICENSE).
