# Local editing and deployment guide

Run commands from the portfolio project folder in PowerShell.

## Before starting

- Keep your existing credentials in the ignored `server/.env`; never commit them.
- For the local API, use `HOST=127.0.0.1` and `PORT=3001` in that file.
- Leave `VITE_CONTENT_API_URL` empty in the root `.env.local` to use the local API proxy.
- Keep Vite on port 5173. Do not expose the API, editor, or Vite through a public tunnel.
- See the [server setup guide](../server/README.md) for initial MySQL and Cloudflare R2 configuration.

If dependencies are not installed, run `npm install`. Then check the database:

```powershell
npm run db:migrate
npm run db:check
```

Already-applied migrations are skipped. Migrations 005 and 006 add editor recovery history and update the Irabor V2 case study; they have already been applied to the current shared database.

## Start the localhost editor

Open three terminals in the project folder and leave each running.

Terminal 1 — read-only content API:

```powershell
npm run api:dev
```

Terminal 2 — localhost-only editor:

```powershell
npm run editor:start
```

Terminal 3 — frontend:

```powershell
npm run dev
```

Open **http://localhost:5173** and choose **Edit page**. Do not also run `npm run api:start` on the same API port.

## Edit and recover content

Use the inline controls to edit your profile, About, experience, projects, case-study blocks, and social links. Move up/down controls change ordering.

**Save changes writes directly to the shared live MySQL database.** Localhost-only describes where editing is available, not a private copy of the data. There is no separate publish step. Public content may take up to one minute to refresh.

- **Done editing** hides the editing controls.
- **Undo last save** restores the previous snapshot and creates another recovery snapshot.
- Deletion requires confirmation. At least one project must remain.
- If another tab has saved newer content, the editor rejects your stale save and keeps your form open. Copy any unsaved text you want to keep, close the form, choose **Reload latest**, and reapply your changes.
- If a save times out, reload the latest content before retrying: the database may already have committed it.
- Press `Ctrl+C` in each terminal when finished.

The production build excludes editing controls. The public API stays read-only.

## Update Cloudflare R2 files

The editor accepts existing public URLs or stable asset references; it does not upload files. Keep local originals for project covers and the resume.

After replacing the appropriate local files, preview the upload plan:

```powershell
npm run assets:sync
```

Review the listed files before applying:

```powershell
npm run assets:sync -- --apply
```

This uploads and verifies public files, then records their R2 URLs in MySQL. Never upload secrets. Do not paste generated Vite `/assets/...` URLs into editor fields; use a public R2 URL or stable `asset:src/assets/...` reference instead.

## Check, commit, and push

Database content saves are separate from Git. You do not need to push code for an editor content save to reach the public site. Push when releasing code, documentation, migrations, or bundled-file changes.

```powershell
npm run lint
npm run test:server
npm run build
npm run api:build
git status
git diff --check
```

Check that you are on `v2` and review every changed file before staging. Do not include unrelated work, `.env` files, credentials, or `server/database/*.local.sql` recovery exports. If unrelated changes exist, stage only the intended paths instead of using `git add .`.

```powershell
git branch --show-current
git add .
git diff --cached --stat
git diff --cached
git commit -m "feat: add localhost content editor and server wake recovery"
git push origin v2
```

## Release to main

Production follows `main`; pushing only to `v2` does not release the code there. Prefer a pull request from `v2` into `main` if branch protection or review is enabled.

For a direct local merge, first ensure `git status` shows a clean working tree:

```powershell
git switch main
git pull --ff-only origin main
git merge v2
git push origin main
git switch v2
```

If any command fails or reports conflicts, stop and resolve the issue before continuing. Do not force-push or discard changes to bypass it.

After deployment, check the homepage, archive, a case study, and resume link. Confirm the public website has no **Edit page** controls.

## What the wake screen does

During loading, the thinking animation remains the only visible status feedback. If loading fails with a timeout or HTTP 503, the recovery screen offers **Wake portfolio**, which sends a real retry, and a resume link. Other failures retain appropriate error guidance.

The screen says the server *may* be waking: it cannot confirm sleeping, change your Railway plan, or guarantee that a suspended service will restart. It does not send background keep-alive pings.
