import sys
import os
import json
import joblib
import pandas as pd

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def get_model():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "models", "budget_model.joblib")
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found at {model_path}. Please run train_model.py first.")
    return joblib.load(model_path)

def predict(input_data):
    model = get_model()
    
    # Normalize keys if needed
    data = {
        "destination": input_data.get("destination", "Goa"),
        "duration_days": int(input_data.get("duration_days", input_data.get("duration", 5))),
        "travelers": int(input_data.get("travelers", 2)),
        "hotel_rating": int(input_data.get("hotel_rating", input_data.get("hotelRating", 3))),
        "transportation": input_data.get("transportation", "Flight"),
        "season": input_data.get("season", "Shoulder"),
        "activities_count": int(input_data.get("activities_count", input_data.get("activitiesCount", 4))),
        "food_preference": input_data.get("food_preference", input_data.get("foodPreference", "Non-Veg")),
        "travel_style": input_data.get("travel_style", input_data.get("travelStyle", "Moderate")),
    }

    df = pd.DataFrame([data])
    predicted_value = model.predict(df)[0]
    estimated_total = int(round(predicted_value, -1))

    # Category breakdown calculations based on predicted total
    # Flight/Transport: ~30-35%, Hotel: ~35-40%, Food: ~15%, Activities: ~10-15%, Misc: ~5%
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
        "parameters": data,
        "per_person_budget": int(round(estimated_total / max(1, data["travelers"]), -1)),
        "per_day_budget": int(round(estimated_total / max(1, data["duration_days"]), -1))
    }

if __name__ == "__main__":
    try:
        raw_input = None
        if len(sys.argv) > 1:
            raw_input = " ".join(sys.argv[1:])
        elif not sys.stdin.isatty():
            raw_input = sys.stdin.read()

        if raw_input:
            raw_input = raw_input.strip()
            # If wrapped in outer quotes or escaped
            if (raw_input.startswith("'") and raw_input.endswith("'")) or (raw_input.startswith('"') and raw_input.endswith('"')):
                raw_input = raw_input[1:-1]
            try:
                params = json.loads(raw_input)
            except Exception:
                # Try replacing single quotes with double quotes
                normalized = raw_input.replace("'", '"')
                params = json.loads(normalized)
            res = predict(params)
            print(json.dumps(res))
        else:
            # Default test run
            res = predict({"destination": "Goa", "duration_days": 5, "travelers": 2, "hotel_rating": 3})
            print(json.dumps(res))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
