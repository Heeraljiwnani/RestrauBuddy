from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load Model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "demand_prediction_model.pkl")
FEATURES_PATH = os.path.join(os.path.dirname(__file__), "model", "model_features.pkl")

model = joblib.load(MODEL_PATH)
feature_columns = joblib.load(FEATURES_PATH)

# Dish list matching training
DISHES = [
    "Biryani",
    "Paneer Butter Masala",
    "Dosa",
    "Burger",
    "Pizza"
]

def get_day_type(date_str):
    # Determine if weekend or weekday
    try:
        date = pd.to_datetime(date_str)
        if date.dayofweek >= 5: # 5=Sat, 6=Sun
            return "Weekend"
        return "Weekday"
    except:
        return "Weekday"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    
    customers = data.get("customers", 100)
    is_festival = 1 if data.get("is_festival", False) else 0
    unexpected_surge = 1 if data.get("unexpected_surge", False) else 0
    date_str = data.get("date", pd.Timestamp.now().strftime("%Y-%m-%d"))
    day_type = get_day_type(date_str)

    rows = []
    for dish in DISHES:
        rows.append({
            "customers": customers,
            "is_festival": is_festival,
            "unexpected_surge": unexpected_surge,
            "day_type": day_type,
            "dish": dish
        })

    X = pd.DataFrame(rows)
    X = pd.get_dummies(X)
    X = X.reindex(columns=feature_columns, fill_value=0)

    predictions = model.predict(X)

    recommendations = []
    for i, dish in enumerate(DISHES):
        recommendations.append({
            "dish": dish,
            "predicted_quantity": int(predictions[i]),
            "status": "High Demand" if predictions[i] > 40 else "Stable"
        })

    return jsonify({
        "date": date_str,
        "customers": customers,
        "recommendations": recommendations,
        "summary": f"Targeting {customers} customers on a {day_type}."
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)
