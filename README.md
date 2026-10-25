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
- Update `experienceSection` to add or edit work history.
- Update project and blog entries as you publish new work.
- Use [src/content/portfolioPayload.template.json](./src/content/portfolioPayload.template.json) as the structured content template.

Place a replacement resume in `src/assets/files/resume.pdf`. Project covers and other image assets live under `src/assets/images/`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Create a production build. |
| `npm run lint` | Run ESLint. |
| `npm run optimize:project-covers` | Create optimized WebP project-cover files. |

## License

Released under the [MIT License](./LICENSE).
