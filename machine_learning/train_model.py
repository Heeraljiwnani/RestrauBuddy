import pandas as pd 


df = pd.read_csv("synthetic_restaurant_data.csv")


y = df["quantity_sold"]
X = df[
    [
        "customers",
        "is_festival",
        "unexpected_surge",
        "day_type",
        "dish"
    ]
]
X = pd.get_dummies(X, drop_first=True)

from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

from sklearn.ensemble import RandomForestRegressor

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

from sklearn.metrics import mean_absolute_error, r2_score

predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("Mean Absolute Error:", mae)
print("R2 Score:", r2)
import joblib

joblib.dump(model, "demand_prediction_model.pkl")
print("Model saved successfully!")
feature_columns = X.columns
joblib.dump(feature_columns, "model_features.pkl")


importance_df = pd.DataFrame({
    "feature": X.columns,
    "importance": model.feature_importances_
}).sort_values(by="importance", ascending=False)

importance_df.to_csv("feature_importance.csv", index=False)

print("\nTop Important Features:")
print(importance_df.head(10))