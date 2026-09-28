-- ============================================================
--  KHELOINDIA — Seed Data (Demo / Sample)
--  All data below is fictional and for academic demonstration.
-- ============================================================
USE kheloindia;

-- ============================================================
-- SPORTS
-- ============================================================
INSERT INTO sports (sport_id, sport_name, description, image, status) VALUES
(1, 'Cricket',   'The gentleman\'s game — bat, ball and the spirit of cricket.', 'images/cricket.jpg',   'active'),
(2, 'Football',  'The beautiful game — pass, dribble, score.', 'images/football.avif',  'active'),
(3, 'Badminton', 'Fast reflexes, sharp smashes, pure agility.', 'images/badminton.jpg',  'active'),
(4, 'Kabaddi',   'Raid, tackle and dominate in this high-energy contact sport.', 'images/kabbadi.jpg',   'active'),
(5, 'Chess',     'Every move counts. Strategy and intellect on the board.', 'images/chess.avif',    'active');

-- ============================================================
-- FACILITIES
-- ============================================================
INSERT INTO facilities (facility_id, facility_name) VALUES
(1, 'Parking'),
(2, 'Changing Room'),
(3, 'Drinking Water'),
(4, 'Washroom'),
(5, 'Flood Lights'),
(6, 'Equipment Rental'),
(7, 'First Aid'),
(8, 'Canteen');

-- ============================================================
-- VENUES (15 Demo Mumbai-area grounds — fictional demo data)
-- ============================================================
INSERT INTO venues (venue_id, venue_name, address, area, city, description, opening_time, closing_time, rating, price_per_hour, image, status) VALUES
(1,  'Dadar Multi-Sports Arena',      'Near Dadar Station, Dadar West',      'Dadar',       'Mumbai', 'A large multi-sport complex near Dadar station offering cricket, football and badminton simultaneously.',      '06:00:00', '22:00:00', 4.8, 800.00,  'images/cricket.jpg',   'active'),
(2,  'Andheri Sports Hub',            'Marol Industrial Area, Andheri East', 'Andheri',     'Mumbai', 'Modern indoor and outdoor sports facility in the heart of Andheri.',                                         '05:30:00', '23:00:00', 4.6, 900.00,  'images/football.avif', 'active'),
(3,  'Borivali PlayZone',             'Near Borivali National Park Gate',    'Borivali',    'Mumbai', 'Spacious grounds adjacent to the national park, perfect for weekend sports.',                                 '06:00:00', '21:00:00', 4.5, 700.00,  'images/badminton.jpg', 'active'),
(4,  'Bandra Grounds Complex',        'Carter Road, Bandra West',            'Bandra',      'Mumbai', 'Sea-view sports complex with premium turf and floodlit courts.',                                             '06:00:00', '22:00:00', 4.9, 1200.00, 'images/cricket.jpg',   'active'),
(5,  'Kurla Sports Centre',           'LBS Marg, Kurla West',                'Kurla',       'Mumbai', 'Affordable multi-sport centre serving the central Mumbai community.',                                        '05:00:00', '22:00:00', 4.3, 600.00,  'images/football.avif', 'active'),
(6,  'Powai Sports Galaxy',           'Near Hiranandani Gardens, Powai',     'Powai',       'Mumbai', 'Premium lakeside sports complex with state-of-the-art facilities.',                                         '06:00:00', '23:00:00', 4.7, 1100.00, 'images/badminton.jpg', 'active'),
(7,  'Ghatkopar Sports Ground',       'Pantnagar, Ghatkopar East',           'Ghatkopar',   'Mumbai', 'Community sports ground with multiple pitches and covered badminton courts.',                                '06:00:00', '21:30:00', 4.2, 650.00,  'images/kabbadi.jpg',   'active'),
(8,  'Mulund Recreation Centre',      'Near Mulund Check Naka, Mulund West', 'Mulund',      'Mumbai', 'Well-maintained recreation centre with cricket nets and football ground.',                                   '06:00:00', '21:00:00', 4.4, 750.00,  'images/chess.avif',    'active'),
(9,  'Vile Parle Sports Academy',     'Irla, Vile Parle West',               'Vile Parle',  'Mumbai', 'Academy-grade facility with coaching available alongside bookable slots.',                                  '05:30:00', '22:00:00', 4.6, 950.00,  'images/cricket.jpg',   'active'),
(10, 'Chembur Open Grounds',          'Govandi Road, Chembur',               'Chembur',     'Mumbai', 'Open grounds with natural turf, ideal for cricket and kabaddi.',                                            '06:00:00', '20:00:00', 4.1, 500.00,  'images/kabbadi.jpg',   'active'),
(11, 'Kandivali Sports Village',      'Thakur Village, Kandivali East',      'Kandivali',   'Mumbai', 'Large sports village with five separate play areas for different sports.',                                  '06:00:00', '22:00:00', 4.5, 800.00,  'images/football.avif', 'active'),
(12, 'Goregaon Sports Club',          'Film City Road, Goregaon East',       'Goregaon',    'Mumbai', 'Club-style facilities with membership and pay-per-slot options.',                                           '06:00:00', '22:30:00', 4.7, 1000.00, 'images/badminton.jpg', 'active'),
(13, 'Lower Parel Arena',             'Senapati Bapat Marg, Lower Parel',    'Lower Parel', 'Mumbai', 'Urban sports arena in the heart of Mumbai\'s commercial district.',                                        '07:00:00', '23:00:00', 4.8, 1300.00, 'images/cricket.jpg',   'active'),
(14, 'Thane Sports Complex',          'Ghantali Road, Thane West',           'Thane',       'Mumbai', 'Suburban sports complex with ample parking and multi-sport facilities.',                                    '06:00:00', '21:00:00', 4.3, 650.00,  'images/football.avif', 'active'),
(15, 'Navi Mumbai Sports Township',   'Sector 9, Vashi, Navi Mumbai',        'Navi Mumbai', 'Mumbai', 'Planned sports township with the largest ground capacity in the MMR.',                                     '05:00:00', '23:00:00', 4.6, 850.00,  'images/chess.avif',    'active');

-- ============================================================
-- VENUE_SPORTS
-- ============================================================
INSERT INTO venue_sports (venue_id, sport_id, available_capacity) VALUES
-- Dadar: Cricket + Football + Badminton
(1,1,1),(1,2,1),(1,3,2),
-- Andheri: Football + Badminton + Cricket
(2,2,1),(2,3,3),(2,1,1),
-- Borivali: Cricket + Football + Kabaddi
(3,1,1),(3,2,1),(3,4,1),
-- Bandra: Cricket + Badminton + Chess
(4,1,2),(4,3,4),(4,5,2),
-- Kurla: Football + Kabaddi
(5,2,1),(5,4,1),
-- Powai: Cricket + Football + Badminton + Chess
(6,1,1),(6,2,1),(6,3,2),(6,5,2),
-- Ghatkopar: Football + Kabaddi + Badminton
(7,2,1),(7,4,1),(7,3,2),
-- Mulund: Cricket + Football
(8,1,1),(8,2,1),
-- Vile Parle: Cricket + Badminton
(9,1,1),(9,3,3),
-- Chembur: Cricket + Kabaddi
(10,1,1),(10,4,1),
-- Kandivali: All 5 sports
(11,1,1),(11,2,1),(11,3,2),(11,4,1),(11,5,2),
-- Goregaon: Cricket + Football + Badminton
(12,1,1),(12,2,1),(12,3,2),
-- Lower Parel: Cricket + Badminton + Chess
(13,1,2),(13,3,4),(13,5,3),
-- Thane: Football + Cricket + Kabaddi
(14,2,1),(14,1,1),(14,4,1),
-- Navi Mumbai: All 5 sports
(15,1,2),(15,2,2),(15,3,4),(15,4,2),(15,5,4);

-- ============================================================
-- VENUE_FACILITIES
-- ============================================================
INSERT INTO venue_facilities (venue_id, facility_id) VALUES
-- Dadar: all facilities
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),
-- Andheri
(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,8),
-- Borivali
(3,1),(3,3),(3,4),(3,5),
-- Bandra: premium
(4,1),(4,2),(4,3),(4,4),(4,5),(4,6),(4,7),(4,8),
-- Kurla: basic
(5,3),(5,4),(5,5),
-- Powai
(6,1),(6,2),(6,3),(6,4),(6,5),(6,6),(6,8),
-- Ghatkopar
(7,1),(7,3),(7,4),(7,5),
-- Mulund
(8,1),(8,3),(8,4),(8,5),
-- Vile Parle
(9,1),(9,2),(9,3),(9,4),(9,5),(9,6),
-- Chembur
(10,3),(10,4),
-- Kandivali
(11,1),(11,2),(11,3),(11,4),(11,5),(11,6),(11,7),
-- Goregaon
(12,1),(12,2),(12,3),(12,4),(12,5),(12,8),
-- Lower Parel: premium
(13,1),(13,2),(13,3),(13,4),(13,5),(13,6),(13,7),(13,8),
-- Thane
(14,1),(14,3),(14,4),(14,5),
-- Navi Mumbai
(15,1),(15,2),(15,3),(15,4),(15,5),(15,6),(15,7),(15,8);

-- ============================================================
-- DEMO USERS
-- ============================================================
INSERT INTO users (user_id, full_name, email, phone, password) VALUES
(1, 'Arjun Sharma',    'arjun@demo.com',    '9876543210', '$2a$10$demohashedpassword1111111111111111111111111'),
(2, 'Priya Mehta',     'priya@demo.com',    '9876543211', '$2a$10$demohashedpassword2222222222222222222222222'),
(3, 'Rohan Patil',     'rohan@demo.com',    '9876543212', '$2a$10$demohashedpassword3333333333333333333333333'),
(4, 'Sneha Joshi',     'sneha@demo.com',    '9876543213', '$2a$10$demohashedpassword4444444444444444444444444'),
(5, 'Vikram Desai',    'vikram@demo.com',   '9876543214', '$2a$10$demohashedpassword5555555555555555555555555');

-- ============================================================
-- DEMO ADMIN
-- ============================================================
INSERT INTO admins (admin_id, name, email, password) VALUES
(1, 'Admin KheloIndia', 'admin@kheloindia.com', '$2a$10$adminhashedpassword000000000000000000000000000');

-- ============================================================
-- SAMPLE TIME SLOTS (for today: 2026-09-28, venue 1 = Dadar)
-- ============================================================
INSERT INTO time_slots (venue_id, sport_id, slot_date, start_time, end_time, capacity, available_capacity, status) VALUES
-- Dadar, Cricket, today
(1,1,'2026-09-28','06:00:00','07:00:00',1,1,'AVAILABLE'),
(1,1,'2026-09-28','07:00:00','08:00:00',1,0,'BOOKED'),
(1,1,'2026-09-28','08:00:00','09:00:00',1,1,'AVAILABLE'),
(1,1,'2026-09-28','09:00:00','10:00:00',1,1,'AVAILABLE'),
(1,1,'2026-09-28','10:00:00','11:00:00',1,0,'BOOKED'),
(1,1,'2026-09-28','17:00:00','18:00:00',1,1,'AVAILABLE'),
(1,1,'2026-09-28','18:00:00','19:00:00',1,1,'AVAILABLE'),
(1,1,'2026-09-28','19:00:00','20:00:00',1,0,'BOOKED'),
-- Dadar, Football, today
(1,2,'2026-09-28','06:00:00','07:00:00',1,1,'AVAILABLE'),
(1,2,'2026-09-28','07:00:00','08:00:00',1,1,'AVAILABLE'),
(1,2,'2026-09-28','18:00:00','19:00:00',1,0,'BOOKED'),
(1,2,'2026-09-28','19:00:00','20:00:00',1,1,'AVAILABLE'),
-- Dadar, Badminton, today (2 courts capacity)
(1,3,'2026-09-28','06:00:00','07:00:00',2,2,'AVAILABLE'),
(1,3,'2026-09-28','07:00:00','08:00:00',2,1,'PARTIAL'),
(1,3,'2026-09-28','08:00:00','09:00:00',2,0,'BOOKED'),
(1,3,'2026-09-28','18:00:00','19:00:00',2,1,'PARTIAL'),
(1,3,'2026-09-28','19:00:00','20:00:00',2,2,'AVAILABLE'),
-- Andheri, Football, today
(2,2,'2026-09-28','06:00:00','07:00:00',1,1,'AVAILABLE'),
(2,2,'2026-09-28','07:00:00','08:00:00',1,0,'BOOKED'),
(2,2,'2026-09-28','17:00:00','18:00:00',1,1,'AVAILABLE'),
(2,2,'2026-09-28','18:00:00','19:00:00',1,1,'AVAILABLE'),
-- Bandra, Cricket, today
(4,1,'2026-09-28','06:00:00','07:00:00',2,2,'AVAILABLE'),
(4,1,'2026-09-28','07:00:00','08:00:00',2,1,'PARTIAL'),
(4,1,'2026-09-28','18:00:00','19:00:00',2,0,'BOOKED'),
(4,1,'2026-09-28','19:00:00','20:00:00',2,2,'AVAILABLE'),
-- Powai, Cricket, today
(6,1,'2026-09-28','06:00:00','07:00:00',1,1,'AVAILABLE'),
(6,1,'2026-09-28','17:00:00','18:00:00',1,1,'AVAILABLE'),
(6,1,'2026-09-28','18:00:00','19:00:00',1,0,'BOOKED');

-- ============================================================
-- SAMPLE BOOKINGS
-- ============================================================
INSERT INTO bookings (booking_id, user_id, venue_id, sport_id, slot_id, booking_date, start_time, end_time, amount, booking_status, payment_status) VALUES
(1, 1, 1, 1, 2,  '2026-09-28', '07:00:00', '08:00:00', 800.00,  'CONFIRMED',  'PAID'),
(2, 2, 1, 1, 5,  '2026-09-28', '10:00:00', '11:00:00', 800.00,  'CONFIRMED',  'PAID'),
(3, 3, 1, 3, 15, '2026-09-28', '08:00:00', '09:00:00', 800.00,  'CONFIRMED',  'PAID'),
(4, 1, 4, 1, 23, '2026-09-28', '18:00:00', '19:00:00', 1200.00, 'CONFIRMED',  'PAID'),
(5, 2, 2, 2, 19, '2026-09-28', '07:00:00', '08:00:00', 900.00,  'COMPLETED',  'PAID'),
(6, 4, 6, 1, 27, '2026-09-28', '18:00:00', '19:00:00', 1100.00, 'CONFIRMED',  'PAID'),
(7, 5, 1, 2, 11, '2026-09-28', '18:00:00', '19:00:00', 800.00,  'CANCELLED',  'REFUNDED'),
(8, 3, 2, 2, 20, '2026-09-28', '17:00:00', '18:00:00', 900.00,  'COMPLETED',  'PAID');

-- ============================================================
-- SAMPLE PAYMENTS
-- ============================================================
INSERT INTO payments (payment_id, booking_id, amount, payment_method, transaction_id, payment_status) VALUES
(1, 1, 800.00,  'UPI',  'DEMO-KI-2026-001', 'DEMO_PAID'),
(2, 2, 800.00,  'CARD', 'DEMO-KI-2026-002', 'DEMO_PAID'),
(3, 3, 800.00,  'CASH', 'DEMO-KI-2026-003', 'DEMO_PAID'),
(4, 4, 1200.00, 'UPI',  'DEMO-KI-2026-004', 'DEMO_PAID'),
(5, 5, 900.00,  'UPI',  'DEMO-KI-2026-005', 'DEMO_PAID'),
(6, 6, 1100.00, 'CARD', 'DEMO-KI-2026-006', 'DEMO_PAID'),
(7, 7, 800.00,  'UPI',  'DEMO-KI-2026-007', 'DEMO_REFUNDED'),
(8, 8, 900.00,  'CASH', 'DEMO-KI-2026-008', 'DEMO_PAID');

-- ============================================================
-- SAMPLE REVIEWS
-- ============================================================
INSERT INTO reviews (user_id, venue_id, rating, review_text) VALUES
(1, 1, 5, 'Amazing facility! The cricket pitch is well-maintained and the staff is very helpful.'),
(2, 1, 4, 'Great place for weekend cricket. Floodlights work perfectly for evening sessions.'),
(3, 4, 5, 'Bandra Grounds is easily the best sports complex in Mumbai. Premium quality!'),
(4, 6, 5, 'Powai Sports Galaxy is stunning — lakeside views while playing cricket. Highly recommended!'),
(5, 2, 4, 'Good badminton courts. Slightly pricey but worth it for the quality.'),
(1, 4, 5, 'Sea-facing football ground is incredible. Booked for our college team.'),
(2, 6, 4, 'Great facilities, easy online booking. Would love a canteen inside though.'),
(3, 1, 5, 'Multi-sport support is brilliant — our group played football and badminton simultaneously!');
