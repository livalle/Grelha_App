/*
# Seed Menu Items and Recipes (Ficha Técnica)

1. Menu Items
- Clássico: R$24.90, burger category
- Bacon Cheddar: R$28.90, burger category
- Duplo Smash: R$34.90, burger category
- Batata Frita: R$14.90, side category
- Refrigerante: R$7.90, drink category

2. Recipes (Ingredient consumption per item)
- Clássico: 1 pão, 180g carne, 2 fatias queijo
- Bacon Cheddar: 1 pão, 180g carne, 2 fatias queijo, 30g bacon
- Duplo Smash: 1 pão, 360g carne, 4 fatias queijo
- Batata Frita: 150g batata
- Refrigerante: 1 un refri

3. Notes
- Uses INSERT ... ON CONFLICT for idempotency
- Quantities match original hardcoded recipes
*/

INSERT INTO menu_items (id, name, description, price, category, prep_time_seconds) VALUES
  ('classico', 'Clássico', 'Hambúrguer clássico com queijo', 24.90, 'burger', 300),
  ('bacon', 'Bacon Cheddar', 'Hambúrguer com bacon e cheddar', 28.90, 'burger', 360),
  ('duplo', 'Duplo Smash', 'Hambúrguer duplo com queijo derretido', 34.90, 'burger', 480),
  ('batataFrita', 'Batata Frita', 'Porção de batata frita crocante', 14.90, 'side', 180),
  ('refriLata', 'Refrigerante', 'Refrigerante lata 350ml', 7.90, 'drink', 30)
ON CONFLICT (id) DO NOTHING;

INSERT INTO recipes (menu_id, inventory_id, quantity) VALUES
  ('classico', 'pao', 1),
  ('classico', 'carne', 180),
  ('classico', 'queijo', 2),
  ('bacon', 'pao', 1),
  ('bacon', 'carne', 180),
  ('bacon', 'queijo', 2),
  ('bacon', 'bacon', 30),
  ('duplo', 'pao', 1),
  ('duplo', 'carne', 360),
  ('duplo', 'queijo', 4),
  ('batataFrita', 'batata', 150),
  ('refriLata', 'refri', 1)
ON CONFLICT (menu_id, inventory_id) DO NOTHING;
