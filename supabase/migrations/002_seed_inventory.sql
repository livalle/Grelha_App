/*
# Seed Initial Inventory Data

1. Changes
- Insert initial inventory items with starting quantities:
  - Pão (bread): 80 units, threshold 15
  - Carne (meat): 14000g, threshold 2500
  - Queijo (cheese): 150 fatia (slices), threshold 30
  - Bacon: 2000g, threshold 400
  - Batata (potatoes): 8000g, threshold 1200
  - Refrigerante: 60 units, threshold 12

2. Security
- No schema changes, only data seeding

3. Notes
- Uses INSERT ... ON CONFLICT DO NOTHING for idempotency
*/

INSERT INTO inventory (id, name, unit, qty, threshold) VALUES
  ('pao', 'Pão', 'un', 80, 15),
  ('carne', 'Carne', 'g', 14000, 2500),
  ('queijo', 'Queijo', 'fatia', 150, 30),
  ('bacon', 'Bacon', 'g', 2000, 400),
  ('batata', 'Batata', 'g', 8000, 1200),
  ('refri', 'Refrigerante', 'un', 60, 12)
ON CONFLICT (id) DO NOTHING;
