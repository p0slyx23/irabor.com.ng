-- MySQL 8.0+. Run against the existing database selected by MYSQL_URL.
-- DDL is deliberately additive. There are no DROP or DELETE statements.
CREATE TABLE IF NOT EXISTS portfolio_settings (
  content_key VARCHAR(80) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  payload JSON NOT NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (content_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS portfolio_projects (
  slug VARCHAR(160) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  summary JSON NOT NULL,
  detail JSON NOT NULL,
  stack JSON NOT NULL,
  sort_order INT UNSIGNED NOT NULL,
  portfolio_order INT UNSIGNED NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (slug),
  KEY portfolio_projects_sort (sort_order),
  KEY portfolio_projects_portfolio (portfolio_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS portfolio_experience (
  entry_id VARCHAR(160) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  payload JSON NOT NULL,
  sort_order INT UNSIGNED NOT NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (entry_id),
  KEY portfolio_experience_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
