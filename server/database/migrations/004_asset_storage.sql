-- Public asset locations, separate from content and upload credentials.
-- Existing content references remain stable when an object or domain changes.
CREATE TABLE IF NOT EXISTS portfolio_assets (
  asset_ref VARCHAR(255) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  object_key VARCHAR(512) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  public_url VARCHAR(2048) NOT NULL,
  sha256 CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  byte_size BIGINT UNSIGNED NOT NULL,
  content_type VARCHAR(100) CHARACTER SET ascii NOT NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (asset_ref),
  UNIQUE KEY portfolio_assets_object (object_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
