ALTER TABLE tech_posts DROP CONSTRAINT IF EXISTS tech_posts_slug_key;
ALTER TABLE tech_posts ADD CONSTRAINT tech_posts_slug_locale_key UNIQUE (slug, locale);
