# KheloIndia 🏃
### Sports Ground Booking Platform — Mumbai
**College Group Project | Academic Demo**

> Find. Book. Play.

---

## ⚠️ Important Disclaimer

> **All venue data in this project is fictional and created for academic demonstration purposes only.**
> Payment processing is **fully simulated** — no real money is involved at any point.
> This is a college group project and not a commercial product.

---

## 🏗️ Architecture

```
User (Browser)
      ↓
Frontend: HTML + CSS + JavaScript
      ↓
Backend REST API: Node.js + Express
      ↓
Database: MySQL (Relational)
```

---

## 📁 Project Structure

```
KHELOINDIA/
├── frontend/
│   ├── index.html          ← Homepage (14 sections)
│   ├── venues.html         ← Venues listing + filters
│   ├── my-bookings.html    ← User booking history
│   ├── admin/
│   │   └── index.html      ← Admin dashboard
│   ├── css/
│   │   └── style.css       ← Full design system
│   ├── js/
│   │   ├── data.js         ← Demo venue/slot data
│   │   └── main.js         ← All frontend logic
│   └── images/             ← Sport images
│       ├── cricket.jpg
│       ├── football.avif
│       ├── badminton.jpg
│       ├── kabbadi.jpg
│       └── chess.avif
│
├── backend/
│   ├── server.js           ← Express server
│   ├── config/
│   │   └── db.js           ← MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── venueController.js
│   │   ├── bookingController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── sports.js
│   │   ├── venues.js
│   │   ├── bookings.js
│   │   ├── reviews.js
│   │   └── admin.js
│   └── middleware/
│       └── auth.js         ← JWT middleware
│
├── database/
│   ├── schema.sql          ← CREATE TABLE statements
│   ├── seed.sql            ← INSERT sample data
│   └── database.sql        ← Combined (schema + seed)
│
├── .env.example            ← Environment variable template
├── package.json
└── README.md
```

---

## ⚙️ Prerequisites

| Tool    | Version  | Download |
|---------|----------|----------|
| Node.js | 18+      | https://nodejs.org |
| MySQL   | 8.0+     | https://dev.mysql.com/downloads |
| npm     | 9+       | (comes with Node.js) |

---

## 🚀 Setup Instructions

### Step 1: Install MySQL

1. Download MySQL Community Server from https://dev.mysql.com/downloads/mysql/
2. Run the installer and follow the setup wizard.
3. Set a root password and remember it.
4. Start the MySQL service.

### Step 2: Create the Database

Open your terminal and run:

```bash
mysql -u root -p
```

Then inside MySQL:

```sql
CREATE DATABASE kheloindia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Step 3: Import the Database

Navigate to the `KHELOINDIA` folder:

```bash
# Import schema
mysql -u root -p kheloindia < database/schema.sql

# Import seed data
mysql -u root -p kheloindia < database/seed.sql
```

Or import the combined file:

```bash
mysql -u root -p < database/database.sql
```

### Step 4: Configure Environment

Copy the example env file:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=kheloindia
JWT_SECRET=your_secret_key_here
PORT=3000
```

### Step 5: Install Node.js Dependencies

```bash
npm install
```

### Step 6: Start the Backend Server

```bash
npm start
```

Or with auto-restart during development:

```bash
npm run dev
```

You should see:
```
✅ MySQL connected successfully
🚀 KHELOINDIA server running at http://localhost:3000
📊 Admin panel: http://localhost:3000/admin/
```

### Step 7: Open in Browser

- **Homepage**: http://localhost:3000
- **Venues**: http://localhost:3000/venues.html
- **My Bookings**: http://localhost:3000/my-bookings.html
- **Admin Panel**: http://localhost:3000/admin/

> **Without backend**: You can also open `frontend/index.html` directly in your browser — the frontend works fully with demo data and localStorage.

---

## 🗄️ Database Schema

### Tables

| Table              | Description |
|--------------------|-------------|
| `users`            | Registered users |
| `sports`           | Available sports |
| `venues`           | Sports grounds |
| `venue_sports`     | Which sports a venue supports (many-to-many) |
| `facilities`       | Facility types (Parking, Flood Lights, etc.) |
| `venue_facilities` | Which facilities a venue has (many-to-many) |
| `time_slots`       | Bookable time slots per venue + sport |
| `bookings`         | User bookings |
| `payments`         | Demo payment records |
| `reviews`          | User reviews |
| `admins`           | Admin accounts |

### Key Relationships

```
users       1 ──── N   bookings
venues      1 ──── N   time_slots
sports      1 ──── N   time_slots
venues      N ──── N   sports      (through venue_sports)
venues      N ──── N   facilities  (through venue_facilities)
bookings    1 ──── 1   payments
users       1 ──── N   reviews
venues      1 ──── N   reviews
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint                    | Description |
|--------|-----------------------------|-------------|
| POST   | `/api/auth/register`        | Register user |
| POST   | `/api/auth/login`           | Login user |
| POST   | `/api/auth/admin/login`     | Login admin |

### Sports
| Method | Endpoint          | Description |
|--------|-------------------|-------------|
| GET    | `/api/sports`     | List all sports |

### Venues
| Method | Endpoint                        | Description |
|--------|---------------------------------|-------------|
| GET    | `/api/venues`                   | List venues (filterable) |
| GET    | `/api/venues/:id`               | Venue details |
| GET    | `/api/venues/:id/availability`  | Time slots |

### Bookings (requires auth)
| Method | Endpoint                   | Description |
|--------|----------------------------|-------------|
| POST   | `/api/bookings`            | Create booking (transactional) |
| GET    | `/api/bookings`            | User's bookings |
| GET    | `/api/bookings/:id`        | Single booking |
| PUT    | `/api/bookings/:id/cancel` | Cancel booking |

### Reviews
| Method | Endpoint                 | Description |
|--------|--------------------------|-------------|
| GET    | `/api/reviews/:venueId`  | Venue reviews |
| POST   | `/api/reviews`           | Submit review (auth) |

### Admin (requires admin auth)
| Method | Endpoint                          | Description |
|--------|-----------------------------------|-------------|
| GET    | `/api/admin/stats`                | Dashboard stats |
| GET    | `/api/admin/bookings`             | All bookings |
| GET    | `/api/admin/users`                | All users |
| POST   | `/api/admin/venues`               | Add venue |
| PUT    | `/api/admin/venues/:id/status`    | Update venue status |
| POST   | `/api/admin/slots`                | Create time slots |
| PUT    | `/api/admin/bookings/:id/cancel`  | Cancel booking |

---

## 🔒 Booking Transaction Logic

When a user books a slot, the backend uses a MySQL **TRANSACTION** to prevent double-booking:

```sql
BEGIN TRANSACTION;

  -- Lock the slot row to prevent race conditions
  SELECT * FROM time_slots WHERE slot_id = ? FOR UPDATE;

  -- Verify slot is still available
  IF available_capacity > 0 THEN
    INSERT INTO bookings (...);
    UPDATE time_slots SET available_capacity = available_capacity - 1;
    UPDATE time_slots SET status = (BOOKED if capacity=0, else PARTIAL);
    INSERT INTO payments (...);
    COMMIT;
  ELSE
    ROLLBACK;
    RETURN "This slot is no longer available.";
  END IF;
```

---

## 💳 Payment (Demo Only)

> **No real payment gateway is used. This is a college demonstration project.**

The payment screen shows three demo methods:
- **UPI (Demo)** — simulated
- **Credit/Debit Card (Demo)** — simulated
- **Cash at Venue** — pay on arrival

A 2-second processing animation is shown, then a confirmation with a `DEMO-KI-XXXXXX` transaction ID is displayed.

The `payments` table stores `payment_status` as `DEMO_PAID`, `DEMO_PENDING`, or `DEMO_REFUNDED`.

---

## 🎨 Availability Color System

| Color  | Meaning           |
|--------|-------------------|
| 🟢 Green  | Available |
| 🟠 Orange | Partially Available |
| 🔴 Red    | Fully Booked |
| ⚫ Gray   | Unavailable |

This color coding is consistent across all pages and sections.

---

## 🏟️ Multi-Sport Venue Support

Large venues can run **multiple sports simultaneously** using the `venue_sports` junction table and independent `time_slots` rows per `(venue_id, sport_id)` combination.

Example:
```
Dadar Multi-Sports Arena at 6:00 PM:

Football Field A → AVAILABLE  (can be booked)
Cricket Pitch    → BOOKED     (occupied)
Badminton Ct. 1  → AVAILABLE  (can be booked)
Badminton Ct. 2  → PARTIAL    (1 of 2 spots taken)
```

Booking football does NOT affect cricket or badminton availability.

---

## 🔐 Security Practices

- Passwords hashed with **bcrypt** (10 rounds)
- Authentication via **JWT** tokens
- **Parameterized queries** — no raw SQL string interpolation
- Server-side availability checks before confirming bookings
- Input validation on all endpoints
- Errors shown as user-friendly messages (raw SQL never exposed)

---

## 📱 Frontend Features

- ✅ Fully responsive (desktop, tablet, mobile)
- ✅ Sticky navbar with hamburger menu
- ✅ 5-slide hero carousel with auto-play, dots, swipe support
- ✅ Sport + Location + Date search bar
- ✅ Venue cards with availability badges
- ✅ Sidebar filter system (sport, area, price, rating)
- ✅ Interactive slot grid (green/orange/red)
- ✅ 5-step booking modal
- ✅ Demo payment screen with processing animation
- ✅ Booking confirmation with ID
- ✅ My Bookings page with status tabs
- ✅ Admin dashboard with stats, tables, forms
- ✅ Scroll animations (IntersectionObserver)
- ✅ Stats counter animation
- ✅ Toast notifications
- ✅ ESC key closes modals

---

## 👥 Team

College Group Project — KHELOINDIA
Mumbai, Maharashtra

---

*Built with ❤️ using HTML, CSS, JavaScript, Node.js, Express, and MySQL*
