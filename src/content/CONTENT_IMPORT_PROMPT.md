Use this prompt with ChatGPT when you want your real portfolio data arranged into the app's structure:

```text
Fill the attached JSON payload for my portfolio website.

Rules:
1. Keep the exact JSON structure and keys.
2. Do not rename keys.
3. Do not add comments.
4. If information is missing, use an empty string, empty array, or false instead of inventing data.
5. Keep copy concise and portfolio-ready.
6. For image paths, use this format exactly: /images/folder/file-name.ext
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
15. For projectEntries.links, use objects with exactly these keys: "label" and "href". Use an empty array if there are no project links yet.
16. For resources, use objects with exactly these keys: "id", "title", "category", "logoText", "logoTone", "description", and "image".
17. For snippets, use objects with exactly these keys: "id", "title", "description", "category", "projectSlug", "projectTitle", "stack", "updatedAt", and "highlighted".
18. For snippets, keep them tied to real projects when possible by filling "projectSlug", "projectTitle", and "stack". Make "projectSlug" match an existing project slug exactly.
19. For ongoing projects where you want no visible month/year in listings, set "date" to "" and use "sortDate" like "Aug 2025" to preserve ordering.
20. For projectPosts.readTime and blogPosts.readTime, use an empty string unless you explicitly want to keep that metadata for later use.
21. Include only the social links you want visible. The app supports "github", "mail", and "linkedin", but you do not need to include all three.
22. If a project cover image is not ready yet, use an empty string for image.src or coverImage.src. The app will fall back to the placeholder cover.
23. Use empty arrays or empty objects for sections you are not filling yet, instead of placeholder prose.
```

Image rule for this project:

- Put image files inside `public/images/`
- Example:
  - `public/images/profile/irabor-portrait.jpg`
  - `public/images/logos/typescript.svg`
  - `public/images/projects/project-slug/project-cover.jpg`
  - `public/images/blog/post-cover.jpg`
- Reference them in data as:
  - `"/images/profile/irabor-portrait.jpg"`
  - `"/images/logos/typescript.svg"`
  - `"/images/projects/project-slug/project-cover.jpg"`
  - `"/images/blog/post-cover.jpg"`

Recommended workflow:

1. Copy `portfolioPayload.template.json`
2. Paste it into ChatGPT with the prompt above
3. Fill in your real data
4. Replace the demo content in `siteContent.js` with the finalized data, or ask me to wire the JSON directly
