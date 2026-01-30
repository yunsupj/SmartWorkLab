-- Rename 'reviews' table to 'expert_reports' to distinguish from user reviews
ALTER TABLE IF EXISTS public.reviews RENAME TO expert_reports;

-- Rename the primary key constraint if it follows the default naming convention
ALTER INDEX IF EXISTS reviews_pkey RENAME TO expert_reports_pkey;

-- If there are other indexes or foreign keys that explicitly use 'reviews' in their name, roughly rename them too
-- (This relies on standard naming conventions, adjust if manual names were used)

-- Example: If there was a foreign key in products pointing to reviews (unlikely, usually reviews -> products)
-- But if reviews had a foreign key to products, likely it is reviews_product_id_fkey
-- We can leave constraints as is or rename them for clarity. Renaming the table is the critical part.
