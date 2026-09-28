-- ============================================================
--  KHELOINDIA — MySQL Database Schema
--  Sports Ground Booking Platform
--  College Demo Project
-- ============================================================

CREATE DATABASE IF NOT EXISTS kheloindia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kheloindia;

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    user_id       INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    phone         VARCHAR(15)  NOT NULL,
    password      VARCHAR(255) NOT NULL COMMENT 'bcrypt hashed',
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- ============================================================
-- 2. SPORTS
-- ============================================================
CREATE TABLE IF NOT EXISTS sports (
    sport_id      INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sport_name    VARCHAR(80)  NOT NULL UNIQUE,
    description   TEXT,
    image         VARCHAR(255),
    status        ENUM('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB;

-- ============================================================
-- 3. VENUES
-- ============================================================
CREATE TABLE IF NOT EXISTS venues (
    venue_id       INT           UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    venue_name     VARCHAR(150)  NOT NULL,
    address        VARCHAR(300)  NOT NULL,
    area           VARCHAR(80)   NOT NULL,
    city           VARCHAR(80)   NOT NULL DEFAULT 'Mumbai',
    description    TEXT,
    opening_time   TIME          NOT NULL DEFAULT '06:00:00',
    closing_time   TIME          NOT NULL DEFAULT '22:00:00',
    rating         DECIMAL(2,1)  DEFAULT 4.0 CHECK (rating BETWEEN 1.0 AND 5.0),
    price_per_hour DECIMAL(8,2)  NOT NULL,
    image          VARCHAR(255),
    status         ENUM('active','inactive','maintenance') NOT NULL DEFAULT 'active',
    INDEX idx_venues_area (area),
    INDEX idx_venues_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- 4. VENUE_SPORTS  (Many-to-Many: venues <-> sports)
-- ============================================================
CREATE TABLE IF NOT EXISTS venue_sports (
    venue_sport_id     INT      UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    venue_id           INT      UNSIGNED NOT NULL,
    sport_id           INT      UNSIGNED NOT NULL,
    available_capacity INT      UNSIGNED NOT NULL DEFAULT 1,
    UNIQUE KEY uq_venue_sport (venue_id, sport_id),
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 5. FACILITIES
-- ============================================================
CREATE TABLE IF NOT EXISTS facilities (
    facility_id   INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    facility_name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ============================================================
-- 6. VENUE_FACILITIES  (Many-to-Many: venues <-> facilities)
-- ============================================================
CREATE TABLE IF NOT EXISTS venue_facilities (
    venue_id    INT UNSIGNED NOT NULL,
    facility_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (venue_id, facility_id),
    FOREIGN KEY (venue_id)    REFERENCES venues(venue_id)    ON DELETE CASCADE,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 7. TIME_SLOTS
--    Supports multiple sports at the same venue simultaneously.
--    Each row = one sport's availability at a venue for a time block.
-- ============================================================
CREATE TABLE IF NOT EXISTS time_slots (
    slot_id            INT      UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    venue_id           INT      UNSIGNED NOT NULL,
    sport_id           INT      UNSIGNED NOT NULL,
    slot_date          DATE     NOT NULL,
    start_time         TIME     NOT NULL,
    end_time           TIME     NOT NULL,
    capacity           INT      UNSIGNED NOT NULL DEFAULT 1,
    available_capacity INT      UNSIGNED NOT NULL DEFAULT 1,
    status             ENUM('AVAILABLE','PARTIAL','BOOKED','UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE',
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE,
    INDEX idx_slots_venue_date  (venue_id, slot_date),
    INDEX idx_slots_sport_date  (sport_id, slot_date),
    INDEX idx_slots_status      (status),
    UNIQUE KEY uq_slot (venue_id, sport_id, slot_date, start_time)
) ENGINE=InnoDB;

-- ============================================================
-- 8. BOOKINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
    booking_id     INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id        INT          UNSIGNED NOT NULL,
    venue_id       INT          UNSIGNED NOT NULL,
    sport_id       INT          UNSIGNED NOT NULL,
    slot_id        INT          UNSIGNED NOT NULL,
    booking_date   DATE         NOT NULL,
    start_time     TIME         NOT NULL,
    end_time       TIME         NOT NULL,
    amount         DECIMAL(8,2) NOT NULL,
    booking_status ENUM('CONFIRMED','CANCELLED','COMPLETED') NOT NULL DEFAULT 'CONFIRMED',
    payment_status ENUM('PENDING','PAID','REFUNDED')         NOT NULL DEFAULT 'PENDING',
    created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)  REFERENCES users(user_id)      ON DELETE RESTRICT,
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id)    ON DELETE RESTRICT,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id)    ON DELETE RESTRICT,
    FOREIGN KEY (slot_id)  REFERENCES time_slots(slot_id) ON DELETE RESTRICT,
    INDEX idx_bookings_user       (user_id),
    INDEX idx_bookings_venue_date (venue_id, booking_date),
    INDEX idx_bookings_status     (booking_status)
) ENGINE=InnoDB;

-- ============================================================
-- 9. PAYMENTS  (1:1 with bookings — demo only, no real gateway)
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    payment_id     INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id     INT          UNSIGNED NOT NULL UNIQUE,
    amount         DECIMAL(8,2) NOT NULL,
    payment_method ENUM('UPI','CARD','CASH') NOT NULL DEFAULT 'UPI',
    transaction_id VARCHAR(100) NOT NULL COMMENT 'DEMO reference ID',
    payment_status ENUM('DEMO_PAID','DEMO_PENDING','DEMO_REFUNDED') NOT NULL DEFAULT 'DEMO_PENDING',
    payment_date   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 10. REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    review_id   INT      UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT      UNSIGNED NOT NULL,
    venue_id    INT      UNSIGNED NOT NULL,
    rating      TINYINT  UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)  REFERENCES users(user_id)   ON DELETE CASCADE,
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE,
    INDEX idx_reviews_venue (venue_id)
) ENGINE=InnoDB;

-- ============================================================
-- 11. ADMINS
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
    admin_id  INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(100) NOT NULL,
    email     VARCHAR(150) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL COMMENT 'bcrypt hashed'
) ENGINE=InnoDB;
