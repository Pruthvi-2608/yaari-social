-- ====================================================================
-- Yaari Social Cafe - Initial Seed Data
-- ====================================================================

-- 1. Categories
INSERT INTO public.menu_categories (id, name, slug, description, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Served Hot', 'served-hot', 'Classic brewed warmth & handcrafted espresso specialities', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Served Cold', 'served-cold', 'Chilled blends, refreshing ice-crews and signature cold coffees', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Chai', 'chai', 'Aromatic Indian tea steeped with fresh ginger, cardamom & spices', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'Shakes', 'shakes', 'Thick, creamy indulgence loaded with premium chocolate & crunch', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'Refreshments', 'refreshments', 'Zesty coolers and fizzy mocktails to beat the afternoon heat', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'Beverages', 'beverages', 'Chilled sodas and energizing refreshments', 6, true),
  ('c1000000-0000-0000-0000-000000000007', 'Buns', 'buns', 'Soft bakery buns toasted with generous layers of Amul butter & Nutella', 7, true),
  ('c1000000-0000-0000-0000-000000000008', 'Breads', 'breads', 'Crispy artisan garlic breads, buttery toasts & melted cheese', 8, true),
  ('c1000000-0000-0000-0000-000000000009', 'Pastas', 'pastas', 'Italian penne tossed in rich house-crafted creamy & spicy sauces', 9, true),
  ('c1000000-0000-0000-0000-000000000010', 'Fries', 'fries', 'Golden crispy potato fries tossed with secret seasonings & cheese sauces', 10, true),
  ('c1000000-0000-0000-0000-000000000011', 'Sandwiches', 'sandwiches', 'Triple-layered grilled & fresh sandwiches loaded with cheese & veggies', 11, true),
  ('c1000000-0000-0000-0000-000000000012', 'Potato Twisters', 'potato-twisters', 'Spiral whole-potato twister sticks seasoned to perfection', 12, true),
  ('c1000000-0000-0000-0000-000000000013', 'Burgers', 'burgers', 'Juicy golden patties topped with signature house dressing & melting cheese', 13, true),
  ('c1000000-0000-0000-0000-000000000014', 'Maggi', 'maggi', 'India''s comfort food cooked cafe-style with vegetables, butter & cheese', 14, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 2. Menu Items
INSERT INTO public.menu_items (category_id, name, price, popular, is_available, display_order)
VALUES
  -- Served Hot
  ('c1000000-0000-0000-0000-000000000001', 'Hot Coffee', 20, true, true, 1),
  ('c1000000-0000-0000-0000-000000000001', 'Strong Coffee', 25, false, true, 2),
  ('c1000000-0000-0000-0000-000000000001', 'Black Coffee', 30, false, true, 3),
  ('c1000000-0000-0000-0000-000000000001', 'Hot Chocolate Coffee', 40, true, true, 4),
  ('c1000000-0000-0000-0000-000000000001', 'Strong Chocolate Coffee', 50, false, true, 5),
  ('c1000000-0000-0000-0000-000000000001', 'DavidOff Hot Coffee', 60, false, true, 6),
  ('c1000000-0000-0000-0000-000000000001', 'Cappuccino', 60, true, true, 7),
  ('c1000000-0000-0000-0000-000000000001', 'Hot Chocolate', 100, true, true, 8),

  -- Served Cold
  ('c1000000-0000-0000-0000-000000000002', 'Bournvita', 60, false, true, 1),
  ('c1000000-0000-0000-0000-000000000002', 'Plain Cold Coffee', 80, false, true, 2),
  ('c1000000-0000-0000-0000-000000000002', 'Iced Americano', 80, false, true, 3),
  ('c1000000-0000-0000-0000-000000000002', 'Iced Coffee', 100, false, true, 4),
  ('c1000000-0000-0000-0000-000000000002', 'Strong Cold Coffee', 100, true, true, 5),
  ('c1000000-0000-0000-0000-000000000002', 'Chocolate Cold Coffee', 120, true, true, 6),
  ('c1000000-0000-0000-0000-000000000002', 'DavidOff Cold Coffee', 150, false, true, 7),
  ('c1000000-0000-0000-0000-000000000002', 'Irish Coffee', 180, true, true, 8),

  -- Chai
  ('c1000000-0000-0000-0000-000000000003', 'Classic Chai', 15, false, true, 1),
  ('c1000000-0000-0000-0000-000000000003', 'Adrak Chai', 20, true, true, 2),
  ('c1000000-0000-0000-0000-000000000003', 'Elaichi Chai', 20, false, true, 3),
  ('c1000000-0000-0000-0000-000000000003', 'Adrak Elaichi Mix', 30, true, true, 4),
  ('c1000000-0000-0000-0000-000000000003', 'Lemon Chai', 30, false, true, 5),
  ('c1000000-0000-0000-0000-000000000003', 'Masala Chai', 40, true, true, 6),

  -- Shakes
  ('c1000000-0000-0000-0000-000000000004', 'Chocolate Shake', 80, false, true, 1),
  ('c1000000-0000-0000-0000-000000000004', 'Vanilla Shake', 80, false, true, 2),
  ('c1000000-0000-0000-0000-000000000004', 'Cadbury Shake', 100, true, true, 3),
  ('c1000000-0000-0000-0000-000000000004', 'Kit Kat Shake', 120, true, true, 4),
  ('c1000000-0000-0000-0000-000000000004', 'Oreo Shake', 140, true, true, 5),

  -- Refreshments
  ('c1000000-0000-0000-0000-000000000005', 'Sweet Lemonade', 50, false, true, 1),
  ('c1000000-0000-0000-0000-000000000005', 'Salt Lemonade', 50, false, true, 2),
  ('c1000000-0000-0000-0000-000000000005', 'Masala Lemonade', 60, true, true, 3),
  ('c1000000-0000-0000-0000-000000000005', 'Lemon Iced Tea', 100, false, true, 4),
  ('c1000000-0000-0000-0000-000000000005', 'Virgin Mojito', 120, true, true, 5),

  -- Beverages
  ('c1000000-0000-0000-0000-000000000006', 'Thums Up', 25, false, true, 1),
  ('c1000000-0000-0000-0000-000000000006', 'Coke', 25, false, true, 2),
  ('c1000000-0000-0000-0000-000000000006', 'Sprite', 25, false, true, 3),
  ('c1000000-0000-0000-0000-000000000006', 'Fanta', 25, false, true, 4),
  ('c1000000-0000-0000-0000-000000000006', 'Diet Coke', 50, false, true, 5),
  ('c1000000-0000-0000-0000-000000000006', 'Redbull', 135, false, true, 6),

  -- Buns
  ('c1000000-0000-0000-0000-000000000007', 'Bun Maska', 40, true, true, 1),
  ('c1000000-0000-0000-0000-000000000007', 'Bun Jam Maska', 50, false, true, 2),
  ('c1000000-0000-0000-0000-000000000007', 'Nutella Bun Maska', 70, true, true, 3),
  ('c1000000-0000-0000-0000-000000000007', 'Nutella Choco Bun Maska', 90, true, true, 4),

  -- Breads
  ('c1000000-0000-0000-0000-000000000008', 'Bread Butter', 25, false, true, 1),
  ('c1000000-0000-0000-0000-000000000008', 'Bread Butter Jam', 30, false, true, 2),
  ('c1000000-0000-0000-0000-000000000008', 'Bread Simple Toast', 40, false, true, 3),
  ('c1000000-0000-0000-0000-000000000008', 'Toasted Butter Jam', 50, false, true, 4),
  ('c1000000-0000-0000-0000-000000000008', 'Garlic Bread', 60, false, true, 5),
  ('c1000000-0000-0000-0000-000000000008', 'Spicy Garlic Bread', 70, false, true, 6),
  ('c1000000-0000-0000-0000-000000000008', 'Peri Peri Garlic Bread', 80, false, true, 7),
  ('c1000000-0000-0000-0000-000000000008', 'Cheese Garlic Bread', 120, true, true, 8),
  ('c1000000-0000-0000-0000-000000000008', 'Corn Cheese Garlic Bread', 140, true, true, 9),

  -- Pastas
  ('c1000000-0000-0000-0000-000000000009', 'Red Sauce Pasta', 180, true, true, 1),
  ('c1000000-0000-0000-0000-000000000009', 'Tandoori Sauce Pasta', 180, true, true, 2),
  ('c1000000-0000-0000-0000-000000000009', 'White Sauce Pasta', 200, true, true, 3),

  -- Fries
  ('c1000000-0000-0000-0000-000000000010', 'Plain Salted Fries', 60, false, true, 1),
  ('c1000000-0000-0000-0000-000000000010', 'Peri Peri Fries', 80, true, true, 2),
  ('c1000000-0000-0000-0000-000000000010', 'Mayo Fries', 100, false, true, 3),
  ('c1000000-0000-0000-0000-000000000010', 'Cheesy Fries', 120, true, true, 4),

  -- Sandwiches
  ('c1000000-0000-0000-0000-000000000011', 'Masala Sandwich', 50, false, true, 1),
  ('c1000000-0000-0000-0000-000000000011', 'Chilli Chatpata Sandwich', 70, false, true, 2),
  ('c1000000-0000-0000-0000-000000000011', 'Bombay Kaccha Sandwich', 80, false, true, 3),
  ('c1000000-0000-0000-0000-000000000011', 'Bombay Cheese Grilled', 100, true, true, 4),
  ('c1000000-0000-0000-0000-000000000011', 'Corn Cheese Grilled', 120, true, true, 5),
  ('c1000000-0000-0000-0000-000000000011', 'Cheese Achari Grilled', 120, false, true, 6),
  ('c1000000-0000-0000-0000-000000000011', 'Chocolate Sandwich', 140, false, true, 7),
  ('c1000000-0000-0000-0000-000000000011', 'Paneer Corn Cheese Grilled', 150, true, true, 8),

  -- Potato Twisters
  ('c1000000-0000-0000-0000-000000000012', 'Classic Twister', 70, false, true, 1),
  ('c1000000-0000-0000-0000-000000000012', 'Peri Peri Twister', 80, true, true, 2),
  ('c1000000-0000-0000-0000-000000000012', 'Peri Peri Mayo Twister', 100, false, true, 3),
  ('c1000000-0000-0000-0000-000000000012', 'Cheesy Mayo Twister', 120, true, true, 4),

  -- Burgers
  ('c1000000-0000-0000-0000-000000000013', 'Classic Aloo Tikki Burger', 60, false, true, 1),
  ('c1000000-0000-0000-0000-000000000013', 'Tandoori Veggie Burger', 70, false, true, 2),
  ('c1000000-0000-0000-0000-000000000013', 'Cheese Aloo Tikki Burger', 80, false, true, 3),
  ('c1000000-0000-0000-0000-000000000013', 'Cheese Tandoori Burger', 90, true, true, 4),
  ('c1000000-0000-0000-0000-000000000013', 'Double Cheese Burger', 100, false, true, 5),
  ('c1000000-0000-0000-0000-000000000013', 'Yaari Maharaja Burger', 130, true, true, 6),

  -- Maggi
  ('c1000000-0000-0000-0000-000000000014', 'Classic Maggi', 60, false, true, 1),
  ('c1000000-0000-0000-0000-000000000014', 'Double Masala Maggi', 70, true, true, 2),
  ('c1000000-0000-0000-0000-000000000014', 'Peri Peri Masala Maggi', 80, false, true, 3),
  ('c1000000-0000-0000-0000-000000000014', 'Veggie Maggi', 90, false, true, 4),
  ('c1000000-0000-0000-0000-000000000014', 'Cheesy Maggi', 100, true, true, 5),
  ('c1000000-0000-0000-0000-000000000014', 'Tandoori Masala Maggi', 110, true, true, 6);

-- 3. Site Content
INSERT INTO public.site_content (section_key, content_json)
VALUES
  ('hero', '{
    "heading": "A little coffee. A lot of yaari.",
    "subtitle": "Your cozy corner for coffee, comfort food, conversations and late-evening yaari in Silvassa.",
    "tagline": "Backyard Cafe & Acoustic Hangout",
    "ctaText": "Explore Menu",
    "ctaLink": "#menu",
    "secondaryCtaText": "Experience The Vibe",
    "secondaryCtaLink": "#vibe",
    "badgeText": "Now Open in Silvassa"
  }'::jsonb),
  ('the_yaari_feeling', '{
    "heading": "Where Silvassa slow-brews friendships",
    "quote": "Some cafes are built for quick takeaways; Yaari Social was built for hours that slip away unnoticed.",
    "subheading": "Rain on the backyard canopy, acoustic strings tuning in the corner, steaming cups of Adrak Chai and conversations that start with coffee and end under fairy lights.",
    "highlightWords": ["Warmth", "Music", "Backyard", "Monsoon", "Community"]
  }'::jsonb),
  ('about', '{
    "heading": "About Yaari Social",
    "story": "Born out of a simple desire: to give Silvassa a warm, soulful space that feels less like a commercial eatery and more like a dear friend''s cozy backyard. From morning brews to late night jamming, every corner of Yaari Social is crafted for genuine connection.",
    "amenities": [
      "Cozy Monsoon Backyard Setup",
      "Live Acoustic & Jamming Nights",
      "Outdoor & Indoor Seating",
      "Curated Music & Vibe",
      "Fresh Artisan Coffee & Bites",
      "Birthday & Gathering Celebrations"
    ]
  }'::jsonb),
  ('marquee', '{
    "text": "COFFEE • CONVERSATIONS • FOOD • MUSIC • YAARI • SILVASSA •"
  }'::jsonb)
ON CONFLICT (section_key) DO UPDATE SET
  content_json = EXCLUDED.content_json;

-- 4. Site Settings
INSERT INTO public.site_settings (setting_key, setting_value)
VALUES
  ('cafe_info', '{
    "name": "Yaari Social",
    "tagline": "A little coffee. A lot of yaari.",
    "description": "Your cozy corner for coffee, comfort food, conversations and late-evening yaari in Silvassa.",
    "phone": "+91 97373 35305",
    "alternatePhone": "+91 76987 97087",
    "instagram": "https://www.instagram.com/yaari_social/",
    "instagramHandle": "@yaari_social",
    "address": "Near Lions College (Opp. Sai Nidhi Dosa), SSR Road",
    "city": "Silvassa",
    "pincode": "396230",
    "state": "Dadra and Nagar Haveli",
    "landmark": "Opposite Sai Nidhi Dosa",
    "googleMapsUrl": "https://maps.google.com/?q=Yaari+Social+Silvassa"
  }'::jsonb),
  ('hours', '[
    {"days": "Monday – Friday", "time": "11:00 AM – 11:00 PM"},
    {"days": "Saturday – Sunday", "time": "10:30 AM – 11:30 PM"}
  ]'::jsonb),
  ('section_visibility', '{
    "hero": true,
    "vibe": true,
    "jamming": true,
    "reels": true,
    "menu": true,
    "moments": true,
    "about": true,
    "visit": true
  }'::jsonb)
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value;

-- 5. Videos (Hero, Jamming, and Reels)
INSERT INTO public.videos (title, caption, video_path, thumbnail_path, placement, display_order, is_published)
VALUES
  -- Hero Video
  (
    'Crowd Singing Vibe',
    'When the crowd sings along, the artist feels it, and the whole place comes alive! Only at Yaari Social!',
    '/media/instagram/videos/Db_CweANDwQ.mp4',
    '/media/instagram/images/Db_CweANDwQ.jpg',
    'hero',
    1,
    true
  ),
  -- Jamming Videos
  (
    'Acoustic Live Night',
    'Lights, music & pure vibes at Yaari Social live jamming nights.',
    '/media/instagram/videos/DZ0QpG1tDzn.mp4',
    '/media/instagram/images/DZ0QpG1tDzn.jpg',
    'jamming',
    1,
    true
  ),
  (
    'Sunday Crowd Singalong',
    'Live musical night energy with the youth of Silvassa.',
    '/media/instagram/videos/DaFNN55NFRy.mp4',
    '/media/instagram/images/DaFNN55NFRy.jpg',
    'jamming',
    2,
    true
  ),
  -- Reels
  (
    'Monsoon Setup at Yaari',
    'Monsoon just got cozier in Silvassa! Our backyard has a fresh new monsoon setup.',
    '/media/instagram/videos/DauajytN5En.mp4',
    '/media/instagram/images/DauajytN5En.jpg',
    'reels',
    1,
    true
  ),
  (
    'Silvassa Late Evening Adda',
    'New vibes, new hangout, same yaari in Silvassa.',
    '/media/instagram/videos/DYpeZ4WAzaB.mp4',
    '/media/instagram/images/DYpeZ4WAzaB.jpg',
    'reels',
    2,
    true
  ),
  (
    'Backyard Coffee & Rainy Evenings',
    'Steaming hot cappuccino and honest conversations.',
    '/media/instagram/videos/Db_CweANDwQ.mp4',
    '/media/instagram/images/Db_CweANDwQ.jpg',
    'reels',
    3,
    true
  ),
  (
    'Weekend Jamming Crowd',
    'The whole backyard singing in chorus.',
    '/media/instagram/videos/DZrlORqtNmd.mp4',
    '/media/instagram/images/DZrlORqtNmd.jpg',
    'reels',
    4,
    true
  );

-- 6. Gallery Items
INSERT INTO public.gallery_items (title, caption, media_type, media_path, thumbnail_path, alt_text, display_order, is_published)
VALUES
  (
    'Monsoon Backyard Canopy',
    'Rainy evenings, fairy lights, and hot coffee at Yaari Social Backyard.',
    'image',
    '/media/instagram/images/DauajytN5En.jpg',
    '/media/instagram/images/DauajytN5En.jpg',
    'Monsoon backyard setup at Yaari Social',
    1,
    true
  ),
  (
    'Live Music Night with Parshuram',
    'Soulful acoustic performance and singing crowd.',
    'image',
    '/media/instagram/images/DcLMoGnNRJ6.jpg',
    '/media/instagram/images/DcLMoGnNRJ6.jpg',
    'Live musical night poster and performance at Yaari Social',
    2,
    true
  ),
  (
    'Crowd Singing Along',
    'When the whole place sings together.',
    'image',
    '/media/instagram/images/Db_CweANDwQ.jpg',
    '/media/instagram/images/Db_CweANDwQ.jpg',
    'Crowd singing at live music session',
    3,
    true
  ),
  (
    'Fresh Artisan Coffee',
    'Handcrafted hot coffee brewed fresh every day.',
    'image',
    '/media/instagram/images/DbGkhwUq88Z.jpg',
    '/media/instagram/images/DbGkhwUq88Z.jpg',
    'Cup of hot artisan coffee',
    4,
    true
  ),
  (
    'Fairy Lit Backyard Seating',
    'Warm cozy wooden benches under evening ambient glow.',
    'image',
    '/media/instagram/images/DaFNN55NFRy.jpg',
    '/media/instagram/images/DaFNN55NFRy.jpg',
    'Cozy seating area with lights',
    5,
    true
  ),
  (
    'Late Evening Conversations',
    'Unfiltered laughter with your favorite people.',
    'image',
    '/media/instagram/images/DYpeZ4WAzaB.jpg',
    '/media/instagram/images/DYpeZ4WAzaB.jpg',
    'Friends enjoying snacks and drinks',
    6,
    true
  );
