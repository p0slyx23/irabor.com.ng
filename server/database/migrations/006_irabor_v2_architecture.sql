-- Update only Irabor V2 to reflect the deployed data/media architecture.
UPDATE portfolio_projects SET
  summary = JSON_SET(summary,
    '$.tags', JSON_ARRAY('React', 'Vite', 'Node.js', 'MySQL', 'Cloudflare R2'),
    '$.excerpt', 'My frontend engineering portfolio, backed by a read-only Node.js API, Railway MySQL, and Cloudflare R2. Responsive case studies and small details wey make the experience feel right.'),
  detail = JSON_SET(detail,
    '$.lede', 'A focused frontend engineering portfolio with database-driven content, verified cloud assets, and a private localhost editing workflow.',
    '$.tags', JSON_ARRAY('React', 'Vite', 'Node.js', 'MySQL', 'Railway', 'Cloudflare R2'),
    '$.sections', JSON_ARRAY(
      JSON_OBJECT('id', 'overview', 'heading', 'Overview', 'paragraphs', JSON_ARRAY('Irabor V2 organizes my portfolio around About, Experience, and Projects. Current-year projects appear on the homepage, while earlier work lives in the project archive.')),
      JSON_OBJECT('id', 'implementation', 'heading', 'Interface and accessibility', 'paragraphs', JSON_ARRAY('React, Vite, and responsive CSS support the interface, with light and dark themes, reduced-motion behavior, keyboard-accessible contact controls, and solid sticky headings. Loading and recovery states provide clear feedback without exposing technical errors.')),
      JSON_OBJECT('id', 'content', 'heading', 'Database-driven content', 'paragraphs', JSON_ARRAY('Portfolio content moved from bundled JavaScript into MySQL on Railway. A read-only Node.js API serves validated, versioned content to the frontend. Vercel forwards same-origin content requests to Railway before its page fallback.', 'Schema and content changes use reviewed SQL migrations. Requests have bounded retries and timeouts, and the public API does not expose database credentials or accept content mutations.')),
      JSON_OBJECT('id', 'media', 'heading', 'Media and storage', 'paragraphs', JSON_ARRAY('Project covers and the resume are delivered from Cloudflare R2. Uploads are verified before their public locations are recorded in MySQL, while local originals remain available as bundled fallbacks.')),
      JSON_OBJECT('id', 'editing', 'heading', 'Local editing workflow', 'paragraphs', JSON_ARRAY('Editing controls are available only in localhost development. A separate loopback-only process validates changes, checks content revisions, and records a recovery snapshot before saving to the shared MySQL database. Production remains read-only for visitors.')),
      JSON_OBJECT('id', 'hosting', 'heading', 'Versioning and hosting', 'paragraphs', JSON_ARRAY('Vercel hosts the current frontend and Railway hosts its content API and MySQL database. Personal Website V1 remains available as a GitHub Pages archive.'))),
    '$.toc', JSON_ARRAY(
      JSON_OBJECT('id', 'overview', 'label', 'Overview'), JSON_OBJECT('id', 'implementation', 'label', 'Interface'),
      JSON_OBJECT('id', 'content', 'label', 'Content architecture'), JSON_OBJECT('id', 'media', 'label', 'Media'),
      JSON_OBJECT('id', 'editing', 'label', 'Local editing'), JSON_OBJECT('id', 'hosting', 'label', 'Hosting')),
    '$.stack', JSON_ARRAY(
      JSON_OBJECT('id', 'react', 'badge', 'react', 'title', 'React', 'badgeTone', 'purple', 'description', 'Reusable components and accessible interactions.'),
      JSON_OBJECT('id', 'vite', 'badge', 'vite', 'title', 'Vite', 'badgeTone', 'purple', 'description', 'Frontend development and production builds.'),
      JSON_OBJECT('id', 'node', 'badge', 'code', 'title', 'Node.js', 'badgeTone', 'purple', 'description', 'Read-only content API and a separate local editing process.'),
      JSON_OBJECT('id', 'mysql', 'badge', 'sql', 'title', 'MySQL', 'badgeTone', 'purple', 'description', 'Portfolio content, migrations, verified asset locations, and recovery snapshots.'),
      JSON_OBJECT('id', 'r2', 'badge', 'cloud', 'title', 'Cloudflare R2', 'badgeTone', 'purple', 'description', 'Public project covers and resume delivery.')))
WHERE slug = 'portfolio-v2';

UPDATE portfolio_projects SET stack = JSON_EXTRACT(detail, '$.stack') WHERE slug = 'portfolio-v2';
