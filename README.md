# Joseph Ehis Irabor Portfolio

This project is open source under the [MIT License](./LICENSE). You are welcome to fork it and use it as a starting point for your own portfolio.

## Fork it

Before publishing a fork, replace the name, biography, contact details, social links, resume, project content, images, and case studies with work you are allowed to share.

Do not present Joseph Ehis Irabor's work history, writing, or project outcomes as your own. Please keep a credit to this repository in your fork or project documentation where practical.

## Run locally

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

## Customize content

Most portfolio content lives in [src/content/siteContent.js](./src/content/siteContent.js).

- Update `siteBrand` for identity, contact details, social links, and resume links.
- Update `profileContent` for the introduction and About section.
- Update `experienceSection` to add or edit work history.
- Update `projectPosts`, `projectEntries`, and the `portfolioProjects` ordering as you publish new work.
- Use [src/content/portfolioPayload.template.json](./src/content/portfolioPayload.template.json) as the structured content template.

Place a replacement resume in `src/assets/files/resume.pdf`. Project covers and other image assets live under `src/assets/images/`.

## Portfolio versions and hosting

- `main` is the primary repository branch.
- `v2` contains the current portfolio, hosted on [Vercel](https://irabor.com.ng/).
- `v1` preserves the earlier portfolio as a [live GitHub Pages archive](https://p0slyx23.github.io/irabor.com.ng/).

V1 has its own `npm run build:github-pages` command. Commit its generated `docs` directory when updating that archive. GitHub Pages publishes `v1` from `/docs`, using `/irabor.com.ng/` as the base path and a `404.html` fallback for direct case-study links.

The homepage shows every project from the current calendar year. `/archive` shows projects from earlier years. Set `date` or `sortDate` to a parseable date or a four-digit year. Keep project version, branch, and hosting URLs in the content payload when documenting portfolio releases.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Create a production build. |
| `npm run lint` | Run ESLint. |
| `npm run optimize:project-covers` | Create optimized WebP project-cover files. |

## License

Released under the [MIT License](./LICENSE).
