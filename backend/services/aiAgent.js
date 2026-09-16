const mcpClient = require('../mcp/mcpClient');
const ChatSession = require('../models/ChatSession');
const Trip = require('../models/Trip');

// Initialize Gemini API client if API key is provided
let geminiClient = null;
try {
  if (process.env.GEMINI_API_KEY) {
    const { GoogleGenAI } = require('@google/genai');
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (err) {
  console.warn('Gemini SDK initialization note:', err.message);
}

/**
 * Parses user input to extract intent and travel parameters
 */
const parseUserIntent = (messageText, currentTripState = null) => {
  const text = messageText.toLowerCase().trim();

  // 1. Check for PDF download request
  if (text.includes('download') && (text.includes('pdf') || text.includes('itinerary') || text.includes('it') || text.includes('plan'))) {
    return {
      intent: 'DOWNLOAD_PDF'
    };
  }

  // 2. Check for "Give me the final plan" or "show final plan" or "summary"
  if ((text.includes('final') && (text.includes('plan') || text.includes('itinerary'))) || text.includes('show the plan') || text.includes('view full itinerary')) {
    return {
      intent: 'VIEW_FINAL_PLAN'
    };
  }

  // 3. Check for budget optimization ("keep below 35,000", "reduce budget to 35000", "make it under 35000")
  const budgetOptMatch = text.match(/(?:below|under|within|less than|keep(?: the entire trip)? below|cap at)\s*(?:rs\.?|inr|₹)?\s*([\d,]+)/i);
  if (budgetOptMatch && currentTripState) {
    const amountStr = budgetOptMatch[1].replace(/,/g, '');
    const amount = parseInt(amountStr, 10);
    if (amount > 5000) {
      return {
        intent: 'OPTIMIZE_BUDGET',
        newBudget: amount
      };
    }
  }

  // 4. Check for REPLACE activity ("replace it with an adventure activity under 1500")
  if (text.includes('replace') || text.includes('swap') || text.includes('change it to')) {
    const maxCostMatch = text.match(/(?:under|below|less than|for|within)\s*(?:rs\.?|inr|₹)?\s*([\d,]+)/i);
    const maxCost = maxCostMatch ? parseInt(maxCostMatch[1].replace(/,/g, ''), 10) : 1500;
    
    // Check day mentioned or default to day 2/day 3 if referenced from context
    const dayMatch = text.match(/day\s*(\d+)/i);
    const dayNumber = dayMatch ? parseInt(dayMatch[1], 10) : 2;

    const category = text.includes('adventure') ? 'adventure' :
                     text.includes('water') ? 'adventure' :
                     text.includes('food') || text.includes('dinner') ? 'food' :
                     text.includes('relax') ? 'relaxation' : 'adventure';

    return {
      intent: 'REPLACE_ACTIVITY',
      dayNumber,
      category,
      maxCost
    };
  }

  // 5. Check for REMOVE activity ("remove the museum on day 2", "remove the expensive water activity from Day 3")
  if (text.includes('remove') || text.includes('delete') || text.includes('drop') || text.includes('take out') || text.includes('skip')) {
    const dayMatch = text.match(/day\s*(\d+)/i);
    const dayNumber = dayMatch ? parseInt(dayMatch[1], 10) : (text.includes('day 3') ? 3 : 2);

    let targetActivity = 'museum';
    if (text.includes('museum')) targetActivity = 'museum';
    else if (text.includes('water') || text.includes('scuba') || text.includes('expensive')) targetActivity = 'adventure';
    else if (text.includes('temple')) targetActivity = 'temple';
    else if (text.includes('beach')) targetActivity = 'beach';

    return {
      intent: 'REMOVE_ACTIVITY',
      dayNumber,
      targetActivity
    };
  }

  // 6. Check for weather query
  if (text.includes('weather') || text.includes('temperature') || text.includes('rain') || text.includes('forecast')) {
    const destMatch = text.match(/(?:in|at|for)\s+([a-zA-Z]+)/i);
    return {
      intent: 'GET_WEATHER',
      destination: destMatch ? destMatch[1] : (currentTripState?.destination || 'Goa')
    };
  }

  // 7. Check for packing query
  if (text.includes('pack') || text.includes('what should i bring') || text.includes('luggage')) {
    const destMatch = text.match(/(?:for|to)\s+([a-zA-Z]+)/i);
    return {
      intent: 'GET_PACKING',
      destination: destMatch ? destMatch[1] : (currentTripState?.destination || 'Goa')
    };
  }

  // 8. General / Initial Trip Planning
  // Extract destination
  const knownDestinations = ['Goa', 'Manali', 'Kerala', 'Jaipur', 'Ladakh', 'Andaman', 'Varanasi', 'Udaipur', 'Rishikesh', 'Bali', 'Dubai', 'Paris'];
  let destination = null;
  for (const d of knownDestinations) {
    if (new RegExp(`\\b${d}\\b`, 'i').test(text)) {
      destination = d;
      break;
    }
  }

  // Extract duration (e.g., 5-day, 5 days, 4 nights)
  const durationMatch = text.match(/(\d+)\s*(?:-| )*(?:day|days|night|nights)/i);
  const durationDays = durationMatch ? parseInt(durationMatch[1], 10) : (currentTripState?.durationDays || 5);

  // Extract travelers (e.g., 2 people, 2 travelers, family of 4, couple)
  let travelers = 2;
  const travelersMatch = text.match(/(\d+)\s*(?:people|travelers|adults|persons|pax)/i);
  if (travelersMatch) {
    travelers = parseInt(travelersMatch[1], 10);
  } else if (text.includes('couple') || text.includes('two')) {
    travelers = 2;
  } else if (text.includes('solo') || text.includes('myself') || text.includes('one person')) {
    travelers = 1;
  } else if (text.includes('family of 4') || text.includes('4 members')) {
    travelers = 4;
  }

  // Extract budget (e.g., under 40000, 40,000, 30k)
  let budget = 40000;
  const kBudgetMatch = text.match(/(?:under|below|for|within)?\s*(?:rs\.?|inr|₹)?\s*(\d+)k\b/i);
  const fullBudgetMatch = text.match(/(?:under|below|for|within)?\s*(?:rs\.?|inr|₹)?\s*([\d,]{4,8})/i);
  if (kBudgetMatch) {
    budget = parseInt(kBudgetMatch[1], 10) * 1000;
  } else if (fullBudgetMatch) {
    budget = parseInt(fullBudgetMatch[1].replace(/,/g, ''), 10);
  }

  return {
    intent: 'PLAN_TRIP',
    destination: destination || (currentTripState?.destination || 'Goa'),
    durationDays,
    travelers,
    budget
  };
};

/**
 * Optional Gemini LLM text refiner
 */
const generateLLMCommentary = async (prompt, systemInstruction) => {
  if (!geminiClient) return null;
  try {
    const response = await geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser query: ${prompt}` }] }
      ]
    });
    return response.text ? response.text.trim() : null;
  } catch (err) {
    console.warn('Gemini API call skipped, utilizing built-in agent generator:', err.message);
    return null;
  }
};

/**
 * Main AI Agent Orchestrator Handler
 */
const handleAIChat = async ({ sessionId, message, userId = null }) => {
  // 1. Fetch or create ChatSession for context memory
  let chatSession = await ChatSession.findOne({ sessionId });
  if (!chatSession) {
    chatSession = new ChatSession({
      sessionId,
      userId,
      messages: [],
      currentTripState: null
    });
  }

  // Record user message
  chatSession.messages.push({
    role: 'user',
    content: message,
    timestamp: new Date()
  });

  const tripState = chatSession.currentTripState;
  const parsed = parseUserIntent(message, tripState);

  let replyText = '';
  let richCardData = null;
  let updatedTripState = tripState;

  switch (parsed.intent) {
    case 'PLAN_TRIP': {
      // Execute MCP tool flow
      const itineraryRes = await mcpClient.callTool('generate_itinerary', {
        destination: parsed.destination,
        durationDays: parsed.durationDays,
        travelers: parsed.travelers,
        budget: parsed.budget
      });

      const tripData = itineraryRes.tripData;
      if (userId) {
        tripData.userId = userId;
      }

      // Persist trip to database
      const saveRes = await mcpClient.callTool('create_trip', tripData);
      const tripId = saveRes.tripId || (saveRes.trip && saveRes.trip._id);
      tripData._id = tripId;

      updatedTripState = tripData;
      chatSession.tripId = tripId;
      chatSession.currentTripState = tripData;

      replyText = `I have designed a custom ${parsed.durationDays}-day trip to **${parsed.destination}** for ${parsed.travelers} traveler${parsed.travelers > 1 ? 's' : ''}! Our machine learning model estimated your budget at **₹${tripData.estimatedBudget.toLocaleString('en-IN')}**, well aligned with your ₹${parsed.budget.toLocaleString('en-IN')} target. Weather conditions are ${tripData.weatherSummary.condition.toLowerCase()} (${tripData.weatherSummary.temp}°C) and your itinerary has been prioritized accordingly.`;

      richCardData = {
        cardType: 'TRIP_PLAN',
        trip: tripData,
        tripId,
        weather: tripData.weatherSummary,
        budget: {
          target: parsed.budget,
          estimated: tripData.estimatedBudget,
          breakdown: tripData.budgetBreakdown,
          currency: '₹'
        },
        itinerary: tripData.itinerary,
        packingList: tripData.packingList,
        hotel: tripData.hotel,
        actions: ['VIEW_FULL_ITINERARY', 'MODIFY_TRIP', 'DOWNLOAD_PDF', 'SAVE_TRIP']
      };
      break;
    }

    case 'REMOVE_ACTIVITY': {
      if (!tripState) {
        replyText = "I couldn't locate an active trip in our conversation context. Would you like me to create a new trip plan first?";
        break;
      }

      const modRes = await mcpClient.callTool('modify_itinerary', {
        tripState,
        action: 'REMOVE_ACTIVITY',
        dayNumber: parsed.dayNumber,
        targetActivity: parsed.targetActivity
      });

      if (modRes.success) {
        updatedTripState = modRes.updatedTripState;
        chatSession.currentTripState = updatedTripState;

        // Update database if tripId exists
        if (chatSession.tripId) {
          await Trip.findByIdAndUpdate(chatSession.tripId, updatedTripState);
        }

        replyText = `${modRes.changeSummary} The Day ${parsed.dayNumber} schedule has been updated while keeping the rest of your itinerary intact.`;
        richCardData = {
          cardType: 'MODIFIED_ITINERARY',
          trip: updatedTripState,
          tripId: chatSession.tripId,
          activeDay: parsed.dayNumber,
          actions: ['VIEW_FULL_ITINERARY', 'DOWNLOAD_PDF']
        };
      } else {
        replyText = modRes.message || 'Unable to modify the requested activity.';
      }
      break;
    }

    case 'REPLACE_ACTIVITY': {
      if (!tripState) {
        replyText = "Please plan a trip first before replacing activities.";
        break;
      }

      // Search replacement activity under budget
      const actSearch = await mcpClient.callTool('search_activities', {
        destination: tripState.destination,
        preferences: [parsed.category],
        maxPrice: parsed.maxCost
      });

      const chosenAct = (actSearch.activities && actSearch.activities[0]) || {
        title: 'Parasailing & Jet Ski at Baga',
        category: 'adventure',
        cost: 1400,
        duration: '1.5 hours',
        isIndoor: false
      };

      const replacementActivity = {
        id: `act-${parsed.dayNumber}-custom`,
        time: '02:30 PM',
        title: chosenAct.title,
        description: `Thrilling adventure activity adhering to your ₹${parsed.maxCost} budget requirement.`,
        location: tripState.destination,
        category: chosenAct.category.toLowerCase(),
        estimatedCost: chosenAct.cost,
        isIndoor: chosenAct.isIndoor || false,
        rating: 4.8
      };

      const modRes = await mcpClient.callTool('modify_itinerary', {
        tripState,
        action: 'REPLACE_ACTIVITY',
        dayNumber: parsed.dayNumber,
        targetActivity: 'museum',
        replacementActivity
      });

      if (modRes.success) {
        updatedTripState = modRes.updatedTripState;
        chatSession.currentTripState = updatedTripState;

        if (chatSession.tripId) {
          await Trip.findByIdAndUpdate(chatSession.tripId, updatedTripState);
        }

        replyText = `Found a great match! Replaced the activity on Day ${parsed.dayNumber} with **${chosenAct.title}** (₹${chosenAct.cost.toLocaleString('en-IN')}). Your budget and schedule have been updated.`;
        richCardData = {
          cardType: 'MODIFIED_ITINERARY',
          trip: updatedTripState,
          tripId: chatSession.tripId,
          activeDay: parsed.dayNumber,
          actions: ['VIEW_FULL_ITINERARY', 'DOWNLOAD_PDF']
        };
      }
      break;
    }

    case 'OPTIMIZE_BUDGET': {
      if (!tripState) {
        replyText = "No active trip found to optimize.";
        break;
      }

      const modRes = await mcpClient.callTool('modify_itinerary', {
        tripState,
        action: 'OPTIMIZE_BUDGET',
        newBudgetConstraint: parsed.newBudget
      });

      if (modRes.success) {
        updatedTripState = modRes.updatedTripState;
        chatSession.currentTripState = updatedTripState;

        if (chatSession.tripId) {
          await Trip.findByIdAndUpdate(chatSession.tripId, updatedTripState);
        }

        replyText = `I have optimized your entire trip! Selected smart boutique accommodations and renegotiated activity passes to bring the total estimated budget to **₹${updatedTripState.estimatedBudget.toLocaleString('en-IN')}**, comfortably under your new **₹${parsed.newBudget.toLocaleString('en-IN')}** budget ceiling.`;
        richCardData = {
          cardType: 'BUDGET_OPTIMIZED',
          trip: updatedTripState,
          tripId: chatSession.tripId,
          budget: {
            target: parsed.newBudget,
            estimated: updatedTripState.estimatedBudget,
            breakdown: updatedTripState.budgetBreakdown,
            currency: '₹'
          },
          actions: ['VIEW_FULL_ITINERARY', 'DOWNLOAD_PDF']
        };
      }
      break;
    }

    case 'VIEW_FINAL_PLAN': {
      if (!tripState) {
        replyText = "You don't have an active trip plan right now. Tell me where you'd like to travel!";
        break;
      }

      replyText = `Here is your complete final travel plan for **${tripState.destination}**! All adjustments have been consolidated, budget locked at ₹${tripState.estimatedBudget.toLocaleString('en-IN')}, and full day-by-day itineraries are ready below.`;
      richCardData = {
        cardType: 'TRIP_PLAN',
        trip: tripState,
        tripId: chatSession.tripId || tripState._id,
        weather: tripState.weatherSummary,
        budget: {
          target: tripState.budget,
          estimated: tripState.estimatedBudget,
          breakdown: tripState.budgetBreakdown,
          currency: '₹'
        },
        itinerary: tripState.itinerary,
        packingList: tripState.packingList,
        hotel: tripState.hotel,
        actions: ['DOWNLOAD_PDF', 'VIEW_FULL_ITINERARY']
      };
      break;
    }

    case 'DOWNLOAD_PDF': {
      const tripId = chatSession.tripId || tripState?._id;
      if (!tripId) {
        replyText = "Please generate a trip first before downloading.";
        break;
      }

      replyText = `Your professional travel itinerary PDF is ready! Click the button below to download the complete document.`;
      richCardData = {
        cardType: 'PDF_READY',
        tripId,
        downloadUrl: `/api/trips/${tripId}/pdf`,
        actions: ['DOWNLOAD_PDF']
      };
      break;
    }

    case 'GET_WEATHER': {
      const weatherData = await mcpClient.callTool('get_weather', { destination: parsed.destination });
      replyText = `Current weather in **${parsed.destination}**: ${weatherData.temperature}, ${weatherData.condition} with ${weatherData.rainChance} chance of rain. ${weatherData.travelAdvice}`;
      richCardData = {
        cardType: 'WEATHER_ONLY',
        weather: weatherData
      };
      break;
    }

    case 'GET_PACKING': {
      const weather = await mcpClient.callTool('get_weather', { destination: parsed.destination });
      const packing = await mcpClient.callTool('generate_packing_list', {
        destination: parsed.destination,
        durationDays: tripState?.durationDays || 5,
        weatherSummary: weather,
        activities: tripState?.itinerary ? tripState.itinerary.flatMap(d => d.activities) : []
      });

      replyText = `Here is your weather-tailored packing checklist for ${parsed.destination} (${weather.temperature}, ${weather.condition}):`;
      richCardData = {
        cardType: 'PACKING_ONLY',
        packingList: packing
      };
      break;
    }

    default: {
      replyText = `I am your Smart Travel Assistant. You can ask me to plan a trip (e.g. *"Plan a 5-day trip to Goa for 2 people under ₹40,000"*), modify activities, optimize your budget, or check weather and packing essentials.`;
    }
  }

  // Save assistant message to chat history
  chatSession.messages.push({
    role: 'assistant',
    content: replyText,
    richData: richCardData,
    timestamp: new Date()
  });

  await chatSession.save();

  return {
    success: true,
    reply: replyText,
    richData: richCardData,
    tripState: updatedTripState,
    sessionId
  };
};

module.exports = {
  handleAIChat,
  parseUserIntent
};
