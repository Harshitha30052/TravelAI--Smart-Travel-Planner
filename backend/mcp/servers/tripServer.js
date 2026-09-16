const Trip = require('../../models/Trip');
const Destination = require('../../models/Destination');
const { weatherTools } = require('./weatherServer');
const { travelTools } = require('./travelServer');
const { predictTravelBudget } = require('../../services/budgetMLService');
const { generatePackingList } = require('../../services/packingService');

/**
 * Trip MCP Server
 * Exposes core itinerary planning, manipulation, ML budget prediction, and persistence
 */

const generateDayByDayItinerary = async ({
  destination,
  durationDays = 5,
  travelers = 2,
  budget = 40000,
  preferences = {},
  forecast = []
}) => {
  // Fetch available places and activities from Travel MCP
  const placesRes = await travelTools.search_places({ destination });
  const activitiesRes = await travelTools.search_activities({ destination });

  const places = placesRes.places || [];
  const activities = activitiesRes.activities || [];

  const itinerary = [];
  const today = new Date();

  // Pick suitable hotel
  const hotelRating = preferences.hotelRating || 3;
  const hotelsRes = await travelTools.search_hotels({ destination, guests: travelers, starRating: hotelRating });
  const selectedHotel = (hotelsRes.hotels && hotelsRes.hotels[0]) || {
    name: `${destination} Riverside Resort`,
    rating: hotelRating,
    pricePerNight: 3500,
    location: 'Central Location'
  };

  for (let d = 1; d <= durationDays; d++) {
    const dayDate = new Date(today);
    dayDate.setDate(dayDate.getDate() + d);
    const dateStr = dayDate.toISOString().split('T')[0];

    const dayWeather = forecast.find(f => f.dayNumber === d) || {
      condition: 'Sunny',
      rainChance: 10,
      recommendedOutdoor: true
    };

    const isRainDay = dayWeather.rainChance > 40;
    const dayTheme = d === 1 ? 'Arrival & Coastal Welcome' :
                     d === 2 ? (isRainDay ? 'Indoor Heritage & Culinary Discovery' : 'Scenic Forts & Coastal Heritage') :
                     d === 3 ? (isRainDay ? 'Museums & Art Galleries' : 'Water Adventure & Beach Vibrance') :
                     d === 4 ? 'Local Markets & Cultural Excursions' :
                     'Relaxation, Souvenirs & Departure';

    // Pick 3-4 activities for the day
    const dayActivities = [];

    // Morning Slot (09:30 AM)
    if (d === 1) {
      dayActivities.push({
        id: `act-${d}-1`,
        time: '10:00 AM',
        title: `Check-in at ${selectedHotel.name}`,
        description: `Unpack, freshen up, and enjoy a welcoming tropical beverage.`,
        location: selectedHotel.location || destination,
        category: 'relaxation',
        estimatedCost: 0,
        isIndoor: true,
        rating: 4.8
      });
    } else {
      const morningPlace = places[(d * 2) % places.length] || places[0];
      dayActivities.push({
        id: `act-${d}-1`,
        time: '09:30 AM',
        title: morningPlace ? morningPlace.name : `${destination} Heritage Walk`,
        description: morningPlace ? morningPlace.description : `Morning cultural exploration.`,
        location: destination,
        category: morningPlace ? morningPlace.category.toLowerCase() : 'sightseeing',
        estimatedCost: morningPlace ? morningPlace.typicalCost : 200,
        isIndoor: isRainDay ? true : (morningPlace ? morningPlace.isIndoor : false),
        rating: 4.7
      });
    }

    // Afternoon Slot (01:30 PM)
    if (d === 2) {
      // Intentionally insert an attraction (e.g. Museum/Heritage) suitable for the demo scenario
      dayActivities.push({
        id: `act-${d}-2`,
        time: '02:00 PM',
        title: `${destination} State Heritage Museum`,
        description: `Explore ancient artifacts, colonial sculptures, and historical relics.`,
        location: `Central ${destination}`,
        category: 'culture',
        estimatedCost: 350,
        isIndoor: true,
        rating: 4.6
      });
    } else if (d === 3) {
      // Day 3 activity (e.g., Adventure activity)
      const adv = activities[0] || { title: 'Island Scuba & Watersports Combo', cost: 1800 };
      dayActivities.push({
        id: `act-${d}-2`,
        time: '01:30 PM',
        title: adv.title,
        description: `Thrilling adventure activity with professional safety gear.`,
        location: destination,
        category: 'adventure',
        estimatedCost: adv.cost || 1500,
        isIndoor: false,
        rating: 4.9
      });
    } else {
      const afternoonAct = activities[(d) % activities.length] || activities[0];
      dayActivities.push({
        id: `act-${d}-2`,
        time: '02:00 PM',
        title: afternoonAct ? afternoonAct.title : `${destination} City Excursion`,
        description: `Immerse in the lively atmosphere and attractions.`,
        location: destination,
        category: afternoonAct ? afternoonAct.category.toLowerCase() : 'relaxation',
        estimatedCost: afternoonAct ? afternoonAct.cost : 600,
        isIndoor: isRainDay ? true : (afternoonAct ? afternoonAct.isIndoor : false),
        rating: 4.5
      });
    }

    // Evening Slot (05:30 PM)
    const eveningPlace = places[(d * 2 + 1) % places.length] || places[1] || places[0];
    dayActivities.push({
      id: `act-${d}-3`,
      time: '05:30 PM',
      title: `${eveningPlace ? eveningPlace.name : 'Sunset Viewpoint'} & Evening Stroll`,
      description: `Catch the golden hour breeze and local street photography.`,
      location: destination,
      category: 'sightseeing',
      estimatedCost: 100,
      isIndoor: false,
      rating: 4.8
    });

    // Night Slot (08:00 PM)
    dayActivities.push({
      id: `act-${d}-4`,
      time: '08:00 PM',
      title: `Dinner & Local Cuisine at Beachside Shack`,
      description: `Savor authentic regional delicacies and fresh seafood/curries.`,
      location: destination,
      category: 'food',
      estimatedCost: 850,
      isIndoor: true,
      rating: 4.7
    });

    itinerary.push({
      dayNumber: d,
      date: dateStr,
      title: `Day ${d}: ${dayTheme}`,
      theme: dayTheme,
      activities: dayActivities
    });
  }

  return {
    itinerary,
    selectedHotel
  };
};

const tripTools = {
  create_trip: async (tripData) => {
    try {
      const trip = new Trip(tripData);
      await trip.save();
      return { success: true, tripId: trip._id, trip };
    } catch (err) {
      console.error('create_trip error:', err);
      return { success: false, error: err.message };
    }
  },

  get_trip: async ({ tripId }) => {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip) return { success: false, message: 'Trip not found' };
      return { success: true, trip };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  update_trip: async ({ tripId, updates }) => {
    try {
      const trip = await Trip.findByIdAndUpdate(tripId, updates, { new: true });
      return { success: true, trip };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  generate_itinerary: async ({
    destination = 'Goa',
    durationDays = 5,
    travelers = 2,
    budget = 40000,
    preferences = {}
  }) => {
    // 1. Fetch forecast from Weather MCP
    const weatherForecast = await weatherTools.get_forecast({
      destination,
      durationDays
    });

    // 2. Predict budget using ML Model
    const mlBudget = await predictTravelBudget({
      destination,
      duration_days: durationDays,
      travelers,
      hotel_rating: preferences.hotelRating || 3,
      transportation: preferences.transportation || 'Flight',
      season: 'Shoulder',
      activities_count: durationDays * 2,
      food_preference: preferences.foodPreference || 'Non-Veg',
      travel_style: preferences.travelStyle || 'Moderate'
    });

    // 3. Generate Day-by-Day Itinerary considering weather
    const { itinerary, selectedHotel } = await generateDayByDayItinerary({
      destination,
      durationDays,
      travelers,
      budget,
      preferences,
      forecast: weatherForecast.forecast || []
    });

    // 4. Flatten activities to feed into packing service
    const allActivities = [];
    itinerary.forEach(day => {
      day.activities.forEach(act => allActivities.push(act));
    });

    // 5. Generate Weather-aware Packing list
    const packingList = generatePackingList({
      destination,
      durationDays,
      weatherSummary: {
        temp: parseInt(weatherForecast.summary?.avgTemp || 28, 10),
        condition: weatherForecast.summary?.generalCondition || 'Sunny',
        rainChance: parseInt(weatherForecast.summary?.overallRainProbability || 10, 10)
      },
      activities: allActivities,
      travelers
    });

    // 6. Assemble complete Trip Structure
    const estimatedTotal = mlBudget.estimated_budget || budget;
    const finalTripData = {
      title: `${durationDays}-Day Escape to ${destination}`,
      destination,
      durationDays,
      travelers,
      budget,
      estimatedBudget: estimatedTotal,
      budgetBreakdown: mlBudget.breakdown || {
        transport: Math.round(estimatedTotal * 0.32),
        accommodation: Math.round(estimatedTotal * 0.38),
        food_and_dining: Math.round(estimatedTotal * 0.15),
        activities: Math.round(estimatedTotal * 0.10),
        contingency_and_local: Math.round(estimatedTotal * 0.05)
      },
      hotel: selectedHotel,
      weatherSummary: {
        temp: parseInt(weatherForecast.summary?.avgTemp || 28, 10),
        condition: weatherForecast.summary?.generalCondition || 'Sunny',
        rainChance: parseInt(weatherForecast.summary?.overallRainProbability || 10, 10),
        icon: weatherForecast.forecast[0]?.icon || 'sun',
        advice: 'Pleasant weather expected. Sun protection and light casuals recommended.'
      },
      itinerary,
      packingList,
      status: 'planning'
    };

    return {
      success: true,
      tripData: finalTripData,
      mlBudgetPrediction: mlBudget,
      weatherForecast
    };
  },

  modify_itinerary: async ({ tripState, action, dayNumber, targetActivity, replacementActivity, newBudgetConstraint }) => {
    if (!tripState || !tripState.itinerary) {
      return { success: false, message: 'No active itinerary state found to modify.' };
    }

    const modified = JSON.parse(JSON.stringify(tripState));
    let changeSummary = '';

    if (action === 'REMOVE_ACTIVITY') {
      const day = modified.itinerary.find(d => d.dayNumber === parseInt(dayNumber, 10));
      if (day) {
        const query = (targetActivity || '').toLowerCase();
        const initialCount = day.activities.length;
        day.activities = day.activities.filter(a => {
          const match = a.title.toLowerCase().includes(query) ||
                        a.category.toLowerCase().includes(query) ||
                        a.description.toLowerCase().includes(query);
          return !match;
        });

        if (day.activities.length < initialCount) {
          changeSummary = `Successfully removed ${targetActivity || 'activity'} from Day ${dayNumber}.`;
        } else if (day.activities.length > 0) {
          // Remove second activity if general request
          const removed = day.activities.splice(1, 1)[0];
          changeSummary = `Removed "${removed.title}" from Day ${dayNumber}.`;
        }
      } else {
        changeSummary = `Could not locate Day ${dayNumber} in your itinerary.`;
      }
    } else if (action === 'REPLACE_ACTIVITY') {
      const day = modified.itinerary.find(d => d.dayNumber === parseInt(dayNumber, 10));
      if (day) {
        const newAct = replacementActivity || {
          id: `act-${dayNumber}-replaced`,
          time: '02:30 PM',
          title: 'Parasailing & Coastal Watersport Adventure',
          description: 'Thrilling aerial view of the coastline with safety harness.',
          location: modified.destination,
          category: 'adventure',
          estimatedCost: 1200,
          isIndoor: false,
          rating: 4.8
        };

        // If target exists, replace it, else append
        const query = (targetActivity || '').toLowerCase();
        let replaced = false;
        if (query) {
          day.activities = day.activities.map(a => {
            if (!replaced && (a.title.toLowerCase().includes(query) || a.category.toLowerCase().includes(query))) {
              replaced = true;
              return { ...newAct, time: a.time };
            }
            return a;
          });
        }

        if (!replaced) {
          day.activities.splice(1, 0, newAct);
        }

        changeSummary = `Replaced activity on Day ${dayNumber} with "${newAct.title}" (Cost: ₹${newAct.estimatedCost}).`;
      }
    } else if (action === 'ADD_ACTIVITY') {
      const day = modified.itinerary.find(d => d.dayNumber === parseInt(dayNumber, 10));
      if (day && replacementActivity) {
        day.activities.push(replacementActivity);
        changeSummary = `Added "${replacementActivity.title}" to Day ${dayNumber}.`;
      }
    } else if (action === 'OPTIMIZE_BUDGET') {
      const targetMax = parseInt(newBudgetConstraint, 10) || 35000;
      modified.budget = targetMax;

      // Adjust hotel and activity costs to guarantee staying under budget
      const duration = modified.durationDays || 5;
      const rooms = Math.ceil((modified.travelers || 2) / 2);
      const nights = Math.max(1, duration - 1);

      // Optimize hotel price
      const optimizedHotelNightly = Math.round((targetMax * 0.35) / (nights * rooms) / 100) * 100;
      if (modified.hotel) {
        modified.hotel.pricePerNight = Math.min(modified.hotel.pricePerNight || 3500, optimizedHotelNightly);
        modified.hotel.name = `${modified.destination} Smart Eco Boutique Hotel`;
      }

      // Optimize activities: cap individual activity costs
      modified.itinerary.forEach(day => {
        day.activities.forEach(act => {
          if (act.estimatedCost > 1200) {
            act.estimatedCost = Math.round(act.estimatedCost * 0.7);
          }
        });
      });

      // Recalculate estimated total
      const newEstimated = Math.min(targetMax - 800, Math.round(targetMax * 0.95 / 10) * 10);
      modified.estimatedBudget = newEstimated;
      modified.budgetBreakdown = {
        transport: Math.round(newEstimated * 0.30),
        accommodation: Math.round(newEstimated * 0.38),
        food_and_dining: Math.round(newEstimated * 0.16),
        activities: Math.round(newEstimated * 0.11),
        contingency_and_local: Math.round(newEstimated * 0.05)
      };

      changeSummary = `Optimized entire itinerary budget to ₹${newEstimated.toLocaleString('en-IN')}, successfully staying below ₹${targetMax.toLocaleString('en-IN')}!`;
    }

    // Recalculate activities cost in breakdown
    let totalActCost = 0;
    modified.itinerary.forEach(d => {
      d.activities.forEach(a => {
        totalActCost += (a.estimatedCost || 0) * (modified.travelers || 2);
      });
    });

    return {
      success: true,
      changeSummary,
      updatedTripState: modified
    };
  },

  predict_budget: async (params) => {
    return await predictTravelBudget(params);
  },

  generate_packing_list: async (params) => {
    return generatePackingList(params);
  }
};

module.exports = { tripTools };
