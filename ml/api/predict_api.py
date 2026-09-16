from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Literal
import os
import joblib
import pandas as pd

app = FastAPI(
    title="Smart Travel AI - Budget Prediction ML Microservice",
    description="Random Forest Regression Service for Estimating Travel Budgets",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BudgetRequest(BaseModel):
    destination: str = Field(default="Goa", description="Travel destination name")
    duration_days: int = Field(default=5, ge=1, le=30, description="Duration of the trip in days")
    travelers: int = Field(default=2, ge=1, le=20, description="Number of travelers")
    hotel_rating: int = Field(default=3, ge=1, le=5, description="Hotel star rating (1 to 5)")
    transportation: str = Field(default="Flight", description="Mode of travel: Flight, Train, Bus, or Car")
    season: str = Field(default="Shoulder", description="Season: Peak, Shoulder, or Off-Peak")
    activities_count: int = Field(default=4, ge=0, le=50, description="Estimated number of activities planned")
    food_preference: str = Field(default="Non-Veg", description="Food preference")
    travel_style: str = Field(default="Moderate", description="Travel style: Budget, Moderate, or Luxury")

# Load model globally on startup
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models", "budget_model.joblib")
model = None

@app.on_event("startup")
def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"Loaded Budget Model from {MODEL_PATH}")
    else:
        print(f"Warning: Model file not found at {MODEL_PATH}. Prediction endpoints may fail until trained.")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "service": "Travel AI Budget Predictor"
    }

@app.post("/predict_budget")
def predict_budget(req: BudgetRequest):
    global model
    if model is None:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
        else:
            raise HTTPException(status_code=503, detail="Model is not trained yet. Run train_model.py.")

    input_data = {
        "destination": req.destination,
        "duration_days": req.duration_days,
        "travelers": req.travelers,
        "hotel_rating": req.hotel_rating,
        "transportation": req.transportation,
        "season": req.season,
        "activities_count": req.activities_count,
        "food_preference": req.food_preference,
        "travel_style": req.travel_style,
    }

    try:
        df = pd.DataFrame([input_data])
        raw_pred = model.predict(df)[0]
        estimated_total = int(round(raw_pred, -1))

        breakdown = {
            "transport": int(round(estimated_total * 0.32, -1)),
            "accommodation": int(round(estimated_total * 0.38, -1)),
            "food_and_dining": int(round(estimated_total * 0.15, -1)),
            "activities": int(round(estimated_total * 0.10, -1)),
            "contingency_and_local": int(round(estimated_total * 0.05, -1))
        }

        return {
            "success": True,
            "estimated_budget": estimated_total,
            "currency": "INR",
            "currency_symbol": "₹",
            "breakdown": breakdown,
            "parameters": input_data,
            "per_person_budget": int(round(estimated_total / max(1, req.travelers), -1)),
            "per_day_budget": int(round(estimated_total / max(1, req.duration_days), -1)),
            "confidence_interval": {
                "lower": int(round(estimated_total * 0.92, -1)),
                "upper": int(round(estimated_total * 1.08, -1))
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("predict_api:app", host="0.0.0.0", port=8000, reload=True)
