-- Performance Index Migration
-- Adds composite indexes for common query patterns + GIN index for full-text search

-- Products: published + sorted by date (catalog listing)
CREATE INDEX IF NOT EXISTS "products_is_published_created_at_idx" ON "products" ("is_published", "created_at" DESC);

-- Products: published + filter by category (category browsing)
CREATE INDEX IF NOT EXISTS "products_is_published_category_id_idx" ON "products" ("is_published", "category_id");

-- Products: published + filter by price range
CREATE INDEX IF NOT EXISTS "products_is_published_price_idx" ON "products" ("is_published", "price");

-- Products: full-text search GIN index
CREATE INDEX IF NOT EXISTS "products_name_description_gin_idx" ON "products" USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Orders: user orders sorted by date (order history)
CREATE INDEX IF NOT EXISTS "orders_user_id_created_at_idx" ON "orders" ("user_id", "created_at" DESC);

-- Orders: filter by status (admin dashboard)
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders" ("status");

-- Cart items: lookup by cart
CREATE INDEX IF NOT EXISTS "cart_items_cart_id_idx" ON "cart_items" ("cart_id");

-- Cart items: lookup by product
CREATE INDEX IF NOT EXISTS "cart_items_product_id_idx" ON "cart_items" ("product_id");

-- Order items: lookup by order
CREATE INDEX IF NOT EXISTS "order_items_order_id_idx" ON "order_items" ("order_id");

-- Order items: lookup by product (seller analytics)
CREATE INDEX IF NOT EXISTS "order_items_product_id_idx" ON "order_items" ("product_id");

-- Reviews: lookup by user (user review history)
CREATE INDEX IF NOT EXISTS "reviews_user_id_idx" ON "reviews" ("user_id");

-- Access: lookup by user (buyer library)
CREATE INDEX IF NOT EXISTS "accesses_user_id_idx" ON "accesses" ("user_id");

-- Access: lookup by product (product access list)
CREATE INDEX IF NOT EXISTS "accesses_product_id_idx" ON "accesses" ("product_id");

-- Categories: lookup by parent (tree queries)
CREATE INDEX IF NOT EXISTS "categories_parent_id_idx" ON "categories" ("parent_id");

-- Users: filter by role (admin user management)
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users" ("role");