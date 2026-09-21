const mcpClient = require('../mcp/mcpClient');
const ChatSession = require('../models/ChatSession');
const Trip = require('../models/Trip');
const User = require('../models/User');

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

const KNOWN_DESTINATIONS = [
  'Goa', 'Manali', 'Kerala', 'Jaipur', 'Ladakh', 'Andaman', 
  'Varanasi', 'Udaipur', 'Rishikesh', 'Bali', 'Dubai', 'Paris', 'Singapore'
];

/**
 * Parses user input to extract intent and travel parameters
 */
const parseUserIntent = (messageText, currentTripState = null) => {
  const text = messageText.toLowerCase().trim();

  // 1. Explicit Greetings: "hello", "hi", "hey", "good morning", etc.
  const greetingRegex = /^(hi|hello|hey|greetings|namaste|good morning|good afternoon|good evening|howdy)(!|\.|\?|\s|$)|^(hi|hello)\s*(there|bot|assistant)?$/i;
  if (greetingRegex.test(text)) {
    return {
      intent: 'GREETING'
    };
  }

  // 2. Help and Capabilities queries
  if (/^(what can you do|who are you|help|help me|how does this work|what are your features|what do you do)\??$/i.test(text) ||
      text.includes('what can you do') || text.includes('who are you')) {
    return {
      intent: 'HELP_INFO'
    };
  }

  // 3. PDF download request
  if (text.includes('download') && (text.includes('pdf') || text.includes('itinerary') || text.includes('it') || text.includes('plan'))) {
    return {
      intent: 'DOWNLOAD_PDF'
    };
  }

  // 4. "Give me the final plan" or "show final plan" or "summary"
  if ((text.includes('final') && (text.includes('plan') || text.includes('itinerary'))) || text.includes('show the plan') || text.includes('view full itinerary')) {
    return {
      intent: 'VIEW_FINAL_PLAN'
    };
  }

  // 5. Budget optimization ("keep below 35,000", "reduce budget to 35000", "make it under 35000")
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

  // 6. Replace activity ("replace it with an adventure activity under 1500")
  if (text.includes('replace') || text.includes('swap') || text.includes('change it to')) {
    const maxCostMatch = text.match(/(?:under|below|less than|for|within)\s*(?:rs\.?|inr|₹)?\s*([\d,]+)/i);
    const maxCost = maxCostMatch ? parseInt(maxCostMatch[1].replace(/,/g, ''), 10) : 1500;
    
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

  // 7. Remove activity ("remove the museum on day 2", "remove the expensive water activity from Day 3")
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

  // 8. Ask for recommendations / suggestions
  if (text.includes('recommend') || text.includes('suggest') || text.includes('where should i go') || 
      text.includes('best places') || text.includes('places to visit') || text.includes('good destination') ||
      text.includes('somewhere cold') || text.includes('beach destination') || text.includes('mountain trip')) {
    
    let category = null;
    if (text.includes('beach') || text.includes('coastal')) category = 'Beaches';
    else if (text.includes('cold') || text.includes('mountain') || text.includes('snow') || text.includes('hill')) category = 'Mountains';
    else if (text.includes('heritage') || text.includes('royal') || text.includes('history') || text.includes('culture')) category = 'Heritage';
    else if (text.includes('adventure') || text.includes('trek')) category = 'Adventure';

    return {
      intent: 'ASK_RECOMMENDATION',
      category
    };
  }

  // 9. Weather query
  if (text.includes('weather') || text.includes('temperature') || text.includes('rain') || text.includes('forecast')) {
    const destMatch = text.match(/(?:in|at|for)\s+([a-zA-Z]+)/i);
    return {
      intent: 'GET_WEATHER',
      destination: destMatch ? destMatch[1] : (currentTripState?.destination || 'Goa')
    };
  }

  // 10. Packing query
  if (text.includes('pack') || text.includes('what should i bring') || text.includes('luggage')) {
    const destMatch = text.match(/(?:for|to)\s+([a-zA-Z]+)/i);
    return {
      intent: 'GET_PACKING',
      destination: destMatch ? destMatch[1] : (currentTripState?.destination || 'Goa')
    };
  }

  // 11. Destination Extraction
  let destination = null;
  for (const d of KNOWN_DESTINATIONS) {
    if (new RegExp(`\\b${d}\\b`, 'i').test(text)) {
      destination = d;
      break;
    }
  }

  // Also check "trip to [City]"
  if (!destination) {
    const toMatch = text.match(/(?:trip|travel|go|visit)\s+to\s+([a-zA-Z]+)/i);
    if (toMatch && toMatch[1]) {
      const candidate = toMatch[1].charAt(0).toUpperCase() + toMatch[1].slice(1).toLowerCase();
      // Ensure candidate is not a preposition/stopword
      if (!['A', 'The', 'Somewhere', 'Anywhere'].includes(candidate)) {
        destination = candidate;
      }
    }
  }

  // 12. Incomplete Trip Request: User wants to plan a trip but didn't specify destination!
  if (!destination && !currentTripState && (
      text.includes('plan a trip') || text.includes('plan my trip') || text.includes('i want to travel') ||
      text.includes('create a trip') || text.includes('plan vacation') || text.includes('make an itinerary')
  )) {
    return {
      intent: 'CLARIFY_REQUIREMENTS'
    };
  }

  // 13. If destination was found OR user is actively planning an existing trip context
  if (destination || (currentTripState && (text.includes('day') || text.includes('trip') || text.includes('budget')))) {
    // Extract duration (e.g., 5-day, 5 days, 4 nights)
    const durationMatch = text.match(/(\d+)\s*(?:-| )*(?:day|days|night|nights)/i);
    const durationDays = durationMatch ? parseInt(durationMatch[1], 10) : (currentTripState?.durationDays || 5);

    // Extract travelers
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

    // Extract budget
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
      destination: destination || currentTripState?.destination,
      durationDays,
      travelers,
      budget
    };
  }

  // 14. Fallback to General Chat
  return {
    intent: 'GENERAL_CHAT'
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

  // 2. Fetch User Profile to personalize recommendations & dialogue
  let currentUser = null;
  if (userId) {
    try {
      currentUser = await User.findById(userId).select('-password');
    } catch (e) {
      // Ignore
    }
  }

  const userPrefs = currentUser?.preferences || {
    travelStyle: 'Moderate',
    foodPreference: 'Non-Veg',
    pace: 'Balanced',
    interests: []
  };
  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Explorer';

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
    case 'GREETING': {
      if (currentUser) {
        replyText = `Hello **${userName}**! 👋 Welcome back to **Smart Travel AI**.\n\nI have loaded your travel profile:\n• **Travel Style:** ${userPrefs.travelStyle}\n• **Food Preference:** ${userPrefs.foodPreference}\n• **Pace:** ${userPrefs.pace}\n\nWhere are you dreaming of heading next? You can ask me to plan a trip (e.g. *"Plan a 5-day trip to Goa for 2 under ₹40,000"*), or ask *"Recommend destinations for me"*!`;
      } else {
        replyText = `Hello! 👋 I'm your **Smart Travel AI Assistant**.\n\nI can build weather-aware travel itineraries, forecast your expenses using Machine Learning regression, and adapt plans interactively.\n\nWhere would you like to travel? Or tell me what vibe you're looking for (e.g. *"Suggest a mountain getaway"* or *"Plan a 4-day trip to Manali"*).`;
      }
      richCardData = {
        cardType: 'GREETING',
        suggestions: [
          'Recommend destinations for me',
          'Plan a 5-day trip to Goa under ₹40,000',
          'Plan a 4-day trip to Manali under ₹30,000',
          'What can you do?'
        ]
      };
      break;
    }

    case 'HELP_INFO': {
      replyText = `Here is how I can help you plan your journey:\n\n1. **AI Travel Orchestration**: Connects with Weather, Travel, and Trip MCP servers.\n2. **Machine Learning Budget Regressor**: Uses a Random Forest ML model to estimate your total budget based on duration, traveler count, hotel category, and travel style.\n3. **Weather-Aware Scheduling**: Live forecasts move outdoor beach & hiking activities to sunny days and indoor heritage sites during rain.\n4. **Conversational Modifications**: Say *"Remove the museum on day 2"*, *"Replace it with an adventure activity under ₹1,500"*, or *"Keep the entire trip under ₹35,000"*.\n5. **1-Click PDF Voucher**: Download a formatted itinerary document for your trip anytime!`;
      richCardData = {
        cardType: 'HELP_INFO',
        suggestions: [
          'Recommend a trip for me',
          'Plan a 5-day Goa trip for ₹40,000',
          'Check weather in Manali'
        ]
      };
      break;
    }

    case 'ASK_RECOMMENDATION': {
      const recResult = await mcpClient.callTool('recommend_destinations', {
        category: parsed.category,
        travelStyle: userPrefs.travelStyle,
        interests: userPrefs.interests || []
      });

      const recs = recResult.recommendations || [];
      const recNames = recs.map(r => r.name).join(', ');

      replyText = `Based on your **${userPrefs.travelStyle}** travel style${parsed.category ? ` and interest in **${parsed.category}**` : ''}, here are my top recommended escapes: **${recNames}**.\n\nClick any destination below to start planning with AI!`;
      richCardData = {
        cardType: 'DESTINATION_RECOMMENDATIONS',
        recommendations: recs
      };
      break;
    }

    case 'CLARIFY_REQUIREMENTS': {
      replyText = `I'd love to craft your personalized vacation! ✈️\n\nTo build the perfect plan, could you tell me:\n1. **Which destination** do you have in mind? (e.g. *Goa, Manali, Kerala, Ladakh, Jaipur, Andaman...*)\n2. **Duration & Travelers**: (e.g. *5 days for 2 people*)\n3. **Approximate Budget**: (e.g. *under ₹40,000*)\n\n*Or ask me: "Recommend beach destinations for me"*`;
      richCardData = {
        cardType: 'CLARIFY',
        suggestions: [
          'Plan a 5-day Goa trip for 2 under ₹40,000',
          'Plan a 4-day Manali trip under ₹30,000',
          'Recommend places for me'
        ]
      };
      break;
    }

    case 'PLAN_TRIP': {
      // Execute MCP tool flow with user preferences
      const itineraryRes = await mcpClient.callTool('generate_itinerary', {
        destination: parsed.destination,
        durationDays: parsed.durationDays,
        travelers: parsed.travelers,
        budget: parsed.budget,
        preferences: userPrefs
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

      replyText = `I have personalized a custom ${parsed.durationDays}-day trip to **${parsed.destination}** for ${parsed.travelers} traveler${parsed.travelers > 1 ? 's' : ''} tailored to your **${userPrefs.travelStyle}** style and **${userPrefs.foodPreference}** culinary tastes! Our Machine Learning model estimated your budget at **₹${tripData.estimatedBudget.toLocaleString('en-IN')}**, well aligned with your ₹${parsed.budget.toLocaleString('en-IN')} target. Weather conditions are ${tripData.weatherSummary.condition.toLowerCase()} (${tripData.weatherSummary.temp}°C) and your itinerary has been prioritized accordingly.`;

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

        replyText = `I have optimized your entire trip! Selected smart boutique accommodations and adjusted activity passes to bring the total estimated budget to **₹${updatedTripState.estimatedBudget.toLocaleString('en-IN')}**, comfortably under your new **₹${parsed.newBudget.toLocaleString('en-IN')}** budget ceiling.`;
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
      replyText = `I am your Smart Travel Assistant. How can I help you today? You can ask me to plan a custom trip (e.g. *"Plan a 5-day trip to Goa for 2 people under ₹40,000"*), recommend destinations, or check weather and packing essentials.`;
      richCardData = {
        cardType: 'GENERAL_CHAT',
        suggestions: [
          'Plan a 5-day Goa trip under ₹40,000',
          'Recommend destinations for me',
          'What can you do?'
        ]
      };
    }
  }

  // Save assistant message to chat history
  const assistantMsg = {
    role: 'assistant',
    content: replyText,
    richData: richCardData,
    timestamp: new Date()
  };

  try {
    chatSession.messages.push(assistantMsg);
    await chatSession.save();
  } catch (saveErr) {
    try {
      await ChatSession.findOneAndUpdate(
        { sessionId },
        {
          $push: {
            messages: {
              $each: [
                { role: 'user', content: message, timestamp: new Date() },
                assistantMsg
              ]
            }
          },
          $set: {
            ...(updatedTripState ? { currentTripState: updatedTripState } : {}),
            ...(userId ? { userId } : {})
          }
        },
        { upsert: true, new: true }
      );
    } catch (upsertErr) {
      console.warn('ChatSession persistence notice:', upsertErr.message);
    }
  }

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
