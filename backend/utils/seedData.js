const Destination = require('../models/Destination');

const sampleDestinations = [
  {
    name: 'Goa',
    tagline: 'Sun, Sand, Sea & Vibrant Coastal Culture',
    state: 'Goa',
    country: 'India',
    description: 'Goa is India\'s premier beach paradise, featuring pristine golden beaches, Portuguese colonial architecture, electrifying nightlife, and mouth-watering seafood.',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80',
    category: 'Beaches',
    bestTimeToVisit: 'November to February',
    avgCostPerDay: 4000,
    rating: 4.9,
    weatherDefaults: {
      temp: 29,
      condition: 'Sunny & Coastal Breeze',
      rainChance: 8,
      icon: 'sun'
    },
    popularAttractions: [
      { name: 'Calangute & Baga Beaches', description: 'Energetic shores known for watersports, beach shacks, and vibrant vibes.', category: 'Beach', typicalCost: 0, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', isIndoor: false },
      { name: 'Aguada Fort & Lighthouse', description: '17th-century Portuguese fortress overlooking the vast Arabian Sea.', category: 'Heritage', typicalCost: 100, image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80', isIndoor: false },
      { name: 'Basilica of Bom Jesus', description: 'UNESCO World Heritage site holding the mortal remains of St. Francis Xavier.', category: 'Culture', typicalCost: 50, image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80', isIndoor: true },
      { name: 'Goa State Museum', description: 'Showcasing ancient Goan history, Christian art, and archaeological relics.', category: 'Museum', typicalCost: 150, image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=600&q=80', isIndoor: true },
      { name: 'Dudhsagar Waterfalls', description: 'Spectacular four-tiered waterfall cascading through lush Western Ghats.', category: 'Nature', typicalCost: 900, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80', isIndoor: false },
      { name: 'Anjuna Flea Market', description: 'Bohemian bazaar offering handcrafted jewelry, souvenirs, spices, and music.', category: 'Shopping', typicalCost: 0, image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80', isIndoor: false }
    ],
    hotels: [
      { name: 'Casa Bella Ocean Resort', rating: 3, pricePerNight: 3500, location: 'Calangute, North Goa', amenities: ['Swimming Pool', 'Free WiFi', 'Breakfast Included', 'Beach Access'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
      { name: 'Taj Fort Aguada Resort', rating: 5, pricePerNight: 16500, location: 'Sinquerim, Candolim', amenities: ['Sea View', 'Spa', 'Infinity Pool', 'Fine Dining'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80' },
      { name: 'Backpacker Panda Hostel & Stays', rating: 2, pricePerNight: 1200, location: 'Anjuna Beach', amenities: ['Social Lounge', 'Kitchenette', 'Bicycle Rental'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80' }
    ],
    activities: [
      { title: 'Scuba Diving & Watersports Combo', category: 'Adventure', cost: 1800, duration: '3 hours', isIndoor: false },
      { title: 'Sunset Catamaran Cruise on Mandovi River', category: 'Relaxation', cost: 850, duration: '2 hours', isIndoor: false },
      { title: 'Parasailing & Jet Ski at Baga', category: 'Adventure', cost: 1400, duration: '1.5 hours', isIndoor: false },
      { title: 'Goan Culinary Masterclass & Spice Farm Tour', category: 'Food', cost: 1200, duration: '3 hours', isIndoor: true },
      { title: 'Kayaking in Sal Backwaters', category: 'Adventure', cost: 950, duration: '2 hours', isIndoor: false }
    ]
  },
  {
    name: 'Manali',
    tagline: 'Snow-capped Peaks & Thrilling Himalayan Adventures',
    state: 'Himachal Pradesh',
    country: 'India',
    description: 'Nestled along the Beas River valley, Manali offers breathtaking Himalayan panoramas, apple orchards, skiing in Solang Valley, and high-altitude mountain passes.',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80',
    category: 'Mountains',
    bestTimeToVisit: 'October to June',
    avgCostPerDay: 3500,
    rating: 4.8,
    weatherDefaults: {
      temp: 14,
      condition: 'Crisp Mountain Breeze',
      rainChance: 20,
      icon: 'cloud'
    },
    popularAttractions: [
      { name: 'Solang Valley', description: 'Action-packed valley renowned for paragliding, zorbing, and winter skiing.', category: 'Adventure', typicalCost: 1200, image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80', isIndoor: false },
      { name: 'Hadimba Devi Temple', description: 'Ancient wooden pagoda-style temple surrounded by towering cedar forests.', category: 'Culture', typicalCost: 50, image: 'https://images.unsplash.com/photo-1616489953149-8d76d65451a5?auto=format&fit=crop&w=600&q=80', isIndoor: false },
      { name: 'Rohtang Pass Viewpoint', description: 'Dramatic high mountain pass at 13,058 ft with eternal snowfields.', category: 'Sightseeing', typicalCost: 1500, image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=600&q=80', isIndoor: false },
      { name: 'Museum of Himachal Culture & Folk Art', description: 'Fascinating collection of traditional Himalayan wooden carvings and weapons.', category: 'Museum', typicalCost: 100, image: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?auto=format&fit=crop&w=600&q=80', isIndoor: true }
    ],
    hotels: [
      { name: 'The Himalayan Pine Retreat', rating: 3, pricePerNight: 3200, location: 'Old Manali', amenities: ['Mountain View', 'Heating', 'Fireplace Lounge'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
      { name: 'Span Resort & Spa', rating: 5, pricePerNight: 14000, location: 'Kullu Valley', amenities: ['Riverside Lawn', 'Heated Pool', 'Helipad'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80' }
    ],
    activities: [
      { title: 'Tandem Paragliding at Solang Valley', category: 'Adventure', cost: 2200, duration: '1 hour', isIndoor: false },
      { title: 'River Rafting on the Beas River', category: 'Adventure', cost: 1200, duration: '2 hours', isIndoor: false },
      { title: 'Old Manali Cafe Crawl & Live Music', category: 'Food', cost: 800, duration: '3 hours', isIndoor: true }
    ]
  },
  {
    name: 'Kerala',
    tagline: 'God\'s Own Country — Serene Backwaters & Misty Tea Estates',
    state: 'Kerala',
    country: 'India',
    description: 'A tropical symphony of palm-fringed canals, luxury houseboats in Alleppey, emerald tea gardens in Munnar, and authentic Ayurvedic wellness retreats.',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80',
    category: 'Beaches',
    bestTimeToVisit: 'September to March',
    avgCostPerDay: 4200,
    rating: 4.9,
    weatherDefaults: {
      temp: 27,
      condition: 'Tropical & Lush',
      rainChance: 25,
      icon: 'cloud-sun'
    },
    popularAttractions: [
      { name: 'Alleppey Backwaters Cruise', description: 'Glide gently on a private kettuvallam through scenic village waterways.', category: 'Relaxation', typicalCost: 2500, image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80', isIndoor: false },
      { name: 'Munnar Tea Gardens & Museum', description: 'Sprawling carpet of green tea shrubs and tea factory heritage tours.', category: 'Nature', typicalCost: 350, image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80', isIndoor: true },
      { name: 'Kochi Fort & Chinese Fishing Nets', description: 'Historic port town blending Dutch, Portuguese, and Jewish trading heritage.', category: 'Heritage', typicalCost: 100, image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80', isIndoor: false }
    ],
    hotels: [
      { name: 'Lake Palace Backwater Resort', rating: 4, pricePerNight: 5500, location: 'Alleppey Backwaters', amenities: ['Canal View', 'Ayurvedic Spa', 'Boat Transfer'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80' },
      { name: 'Munnar Green Valley Stay', rating: 3, pricePerNight: 3000, location: 'Munnar Hills', amenities: ['Tea Plantation Walk', 'Balcony View'], image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80' }
    ],
    activities: [
      { title: 'Kathakali Dance & Kalaripayattu Show', category: 'Culture', cost: 500, duration: '2 hours', isIndoor: true },
      { title: 'Bamboo Rafting at Periyar Tiger Reserve', category: 'Adventure', cost: 1800, duration: '4 hours', isIndoor: false },
      { title: 'Traditional Ayurvedic Full Body Rejuvenation', category: 'Relaxation', cost: 1500, duration: '1.5 hours', isIndoor: true }
    ]
  },
  {
    name: 'Jaipur',
    tagline: 'The Royal Pink City of Palaces and Forts',
    state: 'Rajasthan',
    country: 'India',
    description: 'The vibrant capital of Rajasthan, celebrated for grand hill fortresses, pink terracotta city gates, opulent royal palaces, and authentic Rajasthani gastronomy.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80',
    category: 'Heritage',
    bestTimeToVisit: 'October to March',
    avgCostPerDay: 3200,
    rating: 4.7,
    weatherDefaults: {
      temp: 26,
      condition: 'Sunny & Warm',
      rainChance: 5,
      icon: 'sun'
    },
    popularAttractions: [
      { name: 'Amber Fort & Palace', description: 'Majestic 16th-century fortress with mirror mosaic Sheesh Mahal.', category: 'Heritage', typicalCost: 500, image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80', isIndoor: false },
      { name: 'Hawa Mahal (Palace of Winds)', description: 'Iconic five-story pink sandstone facade with 953 ornate latticed windows.', category: 'Heritage', typicalCost: 200, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80', isIndoor: false },
      { name: 'City Palace & Museum', description: 'Royal museum housing royal apparel, armory, and astronomical artifacts.', category: 'Museum', typicalCost: 400, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80', isIndoor: true }
    ],
    hotels: [
      { name: 'Heritage Haveli Boutique Stay', rating: 3, pricePerNight: 2800, location: 'Old City, Jaipur', amenities: ['Rooftop Restaurant', 'Folk Music'], image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=600&q=80' },
      { name: 'Rambagh Palace by Taj', rating: 5, pricePerNight: 25000, location: 'Bhawani Singh Road', amenities: ['Royal Suites', 'Peacock Gardens', 'Butler Service'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' }
    ],
    activities: [
      { title: 'Hot Air Balloon Safari over Amber Hills', category: 'Adventure', cost: 6500, duration: '2 hours', isIndoor: false },
      { title: 'Chokhi Dhani Cultural Village Dinner Experience', category: 'Culture', cost: 1100, duration: '4 hours', isIndoor: false },
      { title: 'Old Bazaar Street Food Walk', category: 'Food', cost: 600, duration: '2.5 hours', isIndoor: false }
    ]
  },
  {
    name: 'Ladakh',
    tagline: 'Land of High Mountain Passes, Monasteries & Azure Lakes',
    state: 'Ladakh',
    country: 'India',
    description: 'A magical high-altitude desert surrounded by the Karakoram and Himalayan ranges, featuring dramatic Pangong Lake, sand dunes of Nubra, and Tibetan monasteries.',
    heroImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=400&q=80',
    category: 'Adventure',
    bestTimeToVisit: 'May to September',
    avgCostPerDay: 5000,
    rating: 4.9,
    weatherDefaults: {
      temp: 16,
      condition: 'Clear Mountain Sky & Cold Nights',
      rainChance: 2,
      icon: 'sun'
    },
    popularAttractions: [
      { name: 'Pangong Tso Lake', description: 'Stunning endorheic lake at 14,270 ft changing colors from emerald green to deep cobalt blue.', category: 'Nature', typicalCost: 800, image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=600&q=80', isIndoor: false },
      { name: 'Nubra Valley & Khardung La', description: 'Cross one of the highest motorable passes in the world into dramatic cold sand dunes.', category: 'Adventure', typicalCost: 1500, image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=600&q=80', isIndoor: false },
      { name: 'Thiksey Monastery', description: 'Twelve-story monastery complex resembling the Potala Palace of Lhasa.', category: 'Culture', typicalCost: 100, image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80', isIndoor: true }
    ],
    hotels: [
      { name: 'Grand Dragon Ladakh Resort', rating: 4, pricePerNight: 7500, location: 'Leh City', amenities: ['Oxygen Backup', 'Underfloor Heating'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
      { name: 'Nomadic Eco Camps Pangong', rating: 3, pricePerNight: 3800, location: 'Spangmik, Pangong', amenities: ['Lakefront Tents', 'Campfire'], image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80' }
    ],
    activities: [
      { title: 'Double-Humped Bactrian Camel Ride in Hunder Dunes', category: 'Adventure', cost: 700, duration: '1 hour', isIndoor: false },
      { title: 'Stargazing Astronomy Tour at Hanle Dark Sky Reserve', category: 'Adventure', cost: 1200, duration: '3 hours', isIndoor: false },
      { title: 'Zanskar River White Water Rafting', category: 'Adventure', cost: 2400, duration: '3 hours', isIndoor: false }
    ]
  },
  {
    name: 'Andaman',
    tagline: 'Crystal Turquoise Waters, Coral Reefs & Untouched Islands',
    state: 'Andaman and Nicobar',
    country: 'India',
    description: 'An idyllic archipelago in the Bay of Bengal boasting world-class diving sites, luminous bioluminescent beaches, and lush tropical rainforests.',
    heroImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=400&q=80',
    category: 'Beaches',
    bestTimeToVisit: 'October to May',
    avgCostPerDay: 5200,
    rating: 4.9,
    weatherDefaults: {
      temp: 28,
      condition: 'Tropical Sunshine',
      rainChance: 12,
      icon: 'sun'
    },
    popularAttractions: [
      { name: 'Radhanagar Beach (Havelock)', description: 'Ranked among Asia’s finest beaches with powder-soft white sand.', category: 'Beach', typicalCost: 0, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', isIndoor: false },
      { name: 'Cellular Jail National Memorial', description: 'Historic colonial prison commemorating freedom fighters with Light & Sound show.', category: 'Heritage', typicalCost: 200, image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=600&q=80', isIndoor: true }
    ],
    hotels: [
      { name: 'Havelock Island Beach Resort', rating: 4, pricePerNight: 6500, location: 'Govind Nagar Beach', amenities: ['Private Beach', 'Dive Centre'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80' }
    ],
    activities: [
      { title: 'PADI Certified Deep Sea Scuba Diving', category: 'Adventure', cost: 3500, duration: '3 hours', isIndoor: false },
      { title: 'Night Bioluminescence Kayaking at Havelock', category: 'Adventure', cost: 2500, duration: '2 hours', isIndoor: false }
    ]
  }
];

const seedDestinations = async () => {
  try {
    const count = await Destination.countDocuments();
    if (count === 0) {
      await Destination.insertMany(sampleDestinations);
      console.log(`Successfully seeded ${sampleDestinations.length} travel destinations.`);
    } else {
      console.log(`Destinations already seeded (${count} found).`);
    }
  } catch (error) {
    console.error('Error seeding destinations:', error.message);
  }
};

module.exports = { seedDestinations, sampleDestinations };
