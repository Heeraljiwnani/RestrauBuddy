import pandas as pd
import joblib

# -------------------------
# LOAD MODEL & FEATURES
# -------------------------
model = joblib.load("demand_prediction_model.pkl")
feature_columns = joblib.load("model_features.pkl")

# -------------------------
# DISH LIST (MUST MATCH TRAINING)
# -------------------------
dishes = [
    "Biryani",
    "Paneer Butter Masala",
    "Dosa",
    "Burger",
    "Pizza"
]

# -------------------------
# PREDICTION FUNCTION
# -------------------------
def predict_for_day(
    customers,
    is_festival,
    unexpected_surge,
    day_type
):
    rows = []

    # Create one row per dish
    for dish in dishes:
        rows.append({
            "customers": customers,
            "is_festival": is_festival,
            "unexpected_surge": unexpected_surge,
            "day_type": day_type,
            "dish": dish
        })

    # Convert to DataFrame
    X = pd.DataFrame(rows)

    # One-hot encode
    X = pd.get_dummies(X)

    # 🔑 CRITICAL FIX: Align with training features
    X = X.reindex(columns=feature_columns, fill_value=0)

    # Predict
    predictions = model.predict(X)

    # Output DataFrame
    result = pd.DataFrame({
        "dish": dishes,
        "predicted_quantity": predictions.astype(int)
    })

    return result

# -------------------------
# TEST FUTURE SCENARIO
# -------------------------
if __name__ == "__main__":
    # Example: Weekend + Festival + No surge
    prediction = predict_for_day(
        customers=130,
        is_festival=1,
        unexpected_surge=0,
        day_type="Weekend"
    )

    print("\nPredicted Demand:\n")
    print(prediction)
