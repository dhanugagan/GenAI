/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventPlan } from '../types';

export const SAMPLE_WEDDING: EventPlan = {
  id: 'sample-wedding-1',
  title: 'Elena & Julian: Botanical Glasshouse Wedding',
  eventType: 'wedding',
  date: '2027-06-19',
  location: 'The Conservatory Gardens, Portland, OR',
  guestCount: 110,
  totalBudget: 34000,
  currency: 'USD',
  vibe: 'Modern romantic botanical, ambient candlelight, organic greenery, live jazz strings, seasonal farm-to-table dining',
  notes: 'Priority on acoustic intimacy, eco-conscious florals, and an unforgettable culinary cocktail hour.',
  createdAt: '2026-10-15T10:00:00Z',
  updatedAt: '2026-11-01T09:00:00Z',
  budgetItems: [
    {
      id: 'b-1',
      category: 'venue',
      name: 'Glasshouse Pavilion & Garden Grounds Rental (10 hrs)',
      estimatedCost: 7500,
      actualCost: 7500,
      paidAmount: 3750,
      dueDate: '2027-05-01',
      notes: 'Includes tables, bistro lighting, and bridal suite',
      status: 'deposit_paid'
    },
    {
      id: 'b-2',
      category: 'catering',
      name: 'Plated 3-Course Organic Dinner & Passed Hors d’oeuvres',
      estimatedCost: 9500,
      actualCost: 9900,
      paidAmount: 2500,
      dueDate: '2027-05-15',
      notes: '$90/head estimate, 2 signature drinks included',
      status: 'deposit_paid'
    },
    {
      id: 'b-3',
      category: 'decor_rentals',
      name: 'Hanging Foliage Installations & Botanical Centerpieces',
      estimatedCost: 3800,
      actualCost: 3600,
      paidAmount: 1800,
      dueDate: '2027-05-20',
      notes: 'Locally grown ferns, white garden roses, eucalyptus',
      status: 'deposit_paid'
    },
    {
      id: 'b-4',
      category: 'photo_video',
      name: 'Full Day Photography + Drone & Highlight Reel',
      estimatedCost: 4200,
      actualCost: 4200,
      paidAmount: 2100,
      dueDate: '2027-04-10',
      notes: '8 hours of coverage, 2 shooters, sneak peek in 48h',
      status: 'deposit_paid'
    },
    {
      id: 'b-5',
      category: 'entertainment',
      name: 'Acoustic String Trio (Ceremony) + 5-Piece Jazz Soul Band',
      estimatedCost: 3200,
      actualCost: 3100,
      paidAmount: 1000,
      dueDate: '2027-05-10',
      notes: 'Live first dance performance arranged',
      status: 'deposit_paid'
    },
    {
      id: 'b-6',
      category: 'attire_beauty',
      name: 'Custom Tailored Linen Suit, Dress & Hair/Makeup',
      estimatedCost: 2800,
      actualCost: 2650,
      paidAmount: 2650,
      dueDate: '2027-04-01',
      notes: 'Fittings scheduled for March',
      status: 'paid_in_full'
    },
    {
      id: 'b-7',
      category: 'invitations_gifts',
      name: 'Letterpress Seed-Paper Stationery & Olive Oil Favors',
      estimatedCost: 1000,
      actualCost: 950,
      paidAmount: 950,
      dueDate: '2027-02-15',
      notes: 'Plantable seed paper with wildflower seeds',
      status: 'paid_in_full'
    },
    {
      id: 'b-8',
      category: 'contingency',
      name: 'Emergency Fund & Weather Contingency Buffer',
      estimatedCost: 2000,
      actualCost: 0,
      paidAmount: 0,
      dueDate: '2027-06-10',
      notes: 'Reserved for unexpected heat/rain rentals or extra overtime',
      status: 'planned'
    }
  ],
  milestones: [
    {
      id: 'm-1',
      title: 'Secure Glasshouse Venue & confirm date permit',
      phase: '9-12 Months Before',
      dueDate: '2026-08-01',
      isCompleted: true,
      priority: 'high',
      category: 'Venue',
      notes: 'Contract executed with City Parks Conservatory'
    },
    {
      id: 'm-2',
      title: 'Book Lead Photographer and schedule engagement mini-shoot',
      phase: '9-12 Months Before',
      dueDate: '2026-09-15',
      isCompleted: true,
      priority: 'high',
      category: 'Photo/Video',
      notes: 'Signed with Wildflower Stories LLC'
    },
    {
      id: 'm-3',
      title: 'Catering menu tasting & wine pairing finalization',
      phase: '4-6 Months Before',
      dueDate: '2027-01-20',
      isCompleted: false,
      priority: 'medium',
      category: 'Catering',
      notes: 'Test dairy-free and gluten-free dietary options'
    },
    {
      id: 'm-4',
      title: 'Send out letterpress invitations & launch RSVP site',
      phase: '3-4 Months Before',
      dueDate: '2027-02-28',
      isCompleted: false,
      priority: 'high',
      category: 'Invitations',
      notes: 'Set RSVP deadline for May 1st'
    },
    {
      id: 'm-5',
      title: 'Finalize Day-Of Run-of-Show with Band & Coordinator',
      phase: '1 Month Before',
      dueDate: '2027-05-19',
      isCompleted: false,
      priority: 'high',
      category: 'Logistics',
      notes: 'Confirm vendor arrival timeline and load-in bay'
    },
    {
      id: 'm-6',
      title: 'Rehearsal walk-through & welcome sunset drinks',
      phase: 'Day Before',
      dueDate: '2027-06-18',
      isCompleted: false,
      priority: 'medium',
      category: 'Ceremony',
      notes: 'Distribute tip envelopes and vendor contact sheet'
    }
  ],
  dayOfSchedule: [
    {
      id: 's-1',
      time: '11:00 AM',
      endTime: '01:30 PM',
      title: 'Hair & Makeup & Bridal Suite Arrival',
      description: 'Mimosa toast, relaxed prep, steam dresses and press suits.',
      location: 'Bridal Suite West Wing',
      leadPerson: 'Elena & Maid of Honor',
      isCompleted: false
    },
    {
      id: 's-2',
      time: '01:30 PM',
      endTime: '02:30 PM',
      title: 'First Look & Couple Portraits in Greenhouse',
      description: 'Private moments captured by photographer with natural diffused sunlight.',
      location: 'Orchid Corridor',
      leadPerson: 'Photographer Sarah',
      isCompleted: false
    },
    {
      id: 's-3',
      time: '03:00 PM',
      endTime: '04:00 PM',
      title: 'Bridal Party & Immediate Family Group Photos',
      description: 'Keep hydration and water carafes ready. Pre-ceremony relaxation.',
      location: 'North Lawn & Arches',
      leadPerson: 'Best Man Marcus',
      isCompleted: false
    },
    {
      id: 's-4',
      time: '04:30 PM',
      endTime: '05:00 PM',
      title: 'Guest Arrival & String Trio Acoustic Prelude',
      description: 'Welcome sparkling elderflower water served at entry.',
      location: 'Garden Foyer',
      leadPerson: 'Day-of Coordinator Clara',
      isCompleted: false
    },
    {
      id: 's-5',
      time: '05:00 PM',
      endTime: '05:35 PM',
      title: 'Wedding Ceremony & Exchange of Vows',
      description: 'Processional with acoustic strings. Ring exchange and celebratory kiss!',
      location: 'Grand Atrium',
      leadPerson: 'Officiant David',
      isCompleted: false
    },
    {
      id: 's-6',
      time: '05:35 PM',
      endTime: '07:00 PM',
      title: 'Golden Hour Cocktail Reception & Passed Bites',
      description: 'Smoked salmon crisps, wild mushroom croquettes, signature botanical spritz.',
      location: 'Terrace & Fountain Pergola',
      leadPerson: 'Catering Lead Chef Martin',
      isCompleted: false
    },
    {
      id: 's-7',
      time: '07:00 PM',
      endTime: '08:30 PM',
      title: 'Grand Entrance, Plated Dinner & Toasts',
      description: 'Welcome welcome speech, Maid of Honor and Best Man toasts (4 min each).',
      location: 'Glass Pavilion Main Dining',
      leadPerson: 'Band Emcee & Julian',
      isCompleted: false
    },
    {
      id: 's-8',
      time: '08:30 PM',
      endTime: '11:00 PM',
      title: 'First Dance, Live Band Party & Late Night Treats',
      description: 'Espresso bar and warm mini apple galettes served at 10 PM. Sparkler send-off!',
      location: 'Glass Pavilion Dancefloor',
      leadPerson: 'Jazz Soul Band',
      isCompleted: false
    }
  ],
  vendors: [
    {
      id: 'v-1',
      category: 'Venue',
      businessName: 'The Portland Glasshouse Conservatory',
      contactPerson: 'Genevieve Ross',
      email: 'events@glasshouseconservatory.org',
      phone: '(503) 555-0192',
      website: 'glasshouseconservatory.org',
      status: 'booked',
      quotedPrice: 7500,
      finalPrice: 7500,
      rating: 5,
      contractSigned: true,
      notes: 'Load-in permitted starting 9:00 AM on Saturday. Sound limit 85dB after 10 PM.',
      checklist: [
        { id: 'vc-1', text: 'Sign liability waiver and security deposit', done: true },
        { id: 'vc-2', text: 'Provide certificates of insurance for catering & band', done: true },
        { id: 'vc-3', text: 'Submit final floorplan and table diagram', done: false }
      ]
    },
    {
      id: 'v-2',
      category: 'Catering',
      businessName: 'Heirloom Table Catering & Spirits',
      contactPerson: 'Chef Martin Zhao',
      email: 'hello@heirloomtablepdx.com',
      phone: '(503) 555-8321',
      status: 'booked',
      quotedPrice: 9500,
      finalPrice: 9900,
      rating: 5,
      contractSigned: true,
      notes: 'Providing 5 bartenders, service crew, dishware, and compostable barware.',
      checklist: [
        { id: 'vc-4', text: 'Confirm final headcount 14 days prior', done: false },
        { id: 'vc-5', text: 'Approve signature cocktail garnishes and bitters', done: true },
        { id: 'vc-6', text: 'Confirm vendor meals for band & photography team', done: true }
      ]
    },
    {
      id: 'v-3',
      category: 'Florals & Decor',
      businessName: 'Bloom & Twig Botanical Studio',
      contactPerson: 'Chloe Vance',
      email: 'chloe@bloomandtwigstudio.com',
      phone: '(503) 555-4491',
      status: 'booked',
      quotedPrice: 3800,
      finalPrice: 3600,
      rating: 4,
      contractSigned: true,
      notes: 'Foam-free installation using chicken wire and water tubes for zero waste.',
      checklist: [
        { id: 'vc-7', text: 'Send inspiration moodboard for ceremony arch', done: true },
        { id: 'vc-8', text: 'Confirm centerpiece vase return timeline', done: false }
      ]
    },
    {
      id: 'v-4',
      category: 'Photography',
      businessName: 'Wildflower Stories Photography',
      contactPerson: 'Sarah Jenkins',
      email: 'sarah@wildflowerstories.photo',
      phone: '(503) 555-7720',
      status: 'booked',
      quotedPrice: 4200,
      finalPrice: 4200,
      rating: 5,
      contractSigned: true,
      notes: 'Includes full high-res digital gallery with print release.',
      checklist: [
        { id: 'vc-9', text: 'Complete shot list questionnaire with family names', done: false },
        { id: 'vc-10', text: 'Verify golden hour sunset timing (approx 8:15 PM)', done: true }
      ]
    }
  ],
  ideas: {
    themeName: 'Lush Botanical Greenhouse & Candlelit Modernity',
    vibeDescription: 'An organic celebration filled with living foliage, diffused golden glass light, soft textured linens, and effortless intimacy.',
    colorPalette: [
      { name: 'Sage Leaf', hex: '#637A65', role: 'Primary Botanical Accent' },
      { name: 'Warm Terracotta', hex: '#C2704E', role: 'Warm Earthy Pop' },
      { name: 'Cream Alabaster', hex: '#FAF6EE', role: 'Soft Neutral Base' },
      { name: 'Dusty Rose', hex: '#C89D98', role: 'Romantic Floral Hue' },
      { name: 'Antique Brass', hex: '#B89758', role: 'Metallic Warmth' }
    ],
    decorConcepts: [
      {
        title: 'Cascading Ceiling Fern Chandelier',
        description: 'Suspended wire installations packed with asparagus ferns, Italian ruscus, and suspended Edison filament bulbs over the head table.',
        diyTip: 'Rent wire trussing from the venue to avoid high rigging costs.'
      },
      {
        title: 'Tapered Beeswax & Amber Bud Vases',
        description: 'Clusters of varying height amber glass bottles with single stems of ranunculus, olive leaves, and dripless ivory taper candles.',
        diyTip: 'Thrift amber bottles over the months or purchase in bulk craft lots.'
      },
      {
        title: 'Living Herb Potted Escort Cards',
        description: 'Mini terracotta pots with rosemary or thyme tagged with calligraphed guest names and table numbers, doubling as take-home favors.',
        diyTip: 'Source starter herb plugs from a local nursery at $0.80 per plant.'
      }
    ],
    foodAndBeverage: [
      {
        title: 'Signature Cocktail: The Greenhouse Gimlet',
        description: 'Botanical gin, freshly pressed cucumber juice, lime, and crushed garden mint garnished with edible pansy petals.',
        dietaryNotes: 'Can be made as a refreshing non-alcoholic spirit elixir.'
      },
      {
        title: 'Farm-to-Table Seasonal Hearth Table',
        description: 'Slow-roasted chicken breast with crispy skin over polenta, paired with charred broccolini and shaved parmesan.',
        dietaryNotes: 'Vegan roasted butternut squash & wild chanterelle risotto alternative.'
      },
      {
        title: 'Petite Olive Oil Cake & Berry Coulis Dessert Bar',
        description: 'Tiered naked citrus rosemary olive oil cake accompanied by blackberry thyme reduction and lavender shortbreads.'
      }
    ],
    activitiesAndEntertainment: [
      {
        title: 'Audio Guestbook in Vintage Rotary Phone',
        description: 'Guests pick up a 1960s beige rotary handset to hear a sweet greeting from the couple and leave heartfelt voice messages.',
        timing: 'During cocktail hour and late-night reception'
      },
      {
        title: 'Polaroid Guest Wall & Love Note Mailbox',
        description: 'Instant film cameras with metallic gel pens for guests to snap candid moments and peg them on an illuminated twine grid.',
        timing: 'All evening'
      }
    ],
    favorsAndGifts: [
      {
        title: 'Custom Infused Olive Oil Mini Flasks',
        description: 'Artisanal cold-pressed olive oil infused with estate rosemary and chili flakes in wax-sealed bottles.'
      },
      {
        title: 'Wildflower Seed Paper Thank You Cards',
        description: 'Printed on handmade paper embedded with bee-friendly pollinator seeds to plant at home.'
      }
    ],
    musicMood: {
      genre: 'Acoustic Folk-Pop & Modern Soul-Jazz',
      vibeTracks: ['Leon Bridges - Texas Sun', 'Norah Jones - Come Away With Me', 'Ray LaMontagne - You Are the Best Thing', 'Samm Henshaw - Grow'],
      soundTip: 'Keep sound volume conversational during dinner so grandparents and friends can chat without shouting.'
    }
  },
  guests: [
    { id: 'g-1', name: 'Julian Vance (Groom)', email: 'julian@vancestudios.com', status: 'confirmed', partySize: 1, tableNumber: 'Table 1 (Head Table)', dietaryRequirements: 'None', groupCategory: 'Wedding Party' },
    { id: 'g-2', name: 'Elena Rostova (Bride)', email: 'elena@rostovadesign.com', status: 'confirmed', partySize: 1, tableNumber: 'Table 1 (Head Table)', dietaryRequirements: 'Vegetarian', groupCategory: 'Wedding Party' },
    { id: 'g-3', name: 'Marcus Bell (Best Man)', email: 'marcus@bellcapital.io', status: 'confirmed', partySize: 2, tableNumber: 'Table 2', dietaryRequirements: 'None', groupCategory: 'Wedding Party' },
    { id: 'g-4', name: 'Sophie Lin (Maid of Honor)', email: 'sophie@linphoto.org', status: 'confirmed', partySize: 1, tableNumber: 'Table 2', dietaryRequirements: 'Gluten-Free', groupCategory: 'Wedding Party' },
    { id: 'g-5', name: 'Arthur & Martha Vance', email: 'arthur.vance@gmail.com', status: 'confirmed', partySize: 2, tableNumber: 'Table 3', dietaryRequirements: 'None', groupCategory: 'Immediate Family' },
    { id: 'g-6', name: 'Dr. Dmitry & Svetlana Rostova', email: 'dmitry@rostovamd.com', status: 'confirmed', partySize: 2, tableNumber: 'Table 3', dietaryRequirements: 'Nut Allergy', groupCategory: 'Immediate Family' },
    { id: 'g-7', name: 'Chloe & David Vance', email: 'chloe.v@gmail.com', status: 'pending', partySize: 2, tableNumber: 'Table 4', dietaryRequirements: 'Vegan', groupCategory: 'Extended Family' },
    { id: 'g-8', name: 'Lucas Scott & Partner', email: 'lucas@scottmedia.co', status: 'pending', partySize: 2, tableNumber: 'Table 5', dietaryRequirements: 'None', groupCategory: 'College Friends' },
    { id: 'g-9', name: 'Rachel Green', email: 'rachel@greenlaw.org', status: 'declined', partySize: 1, dietaryRequirements: 'None', groupCategory: 'College Friends', notes: 'Sending gift via registry' }
  ]
};

export const SAMPLE_BIRTHDAY: EventPlan = {
  id: 'sample-birthday-1',
  title: 'Neon Oasis: Maya’s 30th Birthday Bash',
  eventType: 'birthday',
  date: '2027-04-12',
  location: 'Skyline Loft Studio, Austin, TX',
  guestCount: 50,
  totalBudget: 4800,
  currency: 'USD',
  vibe: 'Vibrant neon retro-futurism, 90s/00s arcade games, craft sliders, craft cocktails, disco mirror balls and rooftop sunset vibe',
  notes: 'High-energy, interactive photo booth, no boring seated dinners, all about fun and dance!',
  createdAt: '2026-10-20T12:00:00Z',
  updatedAt: '2026-11-01T10:00:00Z',
  budgetItems: [
    {
      id: 'bb-1',
      category: 'venue',
      name: 'Rooftop Loft Studio & Lounge Rental (6 hrs)',
      estimatedCost: 1500,
      actualCost: 1500,
      paidAmount: 750,
      dueDate: '2027-03-15',
      notes: 'Sound system, party lights, and ice machine included',
      status: 'deposit_paid'
    },
    {
      id: 'bb-2',
      category: 'catering',
      name: 'Artisan Slider Bar & Loaded Taco Station',
      estimatedCost: 1200,
      actualCost: 1250,
      paidAmount: 600,
      dueDate: '2027-03-25',
      notes: 'Smash burgers, pulled jackfruit sliders, churro bites',
      status: 'deposit_paid'
    },
    {
      id: 'bb-3',
      category: 'entertainment',
      name: 'DJ & Retro Arcade Cabinets Rental (Pac-Man & Street Fighter)',
      estimatedCost: 900,
      actualCost: 850,
      paidAmount: 850,
      dueDate: '2027-04-01',
      notes: '4-hour live DJ set + 2 arcade machines delivered',
      status: 'paid_in_full'
    },
    {
      id: 'bb-4',
      category: 'decor_rentals',
      name: 'Custom Neon Sign ("Maya 30 & Flirty") + Balloon Arch',
      estimatedCost: 550,
      actualCost: 520,
      paidAmount: 520,
      dueDate: '2027-03-10',
      notes: 'Sign can be kept as home decor piece afterwards',
      status: 'paid_in_full'
    },
    {
      id: 'bb-5',
      category: 'photo_video',
      name: '360 Video Booth & Instant Digital Sharing',
      estimatedCost: 450,
      actualCost: 450,
      paidAmount: 200,
      dueDate: '2027-04-05',
      notes: 'Includes customized overlay graphics with Maya’s name',
      status: 'deposit_paid'
    },
    {
      id: 'bb-6',
      category: 'contingency',
      name: 'Beverage Restock & Extra Ice Buffer',
      estimatedCost: 200,
      actualCost: 0,
      paidAmount: 0,
      dueDate: '2027-04-12',
      notes: 'For late-night snacks or extra seltzers',
      status: 'planned'
    }
  ],
  milestones: [
    {
      id: 'bm-1',
      title: 'Book Rooftop Loft & secure date deposit',
      phase: '2-3 Months Before',
      dueDate: '2027-02-01',
      isCompleted: true,
      priority: 'high',
      category: 'Venue'
    },
    {
      id: 'bm-2',
      title: 'Design digital animated invitations & send via Partiful',
      phase: '6 Weeks Before',
      dueDate: '2027-03-01',
      isCompleted: true,
      priority: 'high',
      category: 'Invites'
    },
    {
      id: 'bm-3',
      title: 'Finalize DJ playlist with milestone era hits (2000s R&B / Pop)',
      phase: '2 Weeks Before',
      dueDate: '2027-03-29',
      isCompleted: false,
      priority: 'medium',
      category: 'Music'
    },
    {
      id: 'bm-4',
      title: 'Pick up custom neon sign and test lighting setup',
      phase: 'Week Of',
      dueDate: '2027-04-09',
      isCompleted: false,
      priority: 'medium',
      category: 'Decor'
    }
  ],
  dayOfSchedule: [
    {
      id: 'bs-1',
      time: '04:00 PM',
      endTime: '06:00 PM',
      title: 'Loft Access & Setup',
      description: 'Caterer sets up hot warmers, arcade delivery arrives, sound check.',
      location: 'Rooftop Loft',
      leadPerson: 'Maya & Partner Alex',
      isCompleted: false
    },
    {
      id: 'bs-2',
      time: '07:00 PM',
      endTime: '08:00 PM',
      title: 'Doors Open, Welcome Cocktails & Sunset Chill',
      description: 'Lofi disco grooves, welcome elderflower spritz, signature snacks.',
      location: 'Main Lounge & Balcony',
      leadPerson: 'Alex & Bartender Jordan',
      isCompleted: false
    },
    {
      id: 'bs-3',
      time: '08:30 PM',
      endTime: '09:00 PM',
      title: 'Arcade Tournament & Best 90s Dressed Award',
      description: 'Quick 8-player knockout on Street Fighter + crowd toast to Maya!',
      location: 'Arcade Corner',
      leadPerson: 'DJ MC',
      isCompleted: false
    },
    {
      id: 'bs-4',
      time: '09:30 PM',
      endTime: '10:00 PM',
      title: 'Birthday Cake & Sparkler Reveal',
      description: 'Matcha crepe cake brought out with indoor cold-spark fountain.',
      location: 'Center Bar',
      leadPerson: 'Friends Squad',
      isCompleted: false
    },
    {
      id: 'bs-5',
      time: '10:00 PM',
      endTime: '01:00 AM',
      title: 'Open Dancefloor & 360 Video Booth Mania',
      description: 'Full party mode! Late-night street tacos rolled out at 11:15 PM.',
      location: 'Dance Floor',
      leadPerson: 'DJ',
      isCompleted: false
    }
  ],
  vendors: [
    {
      id: 'bv-1',
      category: 'Venue',
      businessName: 'Skyline Loft Studio ATX',
      contactPerson: 'Damon Cole',
      email: 'events@skylineloftatx.com',
      phone: '(512) 555-9011',
      status: 'booked',
      quotedPrice: 1500,
      finalPrice: 1500,
      rating: 5,
      contractSigned: true,
      notes: 'Freight elevator access for arcade machine delivery from 3 PM.',
      checklist: [{ id: 'bvc-1', text: 'Confirm keycode lockbox code', done: true }]
    },
    {
      id: 'bv-2',
      category: 'Catering',
      businessName: 'Rollin’ Smoke Sliders & Tacos',
      contactPerson: 'Chef Brenda Ruiz',
      email: 'brenda@rollinsmokeatx.com',
      phone: '(512) 555-3294',
      status: 'booked',
      quotedPrice: 1250,
      finalPrice: 1250,
      rating: 5,
      contractSigned: true,
      notes: 'Includes eco bamboo plates and vegan jackfruit options.',
      checklist: [{ id: 'bvc-2', text: 'Confirm power outlet needs for warming trays', done: true }]
    }
  ],
  ideas: {
    themeName: 'Electric Nostalgia: Neon Sunset Rooftop',
    vibeDescription: 'A high-energy, stylish celebration balancing retro arcade coolness with sleek modern loft aesthetics.',
    colorPalette: [
      { name: 'Neon Electric Pink', hex: '#FF007F', role: 'Main Energy Accent' },
      { name: 'Cyber Cyan', hex: '#00F0FF', role: 'Contrasting Pop' },
      { name: 'Midnight Onyx', hex: '#0F172A', role: 'Sleek Backdrop' },
      { name: 'Warm Amber Gold', hex: '#F59E0B', role: 'Warm Glow' }
    ],
    decorConcepts: [
      {
        title: 'Illuminated Acrylic Bar & Neon Sign Backsplash',
        description: 'Translucent bar front with color-cycling LED strip lighting topped with Maya’s custom neon phrase.',
        diyTip: 'Use wireless magnetic rechargeable LED light bars to eliminate cable clutter.'
      },
      {
        title: 'Cluster Disco Mirror Balls',
        description: 'Trio of 16-inch mirror balls suspended over the center cocktail area reflecting pin-spot beams across the brick walls.'
      }
    ],
    foodAndBeverage: [
      {
        title: 'The Electric Paloma',
        description: 'Smoky Mezcal or Tequila Blanco, fresh ruby red grapefruit juice, splash of agave, and pink Himalayan sea salt rim with charred rosemary.'
      },
      {
        title: 'Slider Sliders Trio',
        description: 'Smash burger with caramelized onions, hot honey fried chicken slider, and barbecue glazed pulled jackfruit.'
      }
    ],
    activitiesAndEntertainment: [
      {
        title: 'Retro High-Score Tournament',
        description: 'Quick tournament on the arcade cabinets with a hilarious retro trophy (e.g., golden joystick) for the top scorer.'
      },
      {
        title: 'Friendship Time Capsule Trivia',
        description: 'Guests submit funny trivia questions about Maya from the last decade, read aloud between DJ tracks.'
      }
    ],
    favorsAndGifts: [
      {
        title: 'Custom Retro Holographic Stickers & Matchboxes',
        description: 'Cute customized matchboxes and retro pixel-art stickers designed with Maya’s cat.'
      }
    ],
    musicMood: {
      genre: '2000s Pop/Hip-Hop, French House & Nu-Disco',
      vibeTracks: ['Daft Punk - One More Time', 'Outkast - Hey Ya!', 'Dua Lipa - Levitating', 'KAYTRANADA - 10%'],
      soundTip: 'Peak dance party between 10 PM and midnight.'
    }
  },
  guests: [
    { id: 'bg-1', name: 'Maya Sterling (Birthday Star)', email: 'maya@sterlingux.com', status: 'confirmed', partySize: 1, tableNumber: 'VIP Lounge A', dietaryRequirements: 'Vegetarian', groupCategory: 'Host' },
    { id: 'bg-2', name: 'Alex Rivera (Partner)', email: 'alex@riveralabs.dev', status: 'confirmed', partySize: 1, tableNumber: 'VIP Lounge A', dietaryRequirements: 'None', groupCategory: 'Host' },
    { id: 'bg-3', name: 'Jordan Hayes', email: 'jordan@soundstream.com', status: 'confirmed', partySize: 2, tableNumber: 'Arcade Booth 1', dietaryRequirements: 'None', groupCategory: 'High School Crew' },
    { id: 'bg-4', name: 'Priya Sharma', email: 'priya@austintech.io', status: 'confirmed', partySize: 1, tableNumber: 'Arcade Booth 1', dietaryRequirements: 'Vegan', groupCategory: 'Work Friends' },
    { id: 'bg-5', name: 'Liam & Zoe Miller', email: 'liam@millerphoto.net', status: 'pending', partySize: 2, tableNumber: 'Rooftop High-Top 3', dietaryRequirements: 'Gluten-Free', groupCategory: 'College Squad' },
    { id: 'bg-6', name: 'Devon Wright', email: 'devon@wrightdesigns.com', status: 'declined', partySize: 1, dietaryRequirements: 'None', groupCategory: 'Work Friends', notes: 'Out of town for conference' }
  ]
};

export const SAMPLE_COMMUNITY: EventPlan = {
  id: 'sample-community-1',
  title: 'Oakridge Green Harvest & Community Block Fair',
  eventType: 'community',
  date: '2027-09-25',
  location: 'Oakridge Community Park & Town Square',
  guestCount: 350,
  totalBudget: 8500,
  currency: 'USD',
  vibe: 'Family-friendly festival, local artisan market, live acoustic stage, children’s activity zone, food trucks, and environmental sustainability demos',
  notes: 'Town permit approved. Focus on community connection, zero waste, accessibility, and celebrating local makers.',
  createdAt: '2026-09-10T08:00:00Z',
  updatedAt: '2026-11-01T08:30:00Z',
  budgetItems: [
    {
      id: 'cb-1',
      category: 'venue',
      name: 'City Park Permit, Pavilion Booking & Waste Management Service',
      estimatedCost: 1200,
      actualCost: 1150,
      paidAmount: 1150,
      dueDate: '2027-06-01',
      notes: 'Permit includes electrical drop box access and sanitation dumpsters',
      status: 'paid_in_full'
    },
    {
      id: 'cb-2',
      category: 'entertainment',
      name: 'Local Bands, Sound Tech & Stage Rental',
      estimatedCost: 2200,
      actualCost: 2000,
      paidAmount: 1000,
      dueDate: '2027-08-15',
      notes: '3 acoustic folk acts and youth orchestra performance',
      status: 'deposit_paid'
    },
    {
      id: 'cb-3',
      category: 'decor_rentals',
      name: 'Folding Tables, Canopies, Restrooms & Safety Barriers',
      estimatedCost: 2400,
      actualCost: 2350,
      paidAmount: 1200,
      dueDate: '2027-08-30',
      notes: '20 vendor canopies + ADA accessible portable restrooms',
      status: 'deposit_paid'
    },
    {
      id: 'cb-4',
      category: 'catering',
      name: 'Volunteer Refreshments & Community Cider Station',
      estimatedCost: 800,
      actualCost: 750,
      paidAmount: 300,
      dueDate: '2027-09-10',
      notes: 'Food trucks are self-funded; this covers water and volunteer lunches',
      status: 'deposit_paid'
    },
    {
      id: 'cb-5',
      category: 'logistics_permits',
      name: 'Event Insurance & Traffic Control Officers',
      estimatedCost: 900,
      actualCost: 900,
      paidAmount: 900,
      dueDate: '2027-07-20',
      notes: 'Required 1M commercial general liability rider',
      status: 'paid_in_full'
    },
    {
      id: 'cb-6',
      category: 'invitations_gifts',
      name: 'Yard Signs, Posters, Flyers & Kids Craft Supplies',
      estimatedCost: 500,
      actualCost: 480,
      paidAmount: 480,
      dueDate: '2027-08-01',
      notes: 'Recycled cardboard yard signs distributed to neighborhood leaders',
      status: 'paid_in_full'
    },
    {
      id: 'cb-7',
      category: 'contingency',
      name: 'Logistics Emergency Reserve',
      estimatedCost: 500,
      actualCost: 0,
      paidAmount: 0,
      dueDate: '2027-09-20',
      notes: 'Backup generators and weather straps',
      status: 'planned'
    }
  ],
  milestones: [
    {
      id: 'cm-1',
      title: 'Submit City Special Event Permit & Park Reservation',
      phase: '6 Months Before',
      dueDate: '2027-03-25',
      isCompleted: true,
      priority: 'high',
      category: 'Permits'
    },
    {
      id: 'cm-2',
      title: 'Vendor & Artisan Booth Application Open Call',
      phase: '4 Months Before',
      dueDate: '2027-05-20',
      isCompleted: true,
      priority: 'high',
      category: 'Vendors'
    },
    {
      id: 'cm-3',
      title: 'Confirm Food Truck lineup & health department permits',
      phase: '2 Months Before',
      dueDate: '2027-07-25',
      isCompleted: false,
      priority: 'high',
      category: 'Catering'
    },
    {
      id: 'cm-4',
      title: 'Volunteer recruitment meeting & station assignment',
      phase: '3 Weeks Before',
      dueDate: '2027-09-04',
      isCompleted: false,
      priority: 'medium',
      category: 'Volunteers'
    }
  ],
  dayOfSchedule: [
    {
      id: 'cs-1',
      time: '07:30 AM',
      endTime: '09:30 AM',
      title: 'Park Setup & Vendor Booth Load-In',
      description: 'Traffic marshals guide craft and food vendors to assigned bays.',
      location: 'Park Perimeter Road',
      leadPerson: 'Logistics Lead Dan',
      isCompleted: false
    },
    {
      id: 'cs-2',
      time: '10:00 AM',
      endTime: '10:30 AM',
      title: 'Official Opening Ceremony & Mayor Welcome',
      description: 'Ribbon cutting, introduction of community sponsors and non-profits.',
      location: 'Bandstand Stage',
      leadPerson: 'Committee President Sarah',
      isCompleted: false
    },
    {
      id: 'cs-3',
      time: '10:30 AM',
      endTime: '02:00 PM',
      title: 'Maker Market, Kids Pumpkin Painting & Live Music',
      description: 'Acoustic sets every 45 mins. Seed bomb workshops in the kids tent.',
      location: 'Central Lawn',
      leadPerson: 'Entertainment Coordinator',
      isCompleted: false
    },
    {
      id: 'cs-4',
      time: '02:00 PM',
      endTime: '03:00 PM',
      title: 'Neighborhood Apple Pie Bake-Off & Raffle',
      description: 'Celebrity judge panel announces winners. Community raffle drawing.',
      location: 'Pavilion Gazebo',
      leadPerson: 'Bake-off Committee',
      isCompleted: false
    },
    {
      id: 'cs-5',
      time: '04:00 PM',
      endTime: '05:30 PM',
      title: 'Event Closing & Leave-No-Trace Clean Up',
      description: 'Volunteer teams sweep grounds, sort compost and recycling, pack canopies.',
      location: 'Entire Park',
      leadPerson: 'Green Team Volunteers',
      isCompleted: false
    }
  ],
  vendors: [
    {
      id: 'cv-1',
      category: 'Infrastructure',
      businessName: 'Valley Party Rentals & Tents',
      contactPerson: 'Rick Morales',
      email: 'rick@valleypartyrentals.com',
      phone: '(503) 555-6671',
      status: 'booked',
      quotedPrice: 2350,
      finalPrice: 2350,
      rating: 5,
      contractSigned: true,
      notes: 'Delivering Friday afternoon with overnight security lock.',
      checklist: [{ id: 'cvc-1', text: 'Confirm stake anchor depths with city utility locator', done: true }]
    },
    {
      id: 'cv-2',
      category: 'Audio/Stage',
      businessName: 'Cascade Sound & Lights',
      contactPerson: 'Liam Foster',
      email: 'liam@cascadesound.org',
      phone: '(503) 555-8829',
      status: 'booked',
      quotedPrice: 2000,
      finalPrice: 2000,
      rating: 4,
      contractSigned: true,
      notes: 'Providing 2 wireless mics for speeches and 4-channel stage mix for bands.',
      checklist: [{ id: 'cvc-2', text: 'Obtain generator noise silencer baffle', done: true }]
    }
  ],
  ideas: {
    themeName: 'Harvest & Heritage: Sustainable Community Fair',
    vibeDescription: 'An earthy, welcoming, multigenerational gathering filled with autumn warmth, acoustic melodies, and hands-on maker activities.',
    colorPalette: [
      { name: 'Harvest Ochre', hex: '#D97706', role: 'Warm Festive Glow' },
      { name: 'Forest Moss', hex: '#2D5A27', role: 'Earthy Nature' },
      { name: 'Rustic Terracotta', hex: '#9A3412', role: 'Autumn Warmth' },
      { name: 'Oatmeal Canvas', hex: '#F3E8DC', role: 'Clean Organic Base' }
    ],
    decorConcepts: [
      {
        title: 'Burlap Pennant Banners & Hay Bale Lounges',
        description: 'Reused burlap pennants strung between trees, with clustered straw bale seating covered in colorful vintage quilts.',
        diyTip: 'Partner with local farms to return straw bales for livestock bedding after the fair.'
      },
      {
        title: 'Chalkboard Wayfinding & Schedule Easels',
        description: 'Repurposed wood frame chalkboards displaying the day’s stage schedule, map, and food truck locations.'
      }
    ],
    foodAndBeverage: [
      {
        title: 'Local Cider Press & Spiced Cider Station',
        description: 'Freshly pressed local heritage apples served either warm with cinnamon sticks or chilled over ice.'
      },
      {
        title: 'Rotating Food Truck Alley',
        description: 'Curated mix of local wood-fired pizza, artisan empanadas, street tacos, and artisan ice cream.'
      }
    ],
    activitiesAndEntertainment: [
      {
        title: 'Great Community Apple Pie Contest',
        description: 'Home bakers bring their best pies judged by the local fire chief and high school pastry teacher.'
      },
      {
        title: 'Kids Seed Bomb Making Station',
        description: 'Children mix clay, soil, and native pollinator wildflower seeds to take home and toss in their garden beds.'
      }
    ],
    favorsAndGifts: [
      {
        title: 'Oakridge Community Harvest Tote Bag',
        description: 'Fair-trade organic cotton screenprinted tote bag showcasing the town oak emblem.'
      }
    ],
    musicMood: {
      genre: 'Bluegrass, Americana & Folk',
      vibeTracks: ['The Lumineers - Flowers in Your Hair', 'Bela Fleck - Big Country', 'Mumford & Sons - Awake My Soul'],
      soundTip: 'Keep acoustic volume balanced so conversations at maker booths remain relaxed.'
    }
  },
  guests: [
    { id: 'cg-1', name: 'Mayor Evelyn Harris (Keynote)', email: 'mayor@oakridgegov.org', status: 'confirmed', partySize: 2, tableNumber: 'Civic Pavilion', dietaryRequirements: 'None', groupCategory: 'Town Council' },
    { id: 'cg-2', name: 'Dan Kowalski (Park Logistics Lead)', email: 'dan@oakridgeparks.org', status: 'confirmed', partySize: 1, tableNumber: 'Committee HQ', dietaryRequirements: 'None', groupCategory: 'Committee' },
    { id: 'cg-3', name: 'Sarah & Tom Jenkins (Bake-Off Chairs)', email: 'sarah@oakridgecommunity.org', status: 'confirmed', partySize: 2, tableNumber: 'Committee HQ', dietaryRequirements: 'Vegetarian', groupCategory: 'Committee' },
    { id: 'cg-4', name: 'Fire Chief Robert Taylor', email: 'chief@oakridgefire.org', status: 'confirmed', partySize: 1, tableNumber: 'Civic Pavilion', dietaryRequirements: 'None', groupCategory: 'Honorary Judges' },
    { id: 'cg-5', name: 'Green Team Volunteers (20 pax)', email: 'volunteers@oakridgegreen.org', status: 'confirmed', partySize: 20, tableNumber: 'Volunteer Gazebo', dietaryRequirements: 'Mixed Vegan & GF', groupCategory: 'Volunteers' }
  ]
};

export const INITIAL_EVENTS: EventPlan[] = [
  SAMPLE_WEDDING,
  SAMPLE_BIRTHDAY,
  SAMPLE_COMMUNITY
];
