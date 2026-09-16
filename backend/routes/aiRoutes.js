const express = require('express');
const router = express.Router();
const {
  chatWithAI,
  getChatSession,
  predictBudgetEndpoint,
  getWeatherEndpoint,
  getPackingEndpoint
} = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/chat', optionalAuth, chatWithAI);
router.get('/session/:sessionId', getChatSession);
router.post('/predict-budget', predictBudgetEndpoint);
router.post('/weather', getWeatherEndpoint);
router.post('/packing', getPackingEndpoint);

module.exports = router;
