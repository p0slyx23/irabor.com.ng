Use this prompt with ChatGPT when you want your real portfolio data arranged into the app's structure:

The published portfolio follows About, Experience, and Projects. Its introduction
and About copy come from `profileContent`. Work history comes from
`experienceSection`, and the project rows link to `projectEntries` case studies.
Fill those fields first. Keep writing, resource, and snippet payloads empty for
this three-section portfolio.

The homepage shows projects from the current calendar year. The archive shows
earlier years. Supply a real year in every project date. Set portfolio versions
and branch names explicitly, using v1 for the 2025 archive and v2 for the current
site. Hosting metadata accepts separate vercel and githubPages URLs. Add each
published URL to the project's links array with its own descriptive label.

Use mostly clear English with a light touch of Nigerian Pidgin, around 10% of
conversational copy. Keep it natural in the introduction, About paragraphs, and
personal project summaries. Keep navigation, action labels, employment details,
and technical explanations precise and easy to understand.

```text
Fill the attached JSON payload for my portfolio website.

Rules:
1. Keep the exact JSON structure and keys.
2. Do not rename keys.
3. Do not add comments.
4. If information is missing, use an empty string, empty array, or false instead of inventing data. Never invent metrics, users, revenue, performance claims, launch dates, or client outcomes.
5. Keep copy concise and portfolio-ready.
6. For images, use a verified public R2 HTTPS URL or an existing portable asset reference such as asset:src/assets/images/projects/project-cover.webp. Do not invent URLs or object keys.
7. For aboutPage.paragraphs and for projectEntries.sections/blogEntries.sections, keep each paragraph as a separate string inside "paragraphs".
8. Keep slugs lowercase and hyphenated, and make projectEntries/blogEntries object keys match their slug.
9. Keep dates human-readable for projectPosts.date and blogPosts.date. Use ISO format only for snippets.updatedAt.
10. Return valid JSON only.
11. For projectEntries.meta timeline items, use these rules:
   - Add a separate plain status item when known: "In Development", "Completed", or "Live"
   - Ongoing but not yet live: use only "In Development" unless you explicitly want to show a public launch/update date
   - Completed project: "Completed Feb 2026"
   - Live project: "Live since Jan 2026"
   - Live and still maintained: "Live" plus "Live since Jan 2026" and "Updated Today"
   - If you only know a historical creation date and not status: "Created Feb 2026"
12. Keep project case studies under "projectPosts" and "projectEntries".
13. Keep editorial writing under "blogPosts" and "blogEntries".
14. For projectEntries.stack, use objects with exactly these keys: "id", "badge", "badgeTone", "title", "description".
15. For siteBrand, use "phone" as an international phone string and "resumes" as an array of objects with exactly "label" and "url". Use an empty array when no CV files are ready.
16. For projectEntries.links, use objects with exactly these keys: "label" and "href". Include only links that work publicly, such as a live site, app-store listing, repository, or prototype. Use an empty array if there are no project links yet.
17. For projectEntries.screenshots, use an array of objects with exactly these keys: "src", "alt", and "caption". Screenshots are optional: one strong cover image is enough until you have more. Use an empty array rather than duplicating the cover image.
18. For projectEntries.evidence, use an array of objects with exactly these keys: "label", "value", and "detail". Include only verifiable proof such as a delivery milestone, supported platform, launch status, validated metric, or named system capability. Use an empty array when no evidence is available; never use invented numbers or placeholder evidence.
19. Prefer "overview", "challenge", "role", "solution", and "outcome" sections when the supplied material supports them. A shorter factual case study may omit "solution". Keep "toc" aligned with the actual sections, and keep outcomes concise and verifiable.
20. For resources, use objects with exactly these keys: "id", "title", "category", "logoText", "logoTone", "description", and "image".
21. For snippets, use objects with exactly these keys: "id", "title", "description", "category", "projectSlug", "projectTitle", "stack", "updatedAt", and "highlighted".
22. For snippets, keep them tied to real projects when possible by filling "projectSlug", "projectTitle", and "stack". Make "projectSlug" match an existing project slug exactly.
23. For ongoing projects where you want no visible month/year in listings, set "date" to "" and use "sortDate" like "Aug 2025" to preserve ordering.
24. For projectPosts.readTime and blogPosts.readTime, use an empty string unless you explicitly want to keep that metadata for later use.
25. Include only the social links you want visible. The app supports "github", "mail", and "linkedin", but you do not need to include all three.
26. If a project cover image is not ready yet, use an empty string for image.src or coverImage.src. The app will fall back to the placeholder cover.
27. Use empty arrays or empty objects for sections you are not filling yet, instead of placeholder prose.
28. For experienceSection.entries, use objects with exactly these keys: "id", "period", "title", "company", "companyUrl", "summary", "technologies", and "isDemo". Use only real employment, contract, internship, or volunteer experience. Set "isDemo" to false for real entries and use an empty string when there is no company URL.
29. For profileContent, use exactly "name", "introduction", and "about". Keep the introduction to one short sentence. Use an array of separate paragraph strings for "about", grounded in the supplied résumé and projects. Keep earlier roles in experienceSection.title in chronological order, separated by " → ", so the latest role is presented first in the interface.
```

Image rule for this project:

- Existing public covers and the resume are stored in Cloudflare R2.
- Keep original cover files in `src/assets/images/projects/` and the resume in
  `src/assets/files/resume.pdf`.
- Existing database references use `asset:src/assets/...`; the API resolves them
  through the verified asset manifest. A verified R2 HTTPS URL is also valid.
- Do not invent a public bucket URL, hash, asset path, or screenshot.

Recommended workflow:

1. Copy `portfolioPayload.template.json`
2. Paste it into ChatGPT with the prompt above
3. Fill in your real data
4. Ask for a reviewed SQL migration for the finalized content. Do not put the data back into `siteContent.js` or rewrite an applied migration.
5. For new or changed public assets, preview `npm run assets:sync`, then apply the approved upload plan with `npm run assets:sync -- --apply`.
