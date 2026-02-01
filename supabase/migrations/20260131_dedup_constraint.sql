-- 1. Deduplicate expert_reports
DELETE FROM expert_reports a USING expert_reports b
WHERE a.product_id = b.product_id
  AND a.locale = b.locale
  AND a.created_at < b.created_at;

-- 2. Deduplicate products (by name)
DELETE FROM products a USING products b
WHERE lower(a.name) = lower(b.name)
  AND a.created_at < b.created_at;

-- 3. Add Unique Constraints
ALTER TABLE expert_reports
ADD CONSTRAINT unique_product_locale UNIQUE (product_id, locale);

ALTER TABLE products
ADD CONSTRAINT unique_product_name UNIQUE (name);

-- 4. Verify
SELECT product_id, locale, count(*)
FROM expert_reports
GROUP BY product_id, locale
HAVING count(*) > 1;
