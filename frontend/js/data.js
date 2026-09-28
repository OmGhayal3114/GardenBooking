// ============================================================
//  KHELOINDIA — Frontend Demo Data
//  All venue/slot data below is fictional for academic demo.
//  Replace with API calls when backend is connected.
// ============================================================

const KI = window.KI || {};

// ── Sports ──────────────────────────────────────────────────
KI.sports = [
    { id: 1, name: 'Cricket',   emoji: '🏏', image: 'images/cricket.jpg',   venues: 9,  color: '#16A34A' },
    { id: 2, name: 'Football',  emoji: '⚽', image: 'images/football.avif', venues: 8,  color: '#2563EB' },
    { id: 3, name: 'Badminton', emoji: '🏸', image: 'images/badminton.jpg', venues: 10, color: '#9333EA' },
    { id: 4, name: 'Kabaddi',   emoji: '🤼', image: 'images/kabbadi.jpg',   venues: 6,  color: '#EA580C' },
    { id: 5, name: 'Chess',     emoji: '♟️', image: 'images/chess.avif',    venues: 5,  color: '#0891B2' },
];

// ── 15 Demo Venues ──────────────────────────────────────────
KI.venues = [
    {
        id: 1, name: 'Dadar Multi-Sports Arena', area: 'Dadar', city: 'Mumbai',
        address: 'Near Dadar Station, Dadar West, Mumbai',
        image: 'images/cricket.jpg',
        sports: ['Cricket','Football','Badminton'],
        rating: 4.8, price: 800, distance: '1.2 km',
        availability: 'available',
        opening: '6:00 AM', closing: '10:00 PM',
        facilities: ['Parking','Changing Room','Drinking Water','Washroom','Flood Lights','Equipment Rental','First Aid','Canteen'],
        description: 'A large multi-sport complex near Dadar station offering cricket, football and badminton simultaneously. One of the most popular grounds in central Mumbai.',
        slots: {
            Cricket: [
                { id:1,  time:'6:00 AM – 7:00 AM',   status:'available' },
                { id:2,  time:'7:00 AM – 8:00 AM',   status:'booked'    },
                { id:3,  time:'8:00 AM – 9:00 AM',   status:'available' },
                { id:4,  time:'9:00 AM – 10:00 AM',  status:'available' },
                { id:5,  time:'10:00 AM – 11:00 AM', status:'booked'    },
                { id:6,  time:'5:00 PM – 6:00 PM',   status:'available' },
                { id:7,  time:'6:00 PM – 7:00 PM',   status:'available' },
                { id:8,  time:'7:00 PM – 8:00 PM',   status:'booked'    },
                { id:9,  time:'8:00 PM – 9:00 PM',   status:'available' },
            ],
            Football: [
                { id:10, time:'6:00 AM – 7:00 AM',   status:'available' },
                { id:11, time:'7:00 AM – 8:00 AM',   status:'available' },
                { id:12, time:'8:00 AM – 9:00 AM',   status:'booked'    },
                { id:13, time:'6:00 PM – 7:00 PM',   status:'booked'    },
                { id:14, time:'7:00 PM – 8:00 PM',   status:'available' },
            ],
            Badminton: [
                { id:15, time:'6:00 AM – 7:00 AM',   status:'available' },
                { id:16, time:'7:00 AM – 8:00 AM',   status:'partial'   },
                { id:17, time:'8:00 AM – 9:00 AM',   status:'booked'    },
                { id:18, time:'6:00 PM – 7:00 PM',   status:'partial'   },
                { id:19, time:'7:00 PM – 8:00 PM',   status:'available' },
            ],
        },
        multiSport: [
            { area:'Football Field A',  sport:'Football',  time:'6:00 PM – 7:00 PM', status:'available' },
            { area:'Cricket Pitch',     sport:'Cricket',   time:'6:00 PM – 8:00 PM', status:'booked'    },
            { area:'Badminton Court 1', sport:'Badminton', time:'6:00 PM – 7:00 PM', status:'available' },
            { area:'Badminton Court 2', sport:'Badminton', time:'6:00 PM – 7:00 PM', status:'partial'   },
        ],
        reviews: [
            { name:'Arjun Sharma',  rating:5, text:'Amazing facility! Cricket pitch is well-maintained.', date:'25 Sep 2026' },
            { name:'Priya Mehta',   rating:4, text:'Great for evening sessions. Floodlights work perfectly.', date:'22 Sep 2026' },
        ]
    },
    {
        id: 2, name: 'Andheri Sports Hub', area: 'Andheri', city: 'Mumbai',
        address: 'Marol Industrial Area, Andheri East, Mumbai',
        image: 'images/football.avif',
        sports: ['Football','Badminton','Cricket'],
        rating: 4.6, price: 900, distance: '3.5 km',
        availability: 'available',
        opening: '5:30 AM', closing: '11:00 PM',
        facilities: ['Parking','Changing Room','Drinking Water','Washroom','Flood Lights','Equipment Rental','Canteen'],
        description: 'Modern indoor and outdoor sports facility in the heart of Andheri with 3 badminton courts.',
        slots: {
            Football: [
                { id:20, time:'6:00 AM – 7:00 AM',   status:'available' },
                { id:21, time:'7:00 AM – 8:00 AM',   status:'booked'    },
                { id:22, time:'5:00 PM – 6:00 PM',   status:'available' },
                { id:23, time:'6:00 PM – 7:00 PM',   status:'available' },
                { id:24, time:'7:00 PM – 8:00 PM',   status:'booked'    },
            ],
            Badminton: [
                { id:25, time:'6:00 AM – 7:00 AM',   status:'available' },
                { id:26, time:'7:00 AM – 8:00 AM',   status:'partial'   },
                { id:27, time:'5:00 PM – 6:00 PM',   status:'booked'    },
                { id:28, time:'6:00 PM – 7:00 PM',   status:'available' },
            ],
        },
        reviews: [{ name:'Vikram Desai', rating:4, text:'Good badminton courts. Worth the price.', date:'20 Sep 2026' }]
    },
    {
        id: 3, name: 'Borivali PlayZone', area: 'Borivali', city: 'Mumbai',
        address: 'Near Borivali National Park Gate, Mumbai',
        image: 'images/badminton.jpg',
        sports: ['Cricket','Football','Kabaddi'],
        rating: 4.5, price: 700, distance: '5.1 km',
        availability: 'partial',
        opening: '6:00 AM', closing: '9:00 PM',
        facilities: ['Parking','Drinking Water','Washroom','Flood Lights'],
        description: 'Spacious grounds adjacent to the national park. Perfect for weekend sports with natural surroundings.',
        slots: {
            Cricket: [
                { id:30, time:'6:00 AM – 7:00 AM',  status:'available' },
                { id:31, time:'7:00 AM – 8:00 AM',  status:'booked'    },
                { id:32, time:'5:00 PM – 6:00 PM',  status:'available' },
                { id:33, time:'6:00 PM – 7:00 PM',  status:'booked'    },
            ],
        },
        reviews: []
    },
    {
        id: 4, name: 'Bandra Grounds Complex', area: 'Bandra', city: 'Mumbai',
        address: 'Carter Road, Bandra West, Mumbai',
        image: 'images/cricket.jpg',
        sports: ['Cricket','Badminton','Chess'],
        rating: 4.9, price: 1200, distance: '4.8 km',
        availability: 'available',
        opening: '6:00 AM', closing: '10:00 PM',
        facilities: ['Parking','Changing Room','Drinking Water','Washroom','Flood Lights','Equipment Rental','First Aid','Canteen'],
        description: 'Sea-view sports complex with premium artificial turf and floodlit badminton courts. Best venue in western Mumbai.',
        slots: {
            Cricket: [
                { id:40, time:'6:00 AM – 7:00 AM',   status:'available' },
                { id:41, time:'7:00 AM – 8:00 AM',   status:'partial'   },
                { id:42, time:'6:00 PM – 7:00 PM',   status:'booked'    },
                { id:43, time:'7:00 PM – 8:00 PM',   status:'available' },
            ],
            Badminton: [
                { id:44, time:'6:00 AM – 7:00 AM',  status:'available' },
                { id:45, time:'7:00 AM – 8:00 AM',  status:'available' },
                { id:46, time:'6:00 PM – 7:00 PM',  status:'partial'   },
                { id:47, time:'7:00 PM – 8:00 PM',  status:'booked'    },
            ],
        },
        reviews: [{ name:'Sneha Joshi', rating:5, text:'Bandra Grounds is easily the best in Mumbai!', date:'23 Sep 2026' }]
    },
    {
        id: 5, name: 'Kurla Sports Centre', area: 'Kurla', city: 'Mumbai',
        address: 'LBS Marg, Kurla West, Mumbai',
        image: 'images/football.avif',
        sports: ['Football','Kabaddi'],
        rating: 4.3, price: 600, distance: '2.2 km',
        availability: 'available',
        opening: '5:00 AM', closing: '10:00 PM',
        facilities: ['Drinking Water','Washroom','Flood Lights'],
        description: 'Affordable multi-sport centre serving the central Mumbai community with quality grounds.',
        slots: {
            Football: [
                { id:50, time:'6:00 AM – 7:00 AM',  status:'available' },
                { id:51, time:'7:00 AM – 8:00 AM',  status:'available' },
                { id:52, time:'5:00 PM – 6:00 PM',  status:'booked'    },
                { id:53, time:'6:00 PM – 7:00 PM',  status:'available' },
            ],
        },
        reviews: []
    },
    {
        id: 6, name: 'Powai Sports Galaxy', area: 'Powai', city: 'Mumbai',
        address: 'Near Hiranandani Gardens, Powai, Mumbai',
        image: 'images/badminton.jpg',
        sports: ['Cricket','Football','Badminton','Chess'],
        rating: 4.7, price: 1100, distance: '6.3 km',
        availability: 'available',
        opening: '6:00 AM', closing: '11:00 PM',
        facilities: ['Parking','Changing Room','Drinking Water','Washroom','Flood Lights','Equipment Rental','Canteen'],
        description: 'Premium lakeside sports complex near Hiranandani. State-of-the-art turf and covered courts.',
        slots: {
            Cricket: [
                { id:60, time:'6:00 AM – 7:00 AM',  status:'available' },
                { id:61, time:'5:00 PM – 6:00 PM',  status:'available' },
                { id:62, time:'6:00 PM – 7:00 PM',  status:'booked'    },
            ],
            Football: [
                { id:63, time:'6:00 AM – 7:00 AM',  status:'available' },
                { id:64, time:'6:00 PM – 7:00 PM',  status:'available' },
            ],
        },
        reviews: [{ name:'Rohan Patil', rating:5, text:'Stunning lakeside views while playing cricket!', date:'18 Sep 2026' }]
    },
    {
        id: 7, name: 'Ghatkopar Sports Ground', area: 'Ghatkopar', city: 'Mumbai',
        address: 'Pantnagar, Ghatkopar East, Mumbai',
        image: 'images/kabbadi.jpg',
        sports: ['Football','Kabaddi','Badminton'],
        rating: 4.2, price: 650, distance: '3.8 km',
        availability: 'booked',
        opening: '6:00 AM', closing: '9:30 PM',
        facilities: ['Parking','Drinking Water','Washroom','Flood Lights'],
        description: 'Community sports ground with multiple pitches and covered badminton courts at affordable prices.',
        slots: {
            Football: [
                { id:70, time:'6:00 AM – 7:00 AM',  status:'booked'    },
                { id:71, time:'7:00 AM – 8:00 AM',  status:'booked'    },
                { id:72, time:'5:00 PM – 6:00 PM',  status:'available' },
            ],
        },
        reviews: []
    },
    {
        id: 8, name: 'Mulund Recreation Centre', area: 'Mulund', city: 'Mumbai',
        address: 'Near Mulund Check Naka, Mulund West, Mumbai',
        image: 'images/chess.avif',
        sports: ['Cricket','Football'],
        rating: 4.4, price: 750, distance: '7.1 km',
        availability: 'available',
        opening: '6:00 AM', closing: '9:00 PM',
        facilities: ['Parking','Drinking Water','Washroom','Flood Lights'],
        description: 'Well-maintained recreation centre with cricket nets and a full-size football ground.',
        slots: {
            Cricket: [
                { id:80, time:'6:00 AM – 7:00 AM',  status:'available' },
                { id:81, time:'7:00 AM – 8:00 AM',  status:'available' },
                { id:82, time:'6:00 PM – 7:00 PM',  status:'booked'    },
            ],
        },
        reviews: []
    },
    {
        id: 9, name: 'Vile Parle Sports Academy', area: 'Vile Parle', city: 'Mumbai',
        address: 'Irla, Vile Parle West, Mumbai',
        image: 'images/cricket.jpg',
        sports: ['Cricket','Badminton'],
        rating: 4.6, price: 950, distance: '2.9 km',
        availability: 'available',
        opening: '5:30 AM', closing: '10:00 PM',
        facilities: ['Parking','Changing Room','Drinking Water','Washroom','Flood Lights','Equipment Rental'],
        description: 'Academy-grade facility with professional coaching available alongside regular bookable slots.',
        slots: {
            Cricket: [
                { id:90, time:'6:00 AM – 7:00 AM',  status:'available' },
                { id:91, time:'7:00 AM – 8:00 AM',  status:'booked'    },
                { id:92, time:'6:00 PM – 7:00 PM',  status:'available' },
            ],
            Badminton: [
                { id:93, time:'6:00 AM – 7:00 AM',  status:'available' },
                { id:94, time:'6:00 PM – 7:00 PM',  status:'partial'   },
            ],
        },
        reviews: []
    },
    {
        id: 10, name: 'Chembur Open Grounds', area: 'Chembur', city: 'Mumbai',
        address: 'Govandi Road, Chembur, Mumbai',
        image: 'images/kabbadi.jpg',
        sports: ['Cricket','Kabaddi'],
        rating: 4.1, price: 500, distance: '4.4 km',
        availability: 'partial',
        opening: '6:00 AM', closing: '8:00 PM',
        facilities: ['Drinking Water','Washroom'],
        description: 'Open natural turf grounds — ideal for cricket and kabaddi. Budget-friendly option.',
        slots: {
            Cricket: [
                { id:100, time:'6:00 AM – 7:00 AM',  status:'available' },
                { id:101, time:'7:00 AM – 8:00 AM',  status:'partial'   },
                { id:102, time:'5:00 PM – 6:00 PM',  status:'available' },
            ],
        },
        reviews: []
    },
    {
        id: 11, name: 'Kandivali Sports Village', area: 'Kandivali', city: 'Mumbai',
        address: 'Thakur Village, Kandivali East, Mumbai',
        image: 'images/football.avif',
        sports: ['Cricket','Football','Badminton','Kabaddi','Chess'],
        rating: 4.5, price: 800, distance: '6.8 km',
        availability: 'available',
        opening: '6:00 AM', closing: '10:00 PM',
        facilities: ['Parking','Changing Room','Drinking Water','Washroom','Flood Lights','Equipment Rental','First Aid'],
        description: 'Large sports village with five separate play areas for all five major sports. Great for groups.',
        slots: {
            Cricket:  [{ id:110, time:'6:00 AM – 7:00 AM',  status:'available' }, { id:111, time:'7:00 PM – 8:00 PM',  status:'booked'    }],
            Football: [{ id:112, time:'6:00 AM – 7:00 AM',  status:'available' }, { id:113, time:'6:00 PM – 7:00 PM',  status:'available' }],
        },
        reviews: []
    },
    {
        id: 12, name: 'Goregaon Sports Club', area: 'Goregaon', city: 'Mumbai',
        address: 'Film City Road, Goregaon East, Mumbai',
        image: 'images/badminton.jpg',
        sports: ['Cricket','Football','Badminton'],
        rating: 4.7, price: 1000, distance: '5.5 km',
        availability: 'available',
        opening: '6:00 AM', closing: '10:30 PM',
        facilities: ['Parking','Changing Room','Drinking Water','Washroom','Flood Lights','Canteen'],
        description: 'Club-style facilities near Film City with pay-per-slot booking options. Well-lit for evening games.',
        slots: {
            Cricket:  [{ id:120, time:'6:00 AM – 7:00 AM', status:'available'}, { id:121, time:'7:00 PM – 8:00 PM', status:'available'}],
            Badminton:[{ id:122, time:'6:00 PM – 7:00 PM', status:'partial'},   { id:123, time:'7:00 PM – 8:00 PM', status:'available'}],
        },
        reviews: []
    },
    {
        id: 13, name: 'Lower Parel Arena', area: 'Lower Parel', city: 'Mumbai',
        address: 'Senapati Bapat Marg, Lower Parel, Mumbai',
        image: 'images/cricket.jpg',
        sports: ['Cricket','Badminton','Chess'],
        rating: 4.8, price: 1300, distance: '3.1 km',
        availability: 'partial',
        opening: '7:00 AM', closing: '11:00 PM',
        facilities: ['Parking','Changing Room','Drinking Water','Washroom','Flood Lights','Equipment Rental','First Aid','Canteen'],
        description: 'Urban sports arena in the heart of Mumbai\'s commercial district. Premium artificial turf and indoor courts.',
        slots: {
            Cricket:  [{ id:130, time:'7:00 AM – 8:00 AM', status:'available'}, { id:131, time:'8:00 PM – 9:00 PM', status:'partial'}],
            Badminton:[{ id:132, time:'7:00 AM – 8:00 AM', status:'available'}, { id:133, time:'7:00 PM – 8:00 PM', status:'booked'}],
        },
        reviews: []
    },
    {
        id: 14, name: 'Thane Sports Complex', area: 'Thane', city: 'Mumbai',
        address: 'Ghantali Road, Thane West, Maharashtra',
        image: 'images/football.avif',
        sports: ['Football','Cricket','Kabaddi'],
        rating: 4.3, price: 650, distance: '9.2 km',
        availability: 'available',
        opening: '6:00 AM', closing: '9:00 PM',
        facilities: ['Parking','Drinking Water','Washroom','Flood Lights'],
        description: 'Suburban sports complex with ample parking and well-maintained multi-sport facilities.',
        slots: {
            Football: [{ id:140, time:'6:00 AM – 7:00 AM', status:'available'}, { id:141, time:'6:00 PM – 7:00 PM', status:'available'}],
        },
        reviews: []
    },
    {
        id: 15, name: 'Navi Mumbai Sports Township', area: 'Navi Mumbai', city: 'Navi Mumbai',
        address: 'Sector 9, Vashi, Navi Mumbai',
        image: 'images/chess.avif',
        sports: ['Cricket','Football','Badminton','Kabaddi','Chess'],
        rating: 4.6, price: 850, distance: '12.5 km',
        availability: 'available',
        opening: '5:00 AM', closing: '11:00 PM',
        facilities: ['Parking','Changing Room','Drinking Water','Washroom','Flood Lights','Equipment Rental','First Aid','Canteen'],
        description: 'Planned sports township with the largest ground capacity in the MMR. 5 sports, 2 courts each.',
        slots: {
            Cricket:  [{ id:150, time:'6:00 AM – 7:00 AM', status:'available'}, { id:151, time:'7:00 PM – 8:00 PM', status:'partial'}],
            Football: [{ id:152, time:'6:00 AM – 7:00 AM', status:'available'}, { id:153, time:'8:00 PM – 9:00 PM', status:'available'}],
            Badminton:[{ id:154, time:'6:00 AM – 7:00 AM', status:'available'}, { id:155, time:'6:00 PM – 7:00 PM', status:'booked'}],
        },
        reviews: []
    },
];

// ── Mumbai areas for dropdown ────────────────────────────────
KI.areas = ['All Areas','Dadar','Andheri','Borivali','Bandra','Kurla','Powai',
             'Ghatkopar','Mulund','Vile Parle','Chembur','Kandivali',
             'Goregaon','Lower Parel','Thane','Navi Mumbai'];

// ── Facilities icon map ──────────────────────────────────────
KI.facilityIcons = {
    'Parking':        '🚗',
    'Changing Room':  '🚿',
    'Drinking Water': '💧',
    'Washroom':       '🚻',
    'Flood Lights':   '💡',
    'Equipment Rental':'🏏',
    'First Aid':      '🩺',
    'Canteen':        '🍽️',
};

window.KI = KI;
