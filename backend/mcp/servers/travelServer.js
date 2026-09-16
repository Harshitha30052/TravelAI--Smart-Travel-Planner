const Destination = require('../../models/Destination');

/**
 * Travel MCP Server
 * Exposes hotel search, places/attractions search, place details, and activity discovery
 */

const travelTools = {
  search_hotels: async ({ destination, checkIn, checkOut, guests = 2, maxPrice = null, starRating = null }) => {
    try {
      const destDoc = await Destination.findOne({
        name: { $regex: new RegExp(`^${destination}$`, 'i') }
      });

      let hotels = [];
      if (destDoc && destDoc.hotels && destDoc.hotels.length > 0) {
        hotels = destDoc.hotels.map(h => ({
          name: h.name,
          rating: h.rating,
          pricePerNight: h.pricePerNight,
          currency: 'INR',
          location: h.location,
          amenities: h.amenities,
          image: h.image,
          available: true
        }));
      } else {
        // Fallback realistic hotel options
        hotels = [
          {
            name: `${destination} Grand Resort & Spa`,
            rating: 4,
            pricePerNight: 5200,
            currency: 'INR',
            location: `Central ${destination}`,
            amenities: ['Pool', 'WiFi', 'Breakfast', 'Spa'],
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
            available: true
          },
          {
            name: `${destination} Heritage Retreat`,
            rating: 3,
            pricePerNight: 3200,
            currency: 'INR',
            location: `Old Town, ${destination}`,
            amenities: ['WiFi', 'Restaurant', 'AC'],
            image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
            available: true
          },
          {
            name: `Zostel & Backpacker Stays ${destination}`,
            rating: 2,
            pricePerNight: 1200,
            currency: 'INR',
            location: `Downtown ${destination}`,
            amenities: ['WiFi', 'Social Lounge', 'Lockers'],
            image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
            available: true
          }
        ];
      }

      if (maxPrice) {
        hotels = hotels.filter(h => h.pricePerNight <= maxPrice);
      }
      if (starRating) {
        hotels = hotels.filter(h => h.rating === starRating);
      }

      return {
        destination,
        guests,
        totalFound: hotels.length,
        hotels
      };
    } catch (error) {
      console.error('search_hotels error:', error);
      return { destination, guests, totalFound: 0, hotels: [] };
    }
  },

  search_places: async ({ destination, category = null }) => {
    try {
      const destDoc = await Destination.findOne({
        name: { $regex: new RegExp(`^${destination}$`, 'i') }
      });

      if (!destDoc) {
        return {
          destination,
          places: [
            { name: `${destination} Central Promenade`, category: 'Sightseeing', typicalCost: 0, isIndoor: false },
            { name: `${destination} Historical Museum`, category: 'Culture', typicalCost: 150, isIndoor: true },
            { name: `${destination} Sunset Point`, category: 'Nature', typicalCost: 0, isIndoor: false }
          ]
        };
      }

      let places = destDoc.popularAttractions || [];
      if (category) {
        places = places.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
      }

      return {
        destination,
        totalPlaces: places.length,
        places
      };
    } catch (error) {
      console.error('search_places error:', error);
      return { destination, totalPlaces: 0, places: [] };
    }
  },

  get_place_details: async ({ placeName, destination }) => {
    try {
      const destDoc = await Destination.findOne({
        name: { $regex: new RegExp(`^${destination}$`, 'i') }
      });

      if (destDoc && destDoc.popularAttractions) {
        const found = destDoc.popularAttractions.find(
          p => p.name.toLowerCase().includes(placeName.toLowerCase())
        );
        if (found) {
          return { found: true, details: found };
        }
      }

      return {
        found: true,
        details: {
          name: placeName,
          description: `Popular highlight located in ${destination}.`,
          typicalCost: 200,
          isIndoor: false,
          category: 'Attraction'
        }
      };
    } catch (error) {
      return { found: false, error: error.message };
    }
  },

  search_activities: async ({ destination, preferences = [], maxPrice = null }) => {
    try {
      const destDoc = await Destination.findOne({
        name: { $regex: new RegExp(`^${destination}$`, 'i') }
      });

      let activities = [];
      if (destDoc && destDoc.activities && destDoc.activities.length > 0) {
        activities = [...destDoc.activities];
      } else {
        activities = [
          { title: `${destination} Walking Tour`, category: 'Culture', cost: 500, duration: '2 hours', isIndoor: false },
          { title: `${destination} Adventure Safari`, category: 'Adventure', cost: 1400, duration: '3 hours', isIndoor: false },
          { title: `${destination} Local Food Tasting`, category: 'Food', cost: 800, duration: '2 hours', isIndoor: true }
        ];
      }

      if (maxPrice) {
        activities = activities.filter(a => a.cost <= maxPrice);
      }

      return {
        destination,
        totalFound: activities.length,
        activities
      };
    } catch (error) {
      console.error('search_activities error:', error);
      return { destination, totalFound: 0, activities: [] };
    }
  }
};

module.exports = { travelTools };
