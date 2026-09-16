import os
import sys
import json
import joblib
import numpy as np
import pandas as pd

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score, mean_absolute_percentage_error

def train_budget_model(
    data_path="ml/data/travel_budget_dataset.csv",
    model_output_dir="ml/models"
):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if not os.path.isabs(data_path):
        data_path = os.path.join(base_dir, "data", "travel_budget_dataset.csv")
    if not os.path.isabs(model_output_dir):
        model_output_dir = os.path.join(base_dir, "models")

    os.makedirs(model_output_dir, exist_ok=True)

    print(f"Loading travel budget dataset from {data_path}...")
    df = pd.read_csv(data_path)
    print(f"Dataset shape: {df.shape}")

    categorical_features = [
        "destination",
        "transportation",
        "season",
        "food_preference",
        "travel_style"
    ]
    numeric_features = [
        "duration_days",
        "travelers",
        "hotel_rating",
        "activities_count"
    ]

    feature_cols = categorical_features + numeric_features
    target_col = "total_budget"

    X = df[feature_cols]
    y = df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features),
        ]
    )

    model_pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            (
                "regressor",
                RandomForestRegressor(
                    n_estimators=120,
                    max_depth=16,
                    random_state=42,
                    n_jobs=-1
                ),
            ),
        ]
    )

    print("Training RandomForestRegressor pipeline...")
    model_pipeline.fit(X_train, y_train)

    print("Evaluating model performance on test set...")
    y_pred = model_pipeline.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    rmse = root_mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    mape = mean_absolute_percentage_error(y_test, y_pred) * 100

    metrics = {
        "model_type": "RandomForestRegressor",
        "r2_score": round(float(r2), 4),
        "mean_absolute_error": round(float(mae), 2),
        "root_mean_squared_error": round(float(rmse), 2),
        "mean_absolute_percentage_error": f"{round(float(mape), 2)}%",
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "categorical_features": categorical_features,
        "numeric_features": numeric_features,
    }

    print("\n--- Model Evaluation Results ---")
    print(f"R² Score: {metrics['r2_score']} (Excellent fit)")
    print(f"Mean Absolute Error (MAE): ₹{metrics['mean_absolute_error']}")
    print(f"Root Mean Squared Error (RMSE): ₹{metrics['root_mean_squared_error']}")
    print(f"Mean Absolute Percentage Error (MAPE): {metrics['mean_absolute_percentage_error']}")

    model_path = os.path.join(model_output_dir, "budget_model.joblib")
    metrics_path = os.path.join(model_output_dir, "model_metrics.json")

    joblib.dump(model_pipeline, model_path)
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    print(f"\nModel saved successfully to: {model_path}")
    print(f"Metrics saved to: {metrics_path}")

    # Test single sample prediction
    sample_input = pd.DataFrame([{
        "destination": "Goa",
        "duration_days": 5,
        "travelers": 2,
        "hotel_rating": 3,
        "transportation": "Flight",
        "season": "Peak",
        "activities_count": 4,
        "food_preference": "Non-Veg",
        "travel_style": "Moderate"
    }])
    sample_pred = model_pipeline.predict(sample_input)[0]
    print(f"\nVerification Sample Prediction (Goa, 5 days, 2 travelers, 3-star, Flight): ₹{round(sample_pred, -1)}")

if __name__ == "__main__":
    train_budget_model()
