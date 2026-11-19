# Railway MySQL and Cloudflare R2

The React frontend loads content from the read-only API. MySQL holds portfolio
settings, projects, experience, and verified public asset locations. Cloudflare
R2 holds public cover images and the resume. Local asset originals are retained.

## Local development

Use Node.js 22.12 or later (24 LTS recommended) and MySQL 8.0 or later.
Run commands from the repository root.

1. Install dependencies with `npm install`.
2. Fill the ignored `server/.env` using `server/.env.example`.
3. Use Railway's `MYSQL_PUBLIC_URL` value as local `MYSQL_URL`. Private
   `*.railway.internal` addresses cannot be reached from your computer.
4. Run `npm run db:migrate`, then `npm run db:check`.
5. Start the API with `npm run api:dev`.
6. In another terminal, run `npm run dev`.
7. Leave `VITE_CONTENT_API_URL` blank in root `.env.local` to use Vite's local
   `/api` proxy to port 3001. Set it to an API origin to test a deployed API.

Run only one API process: `api:dev` and `api:start` are alternatives, not two
services to start together. Keep its terminal open; stop it with **Ctrl+C**
before restarting. If startup reports `EADDRINUSE`, another process owns the
port. Reuse the running API or stop it in its original terminal. Do not kill
all Node processes or change ports at random. Changing the API port also
requires updating the target in `vite.config.js`.

Use `HOST=127.0.0.1` and `PORT=3001` locally. These are the API's listen address
and port, **not** the MySQL host/port inside `MYSQL_URL`. Shell variables take
precedence over the local env file; restart a terminal with stale overrides.

The browser never receives MySQL or R2 credentials. Never use a `VITE_` prefix
for secrets. Local environment files are ignored by Git. Keep their values out
of chat, screenshots, logs, and commits.

## Deploy the API to Railway

Use a GitHub-backed service from branch `main` in the same Railway project and
environment as MySQL. Keep the root directory at the repository root.

`v2` is the working branch. Commit/push fixes there, then merge a pull request
from `v2` into `main`. Railway deploys that merge commit from `main`; it does
not follow a push to `v2`. Do not change the service's watched branch to `v2`.

The checked-in `railway.json` and `railpack.json` configure:

| Setting | Value |
| --- | --- |
| Install (`railpack.json`) | Copy both package manifests, then `npm ci --omit=dev` |
| Build (both config files) | `npm run api:build` |
| Pre-deploy | `npm run db:migrate` |
| Start | `npm run api:start` |
| Healthcheck | `/readyz` |
| Application sleep | Disabled |

Set `RAILPACK_NODE_VERSION=24` and `CORS_ORIGINS=https://irabor.com.ng` on
the API service. Add exact local or preview origins only when needed.
Origins have a scheme and optional port, with no path, trailing slash, or wildcard.
Use `HOST=0.0.0.0` so Railway can reach the API; do not copy the local
`HOST=127.0.0.1`. Let Railway inject `PORT` instead of setting it to 3001 or 3306.

`packageManager` records the tested npm version; check the actual npm version
in the deployment logs rather than assuming that field changes the bundled CLI.
Railpack installs production dependencies in its install phase; the build
validates API modules and migration files without connecting to MySQL. It
does not run Vite or perform a second install over the build cache. The
`.dockerignore` keeps local env files, frontend sources, and review artifacts
out of the API image. Vercel still uses `npm run build` for the React frontend.
Remove stale custom build/start dashboard overrides if they conflict with
the checked-in configuration. Check the new deployment's resolved configuration.

Railpack command arrays **replace** generated commands unless extended with
`...`. This repository's install override therefore explicitly copies
`package.json` and `package-lock.json` before running `npm ci`; do not remove
those copy commands. A clean install layer does not start with repository files.
The API build and start commands are also explicit in `railpack.json`, so
Railpack detects a Node API instead of choosing Vite's static Caddy runtime.
Set `RAILPACK_NO_SPA=1` and remove a stale `RAILPACK_SPA_OUTPUT_DIR` variable if
the API service was previously configured as a static frontend. Do not change
the MySQL service or the Vercel frontend to apply this API-only setting.

Set `MYSQL_URL` on the API service to `${{MySQL.MYSQL_URL}}`, replacing
`MySQL` with your actual database service name. This is the private connection
for Railway-to-Railway traffic. Keep the public URL in the local file unchanged.
Railway supplies `PORT` automatically.

Generate a public domain for the API. Both `/readyz` and `/api/content` must
return JSON, not your frontend's HTML. The pre-deploy step skips previously
applied migrations and verifies their checksums.

An install warning or vulnerability summary is not, by itself, a failed build.
If image creation fails, expand the failed Build Logs step and find its first
fatal error. A local `npm run build` checks Vite, not Railway's API image.
The successful deployment must show JSON at both health/content URLs before
you point the frontend at it.

For a restricted production API user, grant SELECT on `portfolio_settings`,
`portfolio_projects`, `portfolio_experience`, and `portfolio_assets`.
Run migrations separately with a schema-management user instead of using the
restricted API credentials in the pre-deploy command.

TLS is enabled with `MYSQL_SSL=true` only for an endpoint that supports it.
Use `MYSQL_SSL_CA_FILE` for a custom CA. Certificate verification is never
disabled. Keep production database traffic on Railway's private network.

## Deploy the frontend to Vercel

Set this public build variable in Vercel and redeploy:

```env
VITE_CONTENT_API_URL=https://your-api.up.railway.app
```

The loader accepts either the API origin or its full `/api/content` URL.
An empty value uses same-origin `/api/content`, which is useful behind a proxy.
The existing Vercel SPA rewrite does not create that proxy, so set the variable
for this deployment. Updating a Vite variable requires a new frontend build.

The frontend validates the API version, content shape, project references, and
URLs before rendering. It retries temporary failures once, bounds request time,
cancels abandoned requests, and offers an accessible retry state on failure.
It does not silently replace failed database reads with hardcoded portfolio text.

## Cloudflare R2 public assets

Fill these values in the ignored local `server/.env`:

```env
R2_BUCKET=your-bucket-name
R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_PUBLIC_BASE_URL=https://your-public-asset-domain
```

The R2 S3 endpoint may include a matching bucket suffix copied from the
dashboard. The command normalizes that suffix. The delivery URL must be the
bucket's public development URL or a custom domain, not its authenticated S3
endpoint. Only public portfolio files belong in this bucket.

Use a bucket-scoped Object Read & Write token. Do not grant account-wide bucket
administration. Write credentials are needed only by the local upload command;
the public API reads already-verified URLs from MySQL.

```bash
npm run assets:check
npm run assets:sync
npm run assets:sync -- --apply
```

The first command checks access. The second previews the plan without changing
R2 or MySQL. The third uploads and publishes the approved assets.

Files are discovered from existing `asset:src/assets/...` references in the
database. The upload allowlist includes project PNG/WebP/JPEG/AVIF covers and
`src/assets/files/resume.pdf` only. It rejects arbitrary paths, private files,
and paths resolving outside the repository.

Each object uses `portfolio/<sha256>/<filename>`. Matching objects are reused,
and unexpected hash conflicts fail rather than overwrite. Uploaded bytes, MIME
type, and public delivery are verified before any manifest is published. The
whole set of verified references is recorded in one database transaction.
Failures leave the old manifest in place. Objects already uploaded during a
failed run remain available for a safe retry. No delete command is provided.

Asset URLs use content-addressed keys with immutable caching. Replacing a local
file creates a new object and URL. The old R2 object and local original remain
untouched. To switch delivery domains, update `R2_PUBLIC_BASE_URL` and rerun
the sync. Existing objects are reused and the new public URLs are verified.

`r2.dev` is for development. Configure a custom domain, such as
`assets.irabor.com.ng`, for production. Keep private attachments in a separate
private bucket. No public upload endpoint or admin UI is included.

The API resolves portable content references using `portfolio_assets`.
Unmapped references can use the frontend's local bundled registry during a
staged cutover. Known original WebP covers, the two portfolio PNGs, Icypop PNG,
and the resume are included as fallbacks. Add new fallback PNGs explicitly if
needed. Ordinary UI SVGs and fonts remain bundled with the frontend.

## Migrations and future content

| File | Purpose |
| --- | --- |
| `001_schema.sql` | Add settings, projects, and experience tables |
| `002_initial_content.sql` | Preserve the original full content snapshot |
| `003_update_icypop_store.sql` | Apply the revised Icypop case study |
| `004_asset_storage.sql` | Add the verified public asset manifest |

The runner creates `portfolio_schema_migrations` with version checksums and
uses a named database lock. Already-applied files must not be edited. Add a new
numbered migration for future changes. LF and CRLF are normalized for checksums.
Back up an existing database before applying changes.

MySQL DDL implicitly commits. Schema files are additive and safe to rerun.
Seed data and its version record are transactional under the runner. The initial
seed leaves existing rows unchanged on duplicate keys. Runtime API connections
disable multiple SQL statements. Only checked-in migration files enable them.

`src/content/siteContent.js` is now a data adapter with lookup helpers.
Do not put new text back into it. Use the payload template to prepare factual
content and generate a reviewed SQL migration for the corresponding database rows.

`npm run db:export-seed` exports a fresh database snapshot to an ignored local
SQL preview. It does not contact R2 or rewrite an applied migration. Use
`--output path/to/new-file.sql` for a new, exclusively created output file.
Use `--project icypop-store` for a single-project update snapshot.
Seed JSON is encoded as UTF-8 hex literals to preserve Unicode, quotes, and
backslashes regardless of the MySQL client's SQL mode.

## Endpoints and verification

| Endpoint | Purpose |
| --- | --- |
| `GET /healthz` | Process liveness |
| `GET /readyz` | Content and asset-table readiness |
| `GET /api/content` | Public `{ schemaVersion: 1, content }` response |

The API is read-only, uses exact-origin CORS, and returns safe error messages.
CORS is not authentication. Portfolio content and public asset URLs are public.
Content responses use ETags and a 60-second cache lifetime.

Run `npm run test:server`, `npm run lint`, and `npm run build` before
deployment. Tests cover content loading, validation, retries, storage safety,
migration behavior, and deployment configuration.

Browser integration checks can use a local API against real MySQL and R2.
Build with `VITE_CONTENT_API_URL=/api/content`, start the API, then run
`scripts/verify-portfolio-ui.mjs` with `PORTFOLIO_QA_API_ORIGIN` set to
that local API origin. Its local production server proxies content requests,
while uploaded images and PDFs are served by real R2. The suite also simulates
wrong-service HTML and temporary outages. No deployment is performed by QA.

References: [Railway MySQL](https://docs.railway.com/databases/mysql),
[Railway config](https://docs.railway.com/config-as-code/reference),
[Cloudflare R2 SDK](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/),
[public R2 buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/),
[Vite environment variables](https://vite.dev/guide/env-and-mode).
