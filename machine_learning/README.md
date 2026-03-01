# 🤖 RestrauBuddy - Machine Learning

![RestrauBuddy Banner](../assets/banner.png)

This directory contains the core machine learning logic for RestrauBuddy, including data generation, model training, and prediction scripts.

## 🧠 Model Overview

The system uses a **Random Forest Regressor** to predict the quantity of dishes sold based on several features:
- **Customers**: Estimated footfall for the day.
- **Day Type**: Weekday vs. Weekend.
- **Is Festival**: Boolean flag for local holidays/festivals.
- **Unexpected Surge**: Real-time adjustments based on live events.
- **Dish**: Specific item categorization for tailored predictions.

## 📂 File Structure

- `generate_data.py`: Script to generate synthetic restaurant sales data for training.
- `train_model.py`: Trains the Random Forest model and saves it as a `.pkl` file.
- `predict_future.py`: Utility script for testing predictions locally.
- `synthetic_restaurant_data.csv`: The dataset used for training.
- `demand_prediction_model.pkl`: The trained model binary.
- `model_features.pkl`: Saved feature columns to ensure consistency in the API.

## 🛠️ Usage

### 1. Data Generation
To generate fresh synthetic data:
```bash
python generate_data.py
```

### 2. Training the Model
To retrain the model on the generated data:
```bash
python train_model.py
```
This will output the **Mean Absolute Error (MAE)** and **R2 Score** to validage model performance.

### 3. Feature Importance
After training, check `feature_importance.csv` to see which factors (e.g., footfall, festivals) most significantly impact demand.

## 📈 Performance
The model is optimized for high accuracy in predicting high-demand items like Biryani and Paneer Butter Masala, allowing restaurants to reduce waste while maximizing availability.
