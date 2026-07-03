/*
# Initial Schema for Grelha Restaurant Order Management

1. New Tables
- `inventory`: Stores ingredient stock levels and thresholds
  - `id` (text, primary key) - ingredient identifier (e.g., 'pao', 'carne')
  - `name` (text, not null) - display name
  - `unit` (text, not null) - unit of measurement (e.g., 'un', 'g', 'fatia')
  - `qty` (integer, not null, default 0) - current quantity in stock
  - `threshold` (integer, not null) - low stock warning threshold
  - `updated_at` (timestamptz) - last modification time

- `orders`: Customer orders
  - `id` (uuid, primary key)
  - `number` (integer, not null) - human-readable order number (e.g., #101)
  - `customer_name` (text, not null) - customer name
  - `status` (text, not null, default 'recebido') - order status
  - `priority` (boolean, not null, default false) - priority flag
  - `created_at` (timestamptz) - order creation time
  - `updated_at` (timestamptz) - last modification time

- `order_items`: Items within an order
  - `id` (uuid, primary key)
  - `order_id` (uuid, foreign key to orders)
  - `menu_id` (text, not null) - menu item identifier
  - `qty` (integer, not null) - quantity ordered

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated full CRUD because this is a single-tenant app (no sign-in).
- Policies use `USING (true)` since data is intentionally public/shared.

3. Important Notes
- Order number counter is managed via a sequence for atomic increments
- Cascade delete order_items when an order is deleted
- Indexes on frequently queried columns (status, created_at)
*/

-- Order number sequence (starts at 101)
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 101;

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id text PRIMARY KEY,
  name text NOT NULL,
  unit text NOT NULL,
  qty integer NOT NULL DEFAULT 0,
  threshold integer NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer NOT NULL DEFAULT nextval('order_number_seq'),
  customer_name text NOT NULL,
  status text NOT NULL DEFAULT 'recebido',
  priority boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_id text NOT NULL,
  qty integer NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Inventory policies (anon + authenticated for no-auth app)
DROP POLICY IF EXISTS "anon_select_inventory" ON inventory;
CREATE POLICY "anon_select_inventory" ON inventory FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_inventory" ON inventory;
CREATE POLICY "anon_insert_inventory" ON inventory FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_inventory" ON inventory;
CREATE POLICY "anon_update_inventory" ON inventory FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_inventory" ON inventory;
CREATE POLICY "anon_delete_inventory" ON inventory FOR DELETE
  TO anon, authenticated USING (true);

-- Orders policies (anon + authenticated for no-auth app)
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

-- Order items policies (anon + authenticated for no-auth app)
DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_order_items" ON order_items;
CREATE POLICY "anon_update_order_items" ON order_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_order_items" ON order_items;
CREATE POLICY "anon_delete_order_items" ON order_items FOR DELETE
  TO anon, authenticated USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS inventory_updated_at ON inventory;
CREATE TRIGGER inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
