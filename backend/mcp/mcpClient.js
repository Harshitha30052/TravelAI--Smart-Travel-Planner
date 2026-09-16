const { weatherTools } = require('./servers/weatherServer');
const { travelTools } = require('./servers/travelServer');
const { tripTools } = require('./servers/tripServer');

/**
 * MCP Client
 * Registers and executes tools from all MCP Servers
 */

class MCPClient {
  constructor() {
    this.tools = new Map();
    this.registerServers();
  }

  registerServers() {
    // Weather MCP Tools
    this.registerTool('get_weather', weatherTools.get_weather, 'Get current weather and conditions for a destination');
    this.registerTool('get_forecast', weatherTools.get_forecast, 'Get 5-14 day weather forecast for trip dates');
    this.registerTool('get_weather_alerts', weatherTools.get_weather_alerts, 'Check meteorological travel warnings and alerts');

    // Travel MCP Tools
    this.registerTool('search_hotels', travelTools.search_hotels, 'Search accommodations by destination, dates, budget and rating');
    this.registerTool('search_places', travelTools.search_places, 'Find tourist attractions, heritage monuments and sights');
    this.registerTool('get_place_details', travelTools.get_place_details, 'Get detailed information about a specific attraction');
    this.registerTool('search_activities', travelTools.search_activities, 'Find adventure, cultural, relaxation and food activities');

    // Trip MCP Tools
    this.registerTool('create_trip', tripTools.create_trip, 'Persist a planned trip to the database');
    this.registerTool('get_trip', tripTools.get_trip, 'Fetch an existing trip by ID');
    this.registerTool('update_trip', tripTools.update_trip, 'Update an existing trip record');
    this.registerTool('generate_itinerary', tripTools.generate_itinerary, 'Generate an end-to-end weather-aware itinerary with ML budget');
    this.registerTool('modify_itinerary', tripTools.modify_itinerary, 'Modify specific day activity or optimize total trip budget');
    this.registerTool('predict_budget', tripTools.predict_budget, 'Invoke ML Random Forest model for budget prediction');
    this.registerTool('generate_packing_list', tripTools.generate_packing_list, 'Generate weather-aware customized packing checklist');
  }

  registerTool(name, handler, description) {
    this.tools.set(name, { handler, description });
  }

  async callTool(name, params = {}) {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`MCP Tool '${name}' is not registered in any MCP Server.`);
    }
    return await tool.handler(params);
  }

  listTools() {
    const list = [];
    for (const [name, meta] of this.tools.entries()) {
      list.push({ name, description: meta.description });
    }
    return list;
  }
}

const mcpClient = new MCPClient();

module.exports = mcpClient;
