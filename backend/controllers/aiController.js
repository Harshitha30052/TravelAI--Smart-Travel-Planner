const jwt = require('jsonwebtoken');
const { handleAIChat } = require('../services/aiAgent');
const ChatSession = require('../models/ChatSession');
const mcpClient = require('../mcp/mcpClient');

// @desc    Process conversational chat message with AI Agent
// @route   POST /api/ai/chat
// @access  Public / Private
const chatWithAI = async (req, res) => {
  try {
    const { sessionId, message, token } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
    }

    const currentSessionId = sessionId || ('sess-' + Math.random().toString(36).substring(2, 10));
    let userId = req.user ? req.user._id : null;

    if (!userId && token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'travel_ai_super_secret_jwt_key_2026');
        userId = decoded.id;
      } catch (e) {
        // Ignore token decode error
      }
    }

    const result = await handleAIChat({
      sessionId: currentSessionId,
      message,
      userId
    });

    res.json(result);
  } catch (error) {
    console.error('AI chat controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process AI assistant request. Please try again.',
      error: error.message
    });
  }
};

// @desc    Retrieve chat session history & active trip state
// @route   GET /api/ai/session/:sessionId
// @access  Public
const getChatSession = async (req, res) => {
  try {
    const session = await ChatSession.findOne({ sessionId: req.params.sessionId });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Direct Budget Prediction via ML Model
// @route   POST /api/ai/predict-budget
// @access  Public
const predictBudgetEndpoint = async (req, res) => {
  try {
    const prediction = await mcpClient.callTool('predict_budget', req.body);
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Direct Weather Forecast lookup
// @route   POST /api/ai/weather
// @access  Public
const getWeatherEndpoint = async (req, res) => {
  try {
    const { destination, durationDays = 5 } = req.body;
    const forecast = await mcpClient.callTool('get_forecast', { destination, durationDays });
    res.json({ success: true, forecast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Direct Packing Checklist lookup
// @route   POST /api/ai/packing
// @access  Public
const getPackingEndpoint = async (req, res) => {
  try {
    const list = await mcpClient.callTool('generate_packing_list', req.body);
    res.json({ success: true, packingList: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  chatWithAI,
  getChatSession,
  predictBudgetEndpoint,
  getWeatherEndpoint,
  getPackingEndpoint
};
