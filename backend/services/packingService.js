/**
 * Packing Recommendation Service
 * Weather-aware, duration-aware, and activity-aware rule-based packing checklist
 */

const generatePackingList = ({
  destination = 'Goa',
  durationDays = 5,
  weatherSummary = {},
  activities = [],
  travelers = 2
}) => {
  const temp = weatherSummary.temp !== undefined ? weatherSummary.temp : 28;
  const rainChance = weatherSummary.rainChance !== undefined ? weatherSummary.rainChance : 10;
  const condition = (weatherSummary.condition || '').toLowerCase();

  const isRainy = rainChance > 30 || condition.includes('rain') || condition.includes('shower');
  const isCold = temp < 18;
  const isVeryCold = temp < 10;
  const isTropicalOrHot = temp >= 25;

  const categories = [
    {
      category: 'Clothing & Apparel',
      items: [
        { name: `${Math.min(durationDays + 2, 8)}x Breathable tops / t-shirts`, essential: true },
        { name: `${Math.min(durationDays, 5)}x Comfortable shorts / lightweight trousers`, essential: true },
        { name: `${durationDays + 2}x Pairs of undergarments & everyday socks`, essential: true },
        { name: '1x Evening casual / dinner outfit', essential: false },
        { name: 'Comfortable walking / trekking sneakers', essential: true }
      ]
    },
    {
      category: 'Weather & Climate Gear',
      items: []
    },
    {
      category: 'Electronics & Gadgets',
      items: [
        { name: 'High-capacity Power Bank (10,000+ mAh)', essential: true },
        { name: 'Universal travel adapter & fast multi-port charger', essential: true },
        { name: 'Smartphone camera lens wipe & protective case', essential: false }
      ]
    },
    {
      category: 'Health, Toiletries & Hygiene',
      items: [
        { name: 'Broad-spectrum Sunscreen (SPF 50+ PA+++)', essential: true },
        { name: 'Personal toiletry kit & travel-sized toothpaste/brush', essential: true },
        { name: 'Travel first-aid kit (Band-aids, Paracetamol, Antacids, ORS)', essential: true },
        { name: 'Mosquito / insect repellent spray', essential: isTropicalOrHot }
      ]
    },
    {
      category: 'Important Documents & Money',
      items: [
        { name: 'Government Photo ID cards (Aadhaar / Passport / Driving License)', essential: true },
        { name: 'Digital & physical copies of Flight / Hotel confirmations', essential: true },
        { name: 'Backup debit/credit cards and emergency cash (₹2,000 - ₹5,000)', essential: true }
      ]
    }
  ];

  const weatherCategory = categories.find(c => c.category === 'Weather & Climate Gear');

  // Weather-specific additions
  if (isRainy) {
    weatherCategory.items.push(
      { name: 'Compact windproof umbrella', essential: true },
      { name: 'Breathable waterproof rain jacket / poncho', essential: true },
      { name: 'Waterproof phone pouch & dry bag for valuables', essential: true },
      { name: 'Quick-dry extra socks & quick-dry microfiber towel', essential: true }
    );
  }

  if (isVeryCold) {
    weatherCategory.items.push(
      { name: 'Heavy down feather jacket or fleece parkas', essential: true },
      { name: 'Thermal inner wear (top & bottom)', essential: true },
      { name: 'Woolen beanie cap, neck muffler, and insulated gloves', essential: true },
      { name: 'Moisturizing cold cream & lip balm', essential: true }
    );
  } else if (isCold) {
    weatherCategory.items.push(
      { name: 'Warm fleece jacket or knitted sweater', essential: true },
      { name: 'Light scarf or windbreaker', essential: true },
      { name: 'Lip balm and hydrating lotion', essential: false }
    );
  }

  if (isTropicalOrHot) {
    weatherCategory.items.push(
      { name: 'UV Protection Sunglasses (UV400)', essential: true },
      { name: 'Wide-brim sun hat or baseball cap', essential: true },
      { name: 'Hydration electrolyte tablets / water bottle', essential: true }
    );
  }

  // Activity-specific additions
  const allActivityText = activities.map(a => ((a.title || '') + ' ' + (a.category || '')).toLowerCase()).join(' ');

  if (allActivityText.includes('beach') || allActivityText.includes('scuba') || allActivityText.includes('watersport') || destination.toLowerCase().includes('goa') || destination.toLowerCase().includes('andaman')) {
    categories[0].items.push(
      { name: 'Swimwear / board shorts / rash guard', essential: true },
      { name: 'Waterproof beach flip-flops / sandals', essential: true },
      { name: 'Beach towel or sarong', essential: false }
    );
  }

  if (allActivityText.includes('trek') || allActivityText.includes('hike') || allActivityText.includes('adventure') || destination.toLowerCase().includes('manali') || destination.toLowerCase().includes('ladakh')) {
    categories[0].items.push(
      { name: 'Sturdy ankle-support trekking shoes', essential: true },
      { name: 'Moisture-wicking athletic socks', essential: true },
      { name: 'Daypack backpack (20-25L) with rain cover', essential: true }
    );
  }

  // Transform into formatted items with checked: false
  return categories.map(cat => ({
    category: cat.category,
    items: cat.items.map(item => ({
      name: item.name,
      checked: false,
      essential: item.essential !== false
    }))
  }));
};

module.exports = { generatePackingList };
