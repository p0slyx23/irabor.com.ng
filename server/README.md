# Railway MySQL setup

This is the database and read-only API foundation. The frontend still reads
`src/content/siteContent.js` until its database cutover is configured and verified.
Adding credentials alone does **not** switch the live website or remove its local
content. No Railway services are created by these scripts.

## Local setup

Use Node.js 22.12 or later (Node.js 24 LTS recommended) and MySQL 8.0 or later.
Run commands from the repository root.

1. Run `npm install`.
2. Create `server/.env` using `server/.env.example`, if it does not already exist.
3. Enter your connection URL in `MYSQL_URL`. This file is ignored by Git.
4. Run `npm run db:migrate` to create the tables and import the current content.
5. Run `npm run db:check` to verify connectivity and seeded content.
6. Run `npm run api:dev` and open `http://localhost:3001/api/content`.

For local access to Railway, use the MySQL service's **MYSQL_PUBLIC_URL** from its
TCP proxy. A `*.railway.internal` host cannot be reached from your computer.
Passwords containing reserved URL characters must be URL-encoded. Use Railway's
generated URL rather than assembling one by hand. Never paste credentials in
chat, commit them, or put them in a `VITE_*` variable.

The checked-in template has no real credentials. The API and database commands
fail clearly if `MYSQL_URL` is empty. `DATABASE_URL` is also accepted when
`MYSQL_URL` is unset.

## Railway API service

Keep the frontend on Vercel. Add a separate API service from this repository and
the `v2` branch in the **same Railway project and environment** as MySQL.
Keep its root directory at the repository root, not `/server`.

Configure the API service with these values.

| Setting | Value |
| --- | --- |
| Node version | `RAILPACK_NODE_VERSION=24` |
| Build command | `npm ci --omit=dev` |
| Pre-deploy command | `npm run db:migrate` |
| Start command | `npm run api:start` |
| Healthcheck path | `/readyz` |
| `MYSQL_URL` | `${{MySQL.MYSQL_URL}}`, replacing `MySQL` with your database service name |
| `CORS_ORIGINS` | `https://irabor.com.ng` plus any other exact frontend origins you intentionally allow |

Railway supplies `PORT` automatically. Use the **private** connection URL between
these services. The default pool has five connections per API instance. Account
for additional instances when setting the database's connection limit.

An origin includes the scheme and hostname, and a port for local development.
It does not include a trailing slash or path. Do not use a wildcard for Vercel
preview URLs. Add a specific preview origin when you need to test it.

Enable `MYSQL_SSL=true` only for an endpoint configured to support TLS. A custom
CA can be provided with `MYSQL_SSL_CA_FILE`. Certificate verification is never
disabled. The template's `false` value does not claim that public connections
are encrypted. Keep production DB traffic on Railway's private network.

For production, migrations need a schema-management DB user. The API can use a
separate user with only SELECT access to `portfolio_settings`,
`portfolio_projects`, and `portfolio_experience`. If you use that arrangement,
run migrations separately with the migration user's credentials rather than
running a pre-deploy command under the API's restricted credentials.

## Tables and migration SQL

- `database/migrations/001_schema.sql` creates three additive InnoDB tables.
- `database/migrations/002_initial_content.sql` seeds the current portfolio,
  including Icypop, with its original ordering and nested case studies.
- `database/migrations/003_update_icypop_store.sql` applies the revised Icypop
  copy, tags, and case-study sections without rewriting the initial migration.
- The runner creates `portfolio_schema_migrations` to record applied versions
  and checksums. A named database lock prevents concurrent migration runners.

Projects and experience have stable primary keys and explicit order columns.
JSON columns retain the existing nested content shape without creating a table
for every paragraph, tag, and case-study section. This is deliberately a content
store, not a full CMS. Unused writing, resources, and snippets are preserved as
settings so migration does not silently discard them.

`npm run db:migrate` applies pending files in filename order. Already-applied
migrations are skipped. Changing an applied file fails its checksum check.
Add a new numbered migration for future changes. Commit the SQL files as UTF-8
and keep line endings consistent. CRLF and LF are normalized for checksums.

The schema does not drop or delete anything. The initial seed leaves existing
rows untouched on duplicate keys. Back up an existing database and inspect any
existing `portfolio_*` tables before first use. MySQL DDL implicitly commits,
so schema changes are not fully transactional. The seed and its migration record
are transactional when applied by the runner.

You can also execute `001_schema.sql`, then `002_initial_content.sql`, using a
MySQL client against the selected database. No CREATE DATABASE privilege is
needed. Prefer the runner so migrations are tracked. Do not import untrusted SQL.
Seed JSON uses hexadecimal UTF-8 literals to preserve Unicode and backslashes
independently of client SQL modes.

## Files and frontend cutover

Cloudflare R2 is the planned storage provider for future uploaded assets. No
upload integration, bucket provisioning, or file transfer is enabled yet.
Existing local files remain in use until storage and frontend changes are ready.

Résumé PDFs, covers, SVGs, and other assets stay in the repository. The seed stores
portable references such as `asset:src/assets/files/resume.pdf`. These are asset
identifiers, not public URLs. Do not replace them with Vite's hashed build URLs,
which change between deployments. A frontend asset registry must resolve these
identifiers during the later cutover.

Before removing the local content source, wire a frontend loader to
`GET /api/content`, resolve asset references, add loading/retry behavior, and
verify both deployment domains. That cutover intentionally waits for a working
database. Do not point the existing frontend at this endpoint without its adapter.

`npm run db:export-seed` exports the current JS content to an ignored local SQL
preview. It does not contact MySQL or modify an applied migration. To generate a
new file, run `npm run db:export-seed -- --output path/to/new-file.sql`. Explicit
output files are created exclusively and are never silently overwritten.

For a single project update, use
`npm run db:export-seed -- --project icypop-store --output path/to/new-migration.sql`.
This updates only that project's summary, case study, and stack. It preserves
the row's existing sort positions and does not touch other projects.

## API and tests

| Endpoint | Purpose |
| --- | --- |
| `GET /healthz` | Process liveness, no database dependency |
| `GET /readyz` | Database and seed readiness, returns 503 when unavailable |
| `GET /api/content` | Public content as `{ schemaVersion: 1, content }` |

Responses include a 60-second cache lifetime and an ETag for content. There are
no editing endpoints, admin credentials, or browser-accessible DB credentials.
CORS limits browser access from other origins. It is not authentication, and
public portfolio content remains public. Logs and error responses omit driver
errors and connection URLs.

Run `npm run test:server`, `npm run lint`, and `npm run build` before deployment.
Automated tests use fake database connections to check API behavior and migration
safety. Actual MySQL verification requires `db:migrate` and `db:check` against
your configured database.

References: [Railway MySQL](https://docs.railway.com/databases/mysql),
[private networking](https://docs.railway.com/networking/private-networking/how-it-works),
[mysql2 connection pools](https://sidorares.github.io/node-mysql2/docs/examples/connections/create-pool).
