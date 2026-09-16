const { spawn } = require('child_process');
const path = require('path');
const axios = require('axios');

/**
 * Budget ML Prediction Service
 * Communicates with the Python scikit-learn Random Forest model
 */

const FASTAPI_URL = process.env.ML_API_URL || 'http://127.0.0.1:8000';

const predictBudgetWithFastAPI = async (features) => {
  try {
    const response = await axios.post(`${FASTAPI_URL}/predict_budget`, features, { timeout: 1500 });
    if (response.data && response.data.success) {
      return response.data;
    }
  } catch (error) {
    // Microservice might not be running, fallback to CLI bridge
    return null;
  }
};

const predictBudgetWithCLI = (features) => {
  return new Promise((resolve) => {
    try {
      const cliPath = path.resolve(__dirname, '../../ml/predict_cli.py');
      const pyProcess = spawn('python', [cliPath], {
        windowsHide: true,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdoutData = '';
      let stderrData = '';

      pyProcess.stdout.on('data', (data) => {
        stdoutData += data.toString('utf-8');
      });

      pyProcess.stderr.on('data', (data) => {
        stderrData += data.toString('utf-8');
      });

      pyProcess.on('close', (code) => {
        if (code === 0 && stdoutData.trim()) {
          try {
            const parsed = JSON.parse(stdoutData.trim());
            if (parsed.success) {
              return resolve(parsed);
            }
          } catch (err) {
            console.error('CLI JSON parse error:', err.message, stdoutData);
          }
        }
        resolve(null);
      });

      pyProcess.on('error', (err) => {
        console.error('Failed to spawn Python CLI:', err.message);
        resolve(null);
      });

      // Write JSON to stdin
      pyProcess.stdin.write(JSON.stringify(features));
      pyProcess.stdin.end();
    } catch (err) {
      console.error('predictBudgetWithCLI error:', err);
      resolve(null);
    }
  });
};

const calculateAnalyticalBudget = (features) => {
  const destination = features.destination || 'Goa';
  const duration = parseInt(features.duration_days || features.duration || 5, 10);
  const travelers = parseInt(features.travelers || 2, 10);
  const hotelRating = parseInt(features.hotel_rating || features.hotelRating || 3, 10);
  const transport = features.transportation || 'Flight';

  const hotelPerNight = { 1: 1200, 2: 2400, 3: 4200, 4: 8500, 5: 18000 }[hotelRating] || 4200;
  const transportCost = { Flight: 4500, Train: 1200, Bus: 800, Car: 1800 }[transport] || 4500;

  const rooms = Math.ceil(travelers / 2);
  const nights = Math.max(1, duration - 1);

  const totalTransport = transportCost * 2 * travelers;
  const totalHotel = hotelPerNight * nights * rooms;
  const totalFood = 1000 * duration * travelers;
  const totalActivities = (features.activities_count || 4) * 900 * travelers;
  const misc = 400 * duration * travelers;

  const total = Math.round((totalTransport + totalHotel + totalFood + totalActivities + misc) / 10) * 10;

  return {
    success: true,
    estimated_budget: total,
    currency: 'INR',
    currency_symbol: '₹',
    breakdown: {
      transport: Math.round(total * 0.32 / 10) * 10,
      accommodation: Math.round(total * 0.38 / 10) * 10,
      food_and_dining: Math.round(total * 0.15 / 10) * 10,
      activities: Math.round(total * 0.10 / 10) * 10,
      contingency_and_local: Math.round(total * 0.05 / 10) * 10
    },
    per_person_budget: Math.round(total / Math.max(1, travelers) / 10) * 10,
    per_day_budget: Math.round(total / Math.max(1, duration) / 10) * 10
  };
};

const predictTravelBudget = async (inputFeatures) => {
  // 1. Try FastAPI microservice
  const apiResult = await predictBudgetWithFastAPI(inputFeatures);
  if (apiResult) return apiResult;

  // 2. Try Python CLI bridge
  const cliResult = await predictBudgetWithCLI(inputFeatures);
  if (cliResult) return cliResult;

  // 3. Fallback to analytical calculation
  return calculateAnalyticalBudget(inputFeatures);
};

module.exports = { predictTravelBudget };
