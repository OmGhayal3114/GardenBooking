// ============================================================
//  KHELOINDIA — Main JavaScript
//  Hero slider, navbar, scroll animations, search, stats counter
// ============================================================

/* ── Navbar ─────────────────────────────────────────────────── */
(function initNavbar() {
    const navbar    = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu= document.querySelector('.mobile-menu');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.href === window.location.href) link.classList.add('active');
    });

    // Hamburger toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
            }
        });
    }
})();

/* ── Hero Slider ─────────────────────────────────────────────── */
(function initHeroSlider() {
    const scrollEl = document.querySelector('.hero-scroll');
    const slider   = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = document.querySelectorAll('.hero-slide');
    const dots   = document.querySelectorAll('.hero-dot');
    const total  = slides.length;
    let current  = 0;
    let timer    = null;
    let isPaused = false;

    // Clone first slide for seamless loop
    const firstClone = slides[0].cloneNode(true);
    slider.appendChild(firstClone);

    function goTo(idx, animate = true) {
        if (!animate) {
            slider.style.transition = 'none';
        } else {
            slider.style.transition = 'transform 0.8s cubic-bezier(0.77,0,0.18,1)';
        }
        slider.style.transform = `translateX(-${idx * 100}%)`;

        // Update dots (only for real slides)
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === (idx % total));
        });
        current = idx;
    }

    slider.addEventListener('transitionend', () => {
        if (current === total) {
            goTo(0, false);
            // Force reflow
            void slider.offsetHeight;
        }
    });

    function next() {
        goTo(current + 1);
    }

    function startTimer() {
        timer = setInterval(next, 4000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    // Dot click
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            stopTimer();
            goTo(i);
            startTimer();
        });
    });

    // Pause on hover
    if (scrollEl) {
        scrollEl.addEventListener('mouseenter', () => { isPaused = true; stopTimer(); });
        scrollEl.addEventListener('mouseleave', () => { isPaused = false; startTimer(); });
    }

    // Touch swipe
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; stopTimer(); });
    slider.addEventListener('touchend',   (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) next();
            else goTo(Math.max(0, current - 1));
        }
        startTimer();
    });

    goTo(0, false);
    startTimer();
})();

/* ── Search Bar ─────────────────────────────────────────────── */
(function initSearchBar() {
    const searchBtn = document.getElementById('hero-search-btn');
    if (!searchBtn) return;

    // Set today's date as default
    const dateInput = document.getElementById('search-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.min = today;
    }

    searchBtn.addEventListener('click', () => {
        const sport    = document.getElementById('search-sport').value;
        const location = document.getElementById('search-location').value;
        const date     = document.getElementById('search-date').value;

        // Build query string and navigate to venues page
        const params = new URLSearchParams();
        if (sport    && sport !== 'all')    params.set('sport',    sport);
        if (location && location !== 'all') params.set('location', location);
        if (date)                           params.set('date',     date);

        window.location.href = `venues.html?${params.toString()}`;
    });
})();

/* ── Scroll Animation (IntersectionObserver) ────────────────── */
(function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
})();

/* ── Stats Counter ──────────────────────────────────────────── */
(function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number[data-target]');
    if (!stats.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el     = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || '';
            const dur    = 1800;
            const step   = Math.ceil(target / (dur / 16));
            let cur      = 0;

            const tick = () => {
                cur = Math.min(cur + step, target);
                el.textContent = cur + suffix;
                if (cur < target) requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    stats.forEach(el => observer.observe(el));
})();

/* ── Sport Tab Filter (Availability Section) ────────────────── */
(function initSportTabs() {
    const tabs = document.querySelectorAll('.sport-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const sport = tab.dataset.sport;
            renderSlots(sport);
        });
    });
})();

/* ── Slots Renderer (Availability Demo) ─────────────────────── */
function renderSlots(sport) {
    const grid = document.getElementById('slots-grid');
    if (!grid || !window.KI) return;

    const venue = KI.venues.find(v => v.id === 1); // Dadar as demo
    if (!venue || !venue.slots[sport]) return;

    grid.innerHTML = venue.slots[sport].map(slot => `
        <div class="slot-item ${slot.status} fade-up" data-slot-id="${slot.id}" onclick="selectSlot(this, '${slot.status}', '${slot.time}', '${venue.name}', '${sport}', ${venue.price})">
            <span class="slot-time">${slot.time}</span>
            <span class="slot-badge">${slot.status === 'available' ? 'AVAILABLE' : slot.status === 'partial' ? 'PARTIAL' : slot.status === 'booked' ? 'BOOKED' : 'UNAVAILABLE'}</span>
        </div>
    `).join('');

    // Re-observe for animations
    document.querySelectorAll('.slot-item.fade-up').forEach(el => {
        setTimeout(() => el.classList.add('visible'), 50);
    });
}

/* ── Slot Selection ─────────────────────────────────────────── */
let selectedSlotData = null;

function selectSlot(el, status, time, venueName, sport, price) {
    if (status === 'booked' || status === 'unavailable') {
        showToast('This slot is not available.', 'error');
        return;
    }

    document.querySelectorAll('.slot-item.selected').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');

    selectedSlotData = { time, venueName, sport, price };

    // Update the "Book Selected Slot" button if it exists
    const bookBtn = document.getElementById('book-selected-slot');
    if (bookBtn) {
        bookBtn.disabled = false;
        bookBtn.textContent = `Book "${time}" — ₹${price}`;
    }
}

/* ── Toast Notifications ────────────────────────────────────── */
function showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container');
    if (!container) return;

    const icons = { success: '✅', error: '❌', info: '💡' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || '💡'}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

/* ── Venue Cards Renderer (Homepage) ───────────────────────── */
function renderHomeVenues(filtered = null) {
    const grid = document.getElementById('venues-grid');
    if (!grid || !window.KI) return;

    const list = filtered || KI.venues.slice(0, 6);

    grid.innerHTML = list.map(v => `
        <div class="venue-card fade-up">
            <div class="venue-card-img">
                <img src="${v.image}" alt="${v.name}" loading="lazy" onerror="this.style.background='linear-gradient(135deg,#0b3d2e,#0B0F14)';this.style.display='none'">
                <span class="venue-availability-badge badge-${v.availability}">
                    ${v.availability === 'available' ? '✓ Available' : v.availability === 'partial' ? '◑ Partial' : '✗ Full'}
                </span>
                <span class="venue-distance">📍 ${v.distance}</span>
            </div>
            <div class="venue-card-body">
                <h3 class="venue-card-name">${v.name}</h3>
                <p class="venue-card-location">📍 ${v.area}, ${v.city}</p>
                <div class="venue-sports-tags">
                    ${v.sports.map(s => `<span class="sport-tag">${s}</span>`).join('')}
                </div>
                <div class="venue-meta">
                    <span class="venue-rating">⭐ ${v.rating}</span>
                    <span class="venue-price">₹${v.price.toLocaleString('en-IN')}<span>/hr</span></span>
                </div>
                <div class="venue-card-actions">
                    <button class="btn-outline" onclick="openVenueModal(${v.id})">View Details</button>
                    <button class="btn-book" onclick="startBooking(${v.id})">Book Now</button>
                </div>
            </div>
        </div>
    `).join('');

    // Animate cards
    document.querySelectorAll('.venue-card.fade-up').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 80);
    });
}

/* ── Sport Cards Renderer ──────────────────────────────────── */
function renderSportCards() {
    const grid = document.getElementById('sports-grid');
    if (!grid || !window.KI) return;

    grid.innerHTML = KI.sports.map(s => `
        <div class="sport-card fade-up" onclick="filterBySport('${s.name}')">
            <img src="${s.image}" alt="${s.name}" loading="lazy" onerror="this.style.display='none'">
            <div class="sport-card-overlay">
                <span class="sport-card-emoji">${s.emoji}</span>
                <p class="sport-card-name">${s.name}</p>
                <p class="sport-card-count">${s.venues} venues available</p>
                <button class="sport-card-btn" onclick="event.stopPropagation(); filterBySport('${s.name}')">Explore</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.sport-card.fade-up').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 80);
    });
}

/* ── Filter by sport (venue section) ──────────────────────── */
function filterBySport(sport) {
    const section = document.getElementById('venues-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });

    // Highlight the sport filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sport === sport || btn.dataset.sport === 'all' && !sport);
    });

    const filtered = sport === 'All' || !sport
        ? KI.venues.slice(0, 6)
        : KI.venues.filter(v => v.sports.includes(sport));

    renderHomeVenues(filtered);
}

/* ── Venue Modal ────────────────────────────────────────────── */
function openVenueModal(venueId) {
    const venue = window.KI.venues.find(v => v.id === venueId);
    if (!venue) return;

    const overlay = document.getElementById('venue-modal-overlay');
    const modal   = document.getElementById('venue-modal');

    document.getElementById('modal-img').src          = venue.image;
    document.getElementById('modal-img').alt          = venue.name;
    document.getElementById('modal-name').textContent = venue.name;
    document.getElementById('modal-location').textContent = `📍 ${venue.address}`;
    document.getElementById('modal-rating').textContent   = `⭐ ${venue.rating} Rating`;
    document.getElementById('modal-price').textContent    = `₹${venue.price.toLocaleString('en-IN')}/hour`;
    document.getElementById('modal-hours').textContent    = `${venue.opening} – ${venue.closing}`;
    document.getElementById('modal-sports-list').textContent = venue.sports.join(', ');

    // Amenities
    const amenEl = document.getElementById('modal-amenities');
    amenEl.innerHTML = venue.facilities.map(f => `
        <div class="amenity-item">
            <span class="check">✓</span>
            <span>${KI.facilityIcons[f] || '•'} ${f}</span>
        </div>
    `).join('');

    // Reviews
    const revEl = document.getElementById('modal-reviews');
    if (venue.reviews.length === 0) {
        revEl.innerHTML = '<p style="color:var(--gray-mid);font-size:13px;">No reviews yet. Be the first!</p>';
    } else {
        revEl.innerHTML = venue.reviews.map(r => `
            <div class="review-card">
                <div class="review-header">
                    <span class="review-name">${r.name}</span>
                    <span class="review-date">${r.date}</span>
                </div>
                <div class="review-stars">${'⭐'.repeat(r.rating)}</div>
                <p class="review-text">${r.text}</p>
            </div>
        `).join('');
    }

    // Sport select for slots
    const sportSel = document.getElementById('modal-sport-select');
    sportSel.innerHTML = venue.sports.map(s => `<option value="${s}">${s}</option>`).join('');

    function loadModalSlots() {
        const sport = sportSel.value;
        const sGrid = document.getElementById('modal-slots-grid');
        const slots = venue.slots[sport] || [];
        sGrid.innerHTML = slots.map(slot => `
            <div class="slot-item ${slot.status}" onclick="selectModalSlot(this, '${slot.status}', '${slot.time}', '${venue.name}', '${sport}', ${venue.price}, ${venue.id}, ${slot.id})">
                <span class="slot-time">${slot.time}</span>
                <span class="slot-badge">${slot.status.toUpperCase()}</span>
            </div>
        `).join('');
    }

    sportSel.addEventListener('change', loadModalSlots);
    loadModalSlots();

    // Book button
    document.getElementById('modal-book-btn').onclick = () => {
        closeVenueModal();
        startBooking(venueId);
    };

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeVenueModal() {
    document.getElementById('venue-modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

function selectModalSlot(el, status, time, venueName, sport, price, venueId, slotId) {
    if (status === 'booked' || status === 'unavailable') {
        showToast('This slot is not available for booking.', 'error');
        return;
    }
    document.querySelectorAll('#modal-slots-grid .slot-item.selected').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');

    selectedSlotData = { time, venueName, sport, price, venueId, slotId };
    showToast(`Slot selected: ${time}`, 'success');
}

/* ── Booking Flow ────────────────────────────────────────────── */
let bookingStep = 1;
let currentBooking = {};

function startBooking(venueId) {
    const venue = window.KI.venues.find(v => v.id === venueId);
    if (!venue) return;

    currentBooking = { venue, venueId };
    bookingStep = 1;

    // Pre-fill from selected slot
    if (selectedSlotData && selectedSlotData.venueId === venueId) {
        currentBooking.slot     = selectedSlotData;
        currentBooking.sport    = selectedSlotData.sport;
        bookingStep = 4; // Skip to time slot step
    }

    openBookingModal();
}

function openBookingModal() {
    const overlay = document.getElementById('booking-modal-overlay');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderBookingStep();
}

function closeBookingModal() {
    document.getElementById('booking-modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
    bookingStep = 1;
    currentBooking = {};
    selectedSlotData = null;
    document.querySelectorAll('.slot-item.selected').forEach(s => s.classList.remove('selected'));
}

function renderBookingStep() {
    updateStepIndicators();

    const body = document.getElementById('booking-modal-body');
    const footer = document.getElementById('booking-modal-footer');

    if (!body || !footer) return;

    if (bookingStep === 1) {
        // Step 1: Select Sport
        const venue = currentBooking.venue;
        body.innerHTML = `
            <p style="color:var(--gray-light);font-size:13px;margin-bottom:16px;">Select the sport you want to play at <strong>${venue.name}</strong>.</p>
            <div style="display:flex;flex-direction:column;gap:10px;">
                ${venue.sports.map(s => {
                    const sport = KI.sports.find(sp => sp.name === s);
                    return `<button onclick="selectSport('${s}')" class="payment-option" style="justify-content:flex-start;gap:12px;">
                        <span style="font-size:24px;">${sport ? sport.emoji : '🏅'}</span>
                        <div>
                            <div class="pay-label">${s}</div>
                        </div>
                    </button>`;
                }).join('')}
            </div>
        `;
        footer.innerHTML = `<button class="btn-back" onclick="closeBookingModal()">Cancel</button>`;
    }

    else if (bookingStep === 2) {
        // Step 2: Select Date
        const today = new Date().toISOString().split('T')[0];
        body.innerHTML = `
            <p style="color:var(--gray-light);font-size:13px;margin-bottom:16px;">Choose a date for your <strong>${currentBooking.sport}</strong> session.</p>
            <div class="search-field" style="background:var(--dark-3);padding:16px;border-radius:12px;border:1px solid var(--border);">
                <label>SELECT DATE</label>
                <input type="date" id="booking-date-input" value="${today}" min="${today}"
                    style="width:100%;padding:8px 0;background:transparent;border:none;color:var(--white);font-size:16px;outline:none;">
            </div>
        `;
        footer.innerHTML = `
            <button class="btn-back" onclick="prevStep()">← Back</button>
            <button class="btn-next" onclick="selectDate()">Next →</button>
        `;
    }

    else if (bookingStep === 3) {
        // Step 3: Select Time Slot — fetch from real API
        const venue = currentBooking.venue;
        const sport = currentBooking.sport;
        const dateRaw = currentBooking.dateISO || new Date().toISOString().split('T')[0];

        body.innerHTML = `
            <p style="color:var(--gray-light);font-size:13px;margin-bottom:16px;">
                ${venue.name} · ${sport} · <strong>${currentBooking.date}</strong>
            </p>
            <div class="avail-legend" style="margin-bottom:16px;">
                <span class="legend-item"><span class="legend-dot ld-available"></span>Available</span>
                <span class="legend-item"><span class="legend-dot ld-partial"></span>Partial</span>
                <span class="legend-item"><span class="legend-dot ld-booked"></span>Booked</span>
            </div>
            <div id="slots-loading" style="text-align:center;padding:20px;color:var(--gray-light);">⏳ Loading available slots...</div>
            <div class="slots-grid" id="live-slots-grid" style="grid-template-columns:1fr;"></div>
        `;
        footer.innerHTML = `
            <button class="btn-back" onclick="prevStep()">← Back</button>
            <button class="btn-next" id="confirm-slot-btn" disabled onclick="confirmSlotSelection()">Confirm Slot →</button>
        `;

        // Find sport_id from KI.sports
        const sportObj = KI.sports.find(s => s.name === sport);
        const sportId  = sportObj ? sportObj.id : null;

        async function loadLiveSlots() {
            const grid    = document.getElementById('live-slots-grid');
            const loading = document.getElementById('slots-loading');
            if (!grid) return;

            try {
                let slots = [];
                if (sportId) {
                    const res  = await fetch(`/api/venues/${venue.id}/availability?sport_id=${sportId}&date=${dateRaw}`);
                    const data = await res.json();
                    if (data.success && data.data.length > 0) {
                        slots = data.data.map(s => ({
                            id:     s.slot_id,
                            time:   formatSlotTime(s.start_time) + ' – ' + formatSlotTime(s.end_time),
                            status: s.status.toLowerCase(),  // AVAILABLE→available, BOOKED→booked
                            apiSlot: s
                        }));
                    }
                }

                // Fallback to local KI data if no API slots
                if (slots.length === 0) {
                    slots = (venue.slots && venue.slots[sport]) ? venue.slots[sport] : [];
                }

                // Apply any locally booked slots
                const bookedSlots = JSON.parse(localStorage.getItem('ki_booked_slots') || '[]');
                slots = slots.map(s => {
                    const wasBooked = bookedSlots.some(b => b.venueId === venue.id && b.sport === sport && b.time === s.time);
                    return wasBooked ? {...s, status:'booked'} : s;
                });

                if (loading) loading.style.display = 'none';

                if (slots.length === 0) {
                    grid.innerHTML = '<p style="color:var(--gray-mid);text-align:center;padding:20px;">No slots available for this date.</p>';
                    return;
                }

                grid.innerHTML = slots.map(slot => `
                    <div class="slot-item ${slot.status}" onclick="selectBookingSlot(this, '${slot.status}', '${slot.time}', ${slot.id})">
                        <span class="slot-time">${slot.time}</span>
                        <span class="slot-badge">${slot.status === 'available' ? 'AVAILABLE' : slot.status === 'partial' ? 'PARTIAL' : 'BOOKED'}</span>
                    </div>
                `).join('');

            } catch(e) {
                // Fallback to local data on network error
                if (loading) loading.style.display = 'none';
                const local = (venue.slots && venue.slots[sport]) || [];
                if (local.length === 0) {
                    grid.innerHTML = '<p style="color:var(--gray-mid);text-align:center;padding:20px;">No slots found.</p>';
                } else {
                    grid.innerHTML = local.map(slot => `
                        <div class="slot-item ${slot.status}" onclick="selectBookingSlot(this, '${slot.status}', '${slot.time}', ${slot.id})">
                            <span class="slot-time">${slot.time}</span>
                            <span class="slot-badge">${slot.status.toUpperCase()}</span>
                        </div>
                    `).join('');
                }
            }
        }

        loadLiveSlots();
    }

    else if (bookingStep === 4) {
        // Step 4: Booking Summary
        const v = currentBooking.venue;
        const slot = currentBooking.slot || selectedSlotData;

        body.innerHTML = `
            <h3 style="margin-bottom:20px;font-size:16px;color:var(--gray-light);text-transform:uppercase;letter-spacing:1px;">Booking Summary</h3>
            <div class="summary-row"><span class="label">Venue</span><span class="value">${v.name}</span></div>
            <div class="summary-row"><span class="label">Sport</span><span class="value">${currentBooking.sport}</span></div>
            <div class="summary-row"><span class="label">Date</span><span class="value">${currentBooking.date || new Date().toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</span></div>
            <div class="summary-row"><span class="label">Time</span><span class="value">${slot ? slot.time : '-'}</span></div>
            <div class="summary-row"><span class="label">Duration</span><span class="value">1 Hour</span></div>
            <div class="summary-row total"><span class="label" style="font-weight:700;">Total Amount</span><span class="value">₹${v.price.toLocaleString('en-IN')}</span></div>
        `;
        footer.innerHTML = `
            <button class="btn-back" onclick="prevStep()">← Back</button>
            <button class="btn-next" onclick="nextStep()">Proceed to Pay →</button>
        `;
    }

    else if (bookingStep === 5) {
        // Step 5: Payment
        const v = currentBooking.venue;
        body.innerHTML = `
            <div class="summary-row" style="margin-bottom:8px;"><span class="label">Amount Due</span><span class="value" style="font-size:22px;color:var(--green);">₹${v.price.toLocaleString('en-IN')}</span></div>
            <p style="font-size:13px;color:var(--gray-light);margin-bottom:16px;">Select payment method:</p>
            <div class="payment-methods">
                <label class="payment-option" onclick="selectPayment(this,'UPI')">
                    <input type="radio" name="payment" value="UPI" checked>
                    <span class="pay-icon">📱</span>
                    <div><div class="pay-label">UPI</div><div class="pay-sub">GPay, PhonePe, Paytm</div></div>
                </label>
                <label class="payment-option" onclick="selectPayment(this,'CARD')">
                    <input type="radio" name="payment" value="CARD">
                    <span class="pay-icon">💳</span>
                    <div><div class="pay-label">Credit / Debit Card</div><div class="pay-sub">Visa, Mastercard, RuPay</div></div>
                </label>
                <label class="payment-option" onclick="selectPayment(this,'CASH')">
                    <input type="radio" name="payment" value="CASH">
                    <span class="pay-icon">💵</span>
                    <div><div class="pay-label">Cash at Venue</div><div class="pay-sub">Pay when you arrive</div></div>
                </label>
            </div>
        `;
        footer.innerHTML = `
            <button class="btn-back" onclick="prevStep()">← Back</button>
            <button class="btn-next" onclick="processPayment()">PAY ₹${v.price.toLocaleString('en-IN')} →</button>
        `;
    }
}

function selectPayment(el, method) {
    document.querySelectorAll('.payment-option').forEach(p => p.classList.remove('selected'));
    el.classList.add('selected');
    currentBooking.paymentMethod = method;
}

function selectSport(sport) {
    currentBooking.sport = sport;
    nextStep();
}

function selectDate() {
    const input = document.getElementById('booking-date-input');
    if (!input || !input.value) { showToast('Please select a date.', 'error'); return; }
    currentBooking.dateISO = input.value; // keep raw for API: '2026-09-30'
    currentBooking.date = new Date(input.value + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
    nextStep();
}

// Helper: '07:00:00' → '7:00 AM', '19:00:00' → '7:00 PM'
function formatSlotTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour   = h % 12 || 12;
    return `${hour}:${String(m).padStart(2,'0')} ${suffix}`;
}

function selectBookingSlot(el, status, time, slotId) {
    if (status === 'booked' || status === 'unavailable') {
        showToast('This slot is already booked.', 'error');
        return;
    }
    document.querySelectorAll('#booking-modal-body .slot-item.selected').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
    currentBooking.slot = { time, id: slotId };

    const btn = document.getElementById('confirm-slot-btn');
    if (btn) btn.disabled = false;
}

function confirmSlotSelection() {
    if (!currentBooking.slot) { showToast('Please select a time slot.', 'error'); return; }
    nextStep();
}

function nextStep() {
    bookingStep++;
    renderBookingStep();
}

function prevStep() {
    if (bookingStep <= 1) { closeBookingModal(); return; }
    bookingStep--;
    renderBookingStep();
}

function updateStepIndicators() {
    const steps = document.querySelectorAll('.step');
    const connectors = document.querySelectorAll('.step-connector');

    steps.forEach((step, i) => {
        const num = i + 1;
        step.classList.remove('active','done');
        if (num < bookingStep) step.classList.add('done');
        if (num === bookingStep) step.classList.add('active');
    });

    connectors.forEach((conn, i) => {
        conn.classList.toggle('done', i + 1 < bookingStep);
    });
}

function processPayment() {
    const processing = document.getElementById('processing-overlay');
    if (processing) processing.classList.add('show');

    // Simulate 2-second payment processing (demo only, no real money)
    setTimeout(async () => {
        if (processing) processing.classList.remove('show');
        await submitBookingToBackend();
    }, 2000);
}

async function submitBookingToBackend() {
    const v    = currentBooking.venue;
    const slot = currentBooking.slot;
    const sport = currentBooking.sport;
    const sportObj = KI.sports.find(s => s.name === sport);
    const sportId  = sportObj ? sportObj.id : null;
    const slotId   = slot ? slot.id : null;
    const payMethod = currentBooking.paymentMethod || 'UPI';
    const token = localStorage.getItem('ki_token');

    let bookingId, txnId;

    // Try real backend if logged in
    if (token && !token.startsWith('demo-') && sportId && slotId && v.id) {
        try {
            const res  = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    venue_id:       v.id,
                    sport_id:       sportId,
                    slot_id:        slotId,
                    payment_method: payMethod
                })
            });
            const data = await res.json();
            if (data.success) {
                bookingId = data.data.booking_id;
                txnId     = data.data.transaction_id;
            }
        } catch(e) { /* fall through to local */ }
    }

    // Fallback: generate local IDs
    if (!bookingId) {
        bookingId = 'KI-2026-' + Math.floor(Math.random() * 9000 + 1000);
        txnId     = 'KI-TXN-' + Date.now();
    }

    showBookingConfirmation(bookingId, txnId);
}

function showBookingConfirmation(bookingId, txnId) {
    const v    = currentBooking.venue;
    const slot = currentBooking.slot;

    const body   = document.getElementById('booking-modal-body');
    const footer = document.getElementById('booking-modal-footer');

    bookingStep = 6;
    updateStepIndicators();

    body.innerHTML = `
        <div class="booking-confirmed">
            <div class="confirm-icon">✅</div>
            <h2>Booking Confirmed!</h2>
            <p>Your slot has been successfully booked.<br>Show this ID at the venue.</p>
            <div class="booking-id-box">
                <div class="bid-label">Booking ID</div>
                <div class="bid-value">${bookingId}</div>
            </div>
            <div style="background:var(--dark-3);border-radius:var(--radius);padding:20px;text-align:left;margin-bottom:20px;">
                <div class="summary-row"><span class="label">Venue</span><span class="value">${v.name}</span></div>
                <div class="summary-row"><span class="label">Sport</span><span class="value">${currentBooking.sport}</span></div>
                <div class="summary-row"><span class="label">Date</span><span class="value">${currentBooking.date || 'Today'}</span></div>
                <div class="summary-row"><span class="label">Time</span><span class="value">${slot ? slot.time : '-'}</span></div>
                <div class="summary-row"><span class="label">Amount Paid</span><span class="value" style="color:var(--green);">₹${v.price.toLocaleString('en-IN')}</span></div>
                <div class="summary-row"><span class="label">Transaction ID</span><span class="value" style="font-size:11px;color:var(--gray-mid);">${txnId}</span></div>
            </div>
        </div>
    `;

    footer.innerHTML = `
        <button class="btn-back" onclick="closeBookingModal()" style="flex:1;">Close</button>
        <button class="btn-next" onclick="closeBookingModal(); window.location.href='my-bookings.html'" style="flex:2;">View My Bookings</button>
    `;

    // Save to localStorage for My Bookings fallback
    const bookings = JSON.parse(localStorage.getItem('ki_bookings') || '[]');
    bookings.unshift({
        id:     bookingId,
        venue:  v.name,
        area:   v.area,
        sport:  currentBooking.sport,
        date:   currentBooking.date || 'Today',
        time:   slot ? slot.time : '-',
        amount: v.price,
        status: 'CONFIRMED',
        txn:    txnId
    });
    localStorage.setItem('ki_bookings', JSON.stringify(bookings));

    // Mark slot as booked in live KI.venues data
    if (currentBooking.sport && slot) {
        const venueData = KI.venues.find(x => x.id === v.id);
        if (venueData && venueData.slots && venueData.slots[currentBooking.sport]) {
            const slotEntry = venueData.slots[currentBooking.sport].find(s => s.time === slot.time);
            if (slotEntry) slotEntry.status = 'booked';
        }
        const bookedSlots = JSON.parse(localStorage.getItem('ki_booked_slots') || '[]');
        bookedSlots.push({ venueId: v.id, sport: currentBooking.sport, time: slot.time });
        localStorage.setItem('ki_booked_slots', JSON.stringify(bookedSlots));
    }

    if (typeof renderSlots === 'function') {
        try { renderSlots(currentBooking.sport || 'Cricket'); } catch(e) {}
    }

    showToast('Booking confirmed! 🎉', 'success');
}


/* ── Sport Filter Buttons ────────────────────────────────────── */
function initVenueFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn[data-sport]');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const sport = btn.dataset.sport;
            if (sport === 'All') {
                renderHomeVenues();
            } else {
                const filtered = KI.venues.filter(v => v.sports.includes(sport));
                renderHomeVenues(filtered.slice(0, 6));
            }
        });
    });
}

/* ── Initialize on DOM Ready ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    if (window.KI) {
        // ── Restore booked slots from localStorage (persist across refresh) ──
        const bookedSlots = JSON.parse(localStorage.getItem('ki_booked_slots') || '[]');
        bookedSlots.forEach(({ venueId, sport, time }) => {
            const venueData = KI.venues.find(v => v.id === venueId);
            if (venueData && venueData.slots && venueData.slots[sport]) {
                const slotEntry = venueData.slots[sport].find(s => s.time === time);
                if (slotEntry) slotEntry.status = 'booked';
            }
        });

        renderSportCards();
        renderHomeVenues();
        renderSlots('Cricket');
        initVenueFilters();
    }

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay, .booking-modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.open, .booking-modal-overlay.open').forEach(o => {
                o.classList.remove('open');
                document.body.style.overflow = '';
            });
        }
    });
});
